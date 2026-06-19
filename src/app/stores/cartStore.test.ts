import { describe, it, expect } from 'vitest';
import { calculateTotals } from './cartTotals';
import type { CartItem } from '@/app/types/cart';

function item(partial: Partial<CartItem> & Pick<CartItem, 'product' | 'quantity' | 'subtotal'>): CartItem {
  return partial as CartItem;
}

describe('calculateTotals', () => {
  it('calcula totales con un item', () => {
    const items: CartItem[] = [
      item({
        product: { id: 1, nombre: 'Remera', precio: 100, precioLista: 121 },
        quantity: 2,
        subtotal: 242,
      }),
    ];

    const result = calculateTotals(items);

    expect(result.itemCount).toBe(2);
    expect(result.totalLista).toBe(242);
    expect(result.iva).toBeCloseTo(42, 0);
    expect(result.total).toBe(242);
  });

  it('calcula totales con múltiples items', () => {
    const items: CartItem[] = [
      item({
        product: { id: 1, nombre: 'Remera', precio: 100, precioLista: 121 },
        quantity: 2,
        subtotal: 242,
      }),
      item({
        product: { id: 2, nombre: 'Pantalón', precio: 200, precioLista: 242 },
        quantity: 1,
        subtotal: 242,
      }),
    ];

    const result = calculateTotals(items);

    expect(result.itemCount).toBe(3);
    expect(result.totalLista).toBe(484);
  });

  it('calcula totales con precio transfer', () => {
    const items: CartItem[] = [
      item({
        product: { id: 1, nombre: 'Remera', precio: 100, precioLista: 121, precioTransfer: 85 },
        quantity: 2,
        subtotal: 242,
        subtotalTransfer: 170,
      }),
    ];

    const result = calculateTotals(items);

    expect(result.totalLista).toBe(242);
    expect(result.totalTransfer).toBe(170);
    expect(result.subtotalTransfer).toBeCloseTo(140.5, 1);
  });

  it('retorna cero para empty array', () => {
    expect(calculateTotals([])).toMatchObject({
      itemCount: 0,
      totalLista: 0,
      total: 0,
    });
  });

  it('calcula IVA correctamente (21%)', () => {
    const items: CartItem[] = [
      item({
        product: { id: 1, nombre: 'Remera', precio: 100, precioLista: 121 },
        quantity: 1,
        subtotal: 121,
      }),
    ];

    const result = calculateTotals(items);

    expect(result.subtotal).toBe(100);
    expect(result.iva).toBe(21);
    expect(result.total).toBe(121);
  });

  it('usa precioLista cuando subtotal es 0', () => {
    const result = calculateTotals([
      item({
        product: { id: 1, nombre: 'X', precio: 100, precioLista: 121 },
        quantity: 1,
        subtotal: 0,
      }),
    ]);
    expect(result.totalLista).toBe(121);
  });
});
