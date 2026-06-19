import { describe, it, expect } from 'vitest';
import type { CartItem } from '@/app/types/cart';
import {
  resolveCheckoutPriceMode,
  resolveCartLineSubtotal,
  resolveCartProductsTotal,
  resolveCheckoutUnitPrice,
} from '@/app/utils/checkoutPricing';
import { mapCartItemsToMpPayload } from '@/app/services/checkoutMp.service';

const baseItem: CartItem = {
  product: {
    id: 1,
    nombre: 'Remera',
    descripcion: '',
    categoria: 'Ropa',
    precio: 100,
    precioLista: 121,
    precioTransfer: 102.85,
    imagen: '/x.jpg',
    codigo: 'REM-1',
  },
  quantity: 2,
  subtotal: 242,
  subtotalTransfer: 205.7,
};

describe('checkoutPricing', () => {
  it('resolveCheckoutPriceMode distingue MP transfer/financiado vs manual', () => {
    expect(resolveCheckoutPriceMode('mercado_pago', 'financiado')).toBe('lista');
    expect(resolveCheckoutPriceMode('mercado_pago', 'transfer')).toBe('transfer');
    expect(resolveCheckoutPriceMode('transferencia')).toBe('transfer');
    expect(resolveCheckoutPriceMode('efectivo')).toBe('transfer');
  });

  it('resolveCheckoutUnitPrice usa transfer o lista', () => {
    expect(resolveCheckoutUnitPrice(baseItem.product, 'lista')).toBe(121);
    expect(resolveCheckoutUnitPrice(baseItem.product, 'transfer')).toBe(102.85);
  });

  it('resolveCartLineSubtotal respeta subtotales del carrito', () => {
    expect(resolveCartLineSubtotal(baseItem, 'lista')).toBe(242);
    expect(resolveCartLineSubtotal(baseItem, 'transfer')).toBe(205.7);
  });

  it('resolveCartProductsTotal suma por modo', () => {
    expect(resolveCartProductsTotal([baseItem], 'lista')).toBe(242);
    expect(resolveCartProductsTotal([baseItem], 'transfer')).toBe(205.7);
  });
});

describe('mapCartItemsToMpPayload', () => {
  it('envía precio lista para MP financiado', () => {
    const rows = mapCartItemsToMpPayload([baseItem], 'lista');
    expect(rows[0]?.precioUnitario).toBe(121);
  });

  it('envía precio transfer para MP transfer o manual', () => {
    const rows = mapCartItemsToMpPayload([baseItem], 'transfer');
    expect(rows[0]?.precioUnitario).toBe(102.85);
  });
});
