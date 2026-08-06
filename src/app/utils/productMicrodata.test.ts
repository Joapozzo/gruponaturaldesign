import { describe, expect, it } from 'vitest';
import type { GroupedProduct, ProductVariant } from '@/app/types/producto';
import {
  buildProductMicrodata,
  resolveVariantContentId,
  resolveVariantForMicrodata,
} from '@/app/utils/productMicrodata';

function variant(partial: Partial<ProductVariant> & { codigo: string }): ProductVariant {
  return {
    variantNumber: 0,
    stock: 1,
    producto: {
      Codigo: partial.codigo,
      NOMBRE: 'Test',
      Descripcion: 'Desc',
      PrecioVenta: 10000,
      precioLista: 10000,
      imagen: 'products/test.jpg',
    } as ProductVariant['producto'],
    ...partial,
  };
}

function group(variants: ProductVariant[]): GroupedProduct {
  return {
    skuBase: 'Camisa Test',
    skuBaseSlug: 'camisa-test',
    displayProduct: variants[0]!.producto,
    variants,
    totalVariants: variants.length,
    availableColors: ['BLANCO', 'NEGRO'],
    availableSizes: ['L', 'M'],
  };
}

describe('productMicrodata', () => {
  it('resolveVariantContentId prefiere codigo', () => {
    expect(
      resolveVariantContentId(variant({ codigo: 'L-WW-CAM-DR39', productoWebId: 1980 }))
    ).toBe('L-WW-CAM-DR39');
  });

  it('resolveVariantForMicrodata usa color+talle de query', () => {
    const g = group([
      variant({ codigo: 'A-1', color: 'BLANCO', talle: '38' }),
      variant({ codigo: 'L-OF-CAM-JOY3', color: 'CELESTE', talle: 'L' }),
    ]);
    const v = resolveVariantForMicrodata(g, { color: 'celeste', talle: 'L' });
    expect(v?.codigo).toBe('L-OF-CAM-JOY3');
  });

  it('buildProductMicrodata incluye id/sku, price y availability', () => {
    const g = group([
      variant({
        codigo: 'L-WW-CAM-DR39',
        color: 'BLANCO',
        talle: '38',
        stock: 2,
        producto: {
          Codigo: 'L-WW-CAM-DR39',
          NOMBRE: 'Camisa Drill',
          Descripcion: 'Camisa Oxford',
          PrecioVenta: 39990,
          precioLista: 39990,
          imagen: 'https://cdn2.naturalonline.com.ar/products/x.jpg',
        } as ProductVariant['producto'],
      }),
    ]);

    const md = buildProductMicrodata(g, 'camisa-drill-l-ww-cam-dr-h', {
      color: 'blanco',
      talle: '38',
    });

    expect(md).not.toBeNull();
    expect(md!.contentId).toBe('L-WW-CAM-DR39');
    expect(md!.jsonLd['@id']).toBe('L-WW-CAM-DR39');
    expect(md!.jsonLd.sku).toBe('L-WW-CAM-DR39');
    expect(md!.jsonLd.productID).toBe('L-WW-CAM-DR39');
    expect((md!.jsonLd.offers as { price: number }).price).toBe(39990);
    expect((md!.jsonLd.offers as { priceCurrency: string }).priceCurrency).toBe('ARS');
    expect((md!.jsonLd.offers as { availability: string }).availability).toBe(
      'https://schema.org/InStock'
    );
    expect(md!.openGraphProduct['product:retailer_item_id']).toBe('L-WW-CAM-DR39');
    expect(md!.openGraphProduct['product:price:amount']).toBe('39990');
    expect(md!.openGraphProduct['product:price:currency']).toBe('ARS');
    expect(md!.openGraphProduct['product:availability']).toBe('in stock');
  });

  it('marca OutOfStock cuando stock es 0', () => {
    const g = group([
      variant({ codigo: 'X-1', stock: 0, color: 'NEGRO', talle: 'M' }),
    ]);
    const md = buildProductMicrodata(g, 'x');
    expect((md!.jsonLd.offers as { availability: string }).availability).toBe(
      'https://schema.org/OutOfStock'
    );
    expect(md!.openGraphProduct['product:availability']).toBe('out of stock');
  });
});
