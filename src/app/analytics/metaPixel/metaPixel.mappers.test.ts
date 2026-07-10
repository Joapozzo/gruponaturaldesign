import { describe, it, expect } from 'vitest';
import {
  buildMetaPixelAnalyticsFromCart,
  mapCartProductToMetaContent,
  metaAnalyticsToEventParams,
  resolveMetaProductId,
} from '@/app/analytics/metaPixel/metaPixel.mappers';
import type { CartItem, CartProduct } from '@/app/types/cart';

function product(
  partial: Partial<CartProduct> & Pick<CartProduct, 'id' | 'nombre' | 'precio' | 'precioLista'>
): CartProduct {
  return {
    descripcion: '',
    categoria: '',
    imagen: '',
    ...partial,
  };
}

describe('metaPixel.mappers', () => {
  it('resolveMetaProductId prefiere codigo', () => {
    expect(resolveMetaProductId({ id: 9, codigo: 'L-OF-01' })).toBe('L-OF-01');
    expect(resolveMetaProductId({ id: 9, codigo: '  ' })).toBe('9');
  });

  it('mapCartProductToMetaContent usa precioLista', () => {
    const content = mapCartProductToMetaContent(
      product({ id: 1, nombre: 'Remera', precio: 80, precioLista: 100, codigo: 'REM-1' }),
      2
    );
    expect(content).toEqual({ id: 'REM-1', quantity: 2, item_price: 100 });
  });

  it('buildMetaPixelAnalyticsFromCart agrega totales y ids', () => {
    const items: CartItem[] = [
      {
        product: product({
          id: 1,
          nombre: 'A',
          precio: 100,
          precioLista: 121,
          codigo: 'A-1',
        }),
        quantity: 2,
        subtotal: 242,
      },
      {
        product: product({
          id: 2,
          nombre: 'B',
          precio: 50,
          precioLista: 60,
          codigo: 'B-2',
        }),
        quantity: 1,
        subtotal: 60,
      },
    ];

    const analytics = buildMetaPixelAnalyticsFromCart(items, 302);
    expect(analytics.value).toBe(302);
    expect(analytics.currency).toBe('ARS');
    expect(analytics.num_items).toBe(3);
    expect(analytics.content_ids).toEqual(['A-1', 'B-2']);
    expect(metaAnalyticsToEventParams(analytics).content_type).toBe('product');
  });
});
