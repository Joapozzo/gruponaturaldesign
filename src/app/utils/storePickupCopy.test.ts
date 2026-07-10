import { describe, it, expect } from 'vitest';
import { formatRetiroDemoraLabel } from './storePickupCopy';

describe('formatRetiroDemoraLabel', () => {
  it('agrega contexto a duraciones cortas sueltas', () => {
    expect(formatRetiroDemoraLabel('48hs')).toBe('Preparación estimada: 48 hs');
    expect(formatRetiroDemoraLabel('48-72hs')).toBe('Preparación estimada: 48 a 72 hs');
  });

  it('deja oraciones completas sin cambios', () => {
    const full = 'Demora de 48 a 72 hs para poder retirar';
    expect(formatRetiroDemoraLabel(full)).toBe(full);
  });
});
