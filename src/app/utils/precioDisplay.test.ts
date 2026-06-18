import { describe, expect, it } from 'vitest';
import { formatCuotasLine } from './precioDisplay';
import type { InstallmentQuote } from '@/app/types/precio.types';

const baseQuote: InstallmentQuote = {
  provider: 'mercado_pago',
  cuotas: 3,
  montoCuota: 40333.33,
  totalFinanciado: 121000,
  sinInteres: true,
  moneda: 'ARS',
};

describe('formatCuotasLine', () => {
  it('formatea N cuotas sin prometer interes cero', () => {
    expect(formatCuotasLine(baseQuote)).toBe('hacelo en 3 cuotas de $40.333,33');
  });

  it('formatea cuotas igual aunque el flag venga en false', () => {
    const q: InstallmentQuote = { ...baseQuote, sinInteres: false };
    expect(formatCuotasLine(q)).toBe('hacelo en 3 cuotas de $40.333,33');
  });

  it('singular para 1 cuota', () => {
    const q: InstallmentQuote = { ...baseQuote, cuotas: 1, montoCuota: 121000 };
    expect(formatCuotasLine(q)).toBe('hacelo en 1 cuota de $121.000,00');
  });
});
