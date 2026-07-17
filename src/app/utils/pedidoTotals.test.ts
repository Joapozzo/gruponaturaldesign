import { describe, it, expect } from 'vitest';
import { computePedidoDescuentoTotal, computePedidoTotalNeto } from './pedidoTotals';

describe('pedidoTotals', () => {
  it('no suma descuento + cuponDescuentoTotal', () => {
    expect(
      computePedidoDescuentoTotal({
        total: 39941.5,
        descuento: 19970.75,
        cuponDescuentoTotal: 19970.75,
      })
    ).toBe(19970.75);
  });

  it('total neto con cupón 50%', () => {
    expect(
      computePedidoTotalNeto({
        total: 39941.5,
        descuento: 19970.75,
        cuponDescuentoTotal: 19970.75,
      })
    ).toBe(19970.75);
  });

  it('sin descuento = bruto', () => {
    expect(computePedidoTotalNeto({ total: 1000, descuento: 0 })).toBe(1000);
  });
});
