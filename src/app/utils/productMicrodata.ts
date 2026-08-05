import type { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { BRAND_NAME } from '@/app/utils/constants';
import { normalizeImageUrl } from '@/app/utils/normalizeImageUrl';
import { seoConfig } from '@/app/utils/seo';

export type ProductPageQuery = {
  color?: string | string[];
  talle?: string | string[];
};

function firstQueryValue(value: string | string[] | undefined): string | null {
  if (value == null) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || null;
}

function parsePrice(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return raw;
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  return null;
}

/** Misma regla que Meta Pixel: preferir codigo de variante. */
export function resolveVariantContentId(variant: ProductVariant): string {
  const codigo = variant.codigo?.trim();
  if (codigo) return codigo;
  if (variant.productoWebId != null) return String(variant.productoWebId);
  if (variant.sfactoryItemId != null) return String(variant.sfactoryItemId);
  return '';
}

export function resolveVariantForMicrodata(
  grouped: GroupedProduct,
  query: ProductPageQuery = {}
): ProductVariant | null {
  const variants = grouped.variants ?? [];
  if (variants.length === 0) return null;

  const color = firstQueryValue(query.color)?.toLowerCase() ?? null;
  const talle = firstQueryValue(query.talle) ?? null;

  if (color || talle) {
    const matched = variants.find((v) => {
      const colorOk = !color || v.color?.toLowerCase() === color;
      const talleOk =
        !talle ||
        v.talle?.toLowerCase() === talle.toLowerCase() ||
        v.talle === talle;
      return colorOk && talleOk;
    });
    if (matched) return matched;

    if (color) {
      const byColor = variants.find((v) => v.color?.toLowerCase() === color);
      if (byColor) return byColor;
    }
    if (talle) {
      const byTalle = variants.find(
        (v) =>
          v.talle?.toLowerCase() === talle.toLowerCase() || v.talle === talle
      );
      if (byTalle) return byTalle;
    }
  }

  const withStock = variants.find((v) => (v.stock ?? 0) > 0);
  return withStock ?? variants[0] ?? null;
}

function buildProductPageUrl(
  slug: string,
  variant: ProductVariant,
  query: ProductPageQuery
): string {
  const base = `${seoConfig.siteUrl}/producto/${slug}`;
  const params = new URLSearchParams();
  const color =
    firstQueryValue(query.color) ??
    (variant.color ? variant.color.toLowerCase() : null);
  const talle = firstQueryValue(query.talle) ?? variant.talle ?? null;
  if (color) params.set('color', color);
  if (talle) params.set('talle', talle);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export interface ProductMicrodata {
  contentId: string;
  jsonLd: Record<string, unknown>;
  /** Meta tags `product:*` para Open Graph / Commerce */
  openGraphProduct: Record<string, string>;
  imageUrl: string | null;
  price: number | null;
  inStock: boolean;
}

export function buildProductMicrodata(
  grouped: GroupedProduct,
  slug: string,
  query: ProductPageQuery = {},
  description?: string
): ProductMicrodata | null {
  const variant = resolveVariantForMicrodata(grouped, query);
  if (!variant) return null;

  const contentId = resolveVariantContentId(variant);
  if (!contentId) return null;

  const display = grouped.displayProduct;
  const price =
    parsePrice(variant.producto?.PrecioVenta) ??
    parsePrice(display?.precioLista) ??
    parsePrice(display?.PrecioVenta);

  const inStock = (variant.stock ?? 0) > 0;
  const availability = inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const ogAvailability = inStock ? 'in stock' : 'out of stock';

  const rawImage =
    variant.producto?.imagen ??
    display?.imagen ??
    null;
  const imageUrl = normalizeImageUrl(rawImage);
  const absoluteImage =
    imageUrl &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
      ? imageUrl
      : imageUrl
        ? `${seoConfig.siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
        : null;

  const name = grouped.skuBase || display?.NOMBRE || 'Producto';
  const productUrl = buildProductPageUrl(slug, variant, query);
  const desc =
    description?.trim() ||
    display?.Descripcion?.trim() ||
    name;

  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url: productUrl,
    priceCurrency: 'ARS',
    availability,
    itemCondition: 'https://schema.org/NewCondition',
  };
  if (price != null) {
    offer.price = Number(price.toFixed(2));
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name,
    description: desc,
    sku: contentId,
    productID: contentId,
    mpn: contentId,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    offers: offer,
  };

  if (absoluteImage) {
    jsonLd.image = [absoluteImage];
  }

  const groupId = grouped.skuBaseSlug || grouped.skuBase;
  if (groupId) {
    jsonLd.isVariantOf = {
      '@type': 'ProductGroup',
      name: grouped.skuBase || name,
      productGroupID: groupId,
    };
  }

  const openGraphProduct: Record<string, string> = {
    'product:retailer_item_id': contentId,
    'product:condition': 'new',
    'product:availability': ogAvailability,
    'product:brand': BRAND_NAME,
  };
  if (price != null) {
    openGraphProduct['product:price:amount'] = String(Number(price.toFixed(2)));
    openGraphProduct['product:price:currency'] = 'ARS';
  }
  if (groupId) {
    openGraphProduct['product:item_group_id'] = String(groupId);
  }

  return {
    contentId,
    jsonLd,
    openGraphProduct,
    imageUrl: absoluteImage,
    price,
    inStock,
  };
}
