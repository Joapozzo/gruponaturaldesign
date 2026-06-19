import { describe, expect, it } from 'vitest';
import { buildHastaCuotasConMpLabel, buildPromoCuotasLabel } from './precioDisplay';

describe('buildHastaCuotasConMpLabel', () => {
  it('formatea plural', () => {
    expect(buildHastaCuotasConMpLabel(3)).toBe('Hasta 3 cuotas con Mercado Pago');
  });

  it('formatea singular', () => {
    expect(buildHastaCuotasConMpLabel(1)).toBe('Hasta 1 cuota con Mercado Pago');
  });
});

describe('buildPromoCuotasLabel', () => {
  it('formatea banner en mayúsculas', () => {
    expect(buildPromoCuotasLabel(3)).toBe('HASTA 3 CUOTAS');
  });
});
