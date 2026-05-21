import { describe, it, expect } from 'vitest';
import { calcularPreciosDerivados } from './useEmpresaPrecioConfig';

describe('calcularPreciosDerivados', () => {
  it('retorna nulls si precio lista inválido', () => {
    expect(calcularPreciosDerivados(null)).toEqual({
      precioTransfer: null,
      precioFinanciado: null,
      precioSinImp: null,
      cuotas: 3,
    });
    expect(calcularPreciosDerivados(0).precioTransfer).toBeNull();
  });

  it('usa defaults 15% descuento, 21% IVA, 3 cuotas', () => {
    const r = calcularPreciosDerivados(121);
    expect(r.precioTransfer).toBeCloseTo(102.85, 2);
    expect(r.precioFinanciado).toBeCloseTo(40.33, 2);
    expect(r.precioSinImp).toBeCloseTo(85, 1);
    expect(r.cuotas).toBe(3);
  });

  it('respeta config custom', () => {
    const r = calcularPreciosDerivados(200, {
      descuentoTransferencia: 0.1,
      iva: 0.21,
      cuotasFinanciado: 6,
    });
    expect(r.precioTransfer).toBe(180);
    expect(r.cuotas).toBe(6);
  });
});
