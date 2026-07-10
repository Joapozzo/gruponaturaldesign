import type { CartItem, CartProduct } from '@/app/types/cart';
import {
  META_PIXEL_CURRENCY,
  type MetaPixelAnalytics,
  type MetaPixelContent,
} from '@/app/analytics/metaPixel/metaPixel.types';

export function resolveMetaProductId(product: Pick<CartProduct, 'id' | 'codigo'>): string {
  const codigo = product.codigo?.trim();
  if (codigo) return codigo;
  return String(product.id);
}

export function mapCartProductToMetaContent(
  product: CartProduct,
  quantity: number
): MetaPixelContent {
  const itemPrice = product.precioLista ?? product.precio ?? 0;
  return {
    id: resolveMetaProductId(product),
    quantity,
    item_price: itemPrice,
  };
}

export function mapCartItemsToMetaContents(items: CartItem[]): MetaPixelContent[] {
  return items.map((line) => mapCartProductToMetaContent(line.product, line.quantity));
}

export function buildMetaPixelAnalyticsFromCart(
  items: CartItem[],
  value: number
): MetaPixelAnalytics {
  const contents = mapCartItemsToMetaContents(items);
  const numItems = items.reduce((sum, line) => sum + line.quantity, 0);
  return {
    value,
    currency: META_PIXEL_CURRENCY,
    contents,
    content_ids: contents.map((c) => c.id),
    num_items: numItems,
  };
}

export function metaAnalyticsToEventParams(analytics: MetaPixelAnalytics): Record<string, unknown> {
  return {
    value: analytics.value,
    currency: analytics.currency,
    contents: analytics.contents,
    content_ids: analytics.content_ids,
    content_type: 'product',
    num_items: analytics.num_items,
  };
}
