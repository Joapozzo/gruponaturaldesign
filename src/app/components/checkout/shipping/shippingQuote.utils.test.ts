import { describe, it, expect } from 'vitest';
import {
  sortCorreoByPrice,
  defaultCorreoServiceCode,
  resolveCorreoSelection,
  canTriggerQuote,
} from './shippingQuote.utils';
import type { CheckoutCorreoOpcionQuote } from '@/app/services/checkoutShipping.service';

const opts: CheckoutCorreoOpcionQuote[] = [
  { price: 3000, serviceCode: 'EXP' },
  { price: 1500, serviceCode: 'STD' },
];

describe('shippingQuote.utils', () => {
  it('sortCorreoByPrice ordena ascendente', () => {
    expect(sortCorreoByPrice(opts).map((o) => o.price)).toEqual([1500, 3000]);
  });

  it('defaultCorreoServiceCode elige el más barato', () => {
    expect(defaultCorreoServiceCode(opts)).toBe('STD');
  });

  it('resolveCorreoSelection por serviceCode', () => {
    const q = { precio: 999, correoOpciones: opts };
    expect(resolveCorreoSelection(q, 'EXP')).toEqual({ price: 3000, serviceCode: 'EXP' });
  });

  it('resolveCorreoSelection por índice numérico (orden del array original)', () => {
    const q = { precio: 999, correoOpciones: opts };
    expect(resolveCorreoSelection(q, '0')).toEqual({ price: 3000, serviceCode: 'EXP' });
    expect(resolveCorreoSelection(q, '1')).toEqual({ price: 1500, serviceCode: 'STD' });
  });

  it('resolveCorreoSelection sin opciones usa precio base', () => {
    expect(resolveCorreoSelection({ precio: 500 }, undefined)).toEqual({ price: 500 });
  });

  it('canTriggerQuote requiere datos de envío completos', () => {
    expect(canTriggerQuote({ tipo: 'retiro' })).toBe(false);
    expect(
      canTriggerQuote({
        tipo: 'envio',
        direccion: 'Calle 1',
        localidad: 'CABA',
        provincia: 'BA',
        codigo_postal: '1406',
      })
    ).toBe(true);
    expect(
      canTriggerQuote({
        tipo: 'envio',
        direccion: 'Calle 1',
        localidad: 'CABA',
        provincia: 'BA',
        codigo_postal: '1',
      })
    ).toBe(false);
  });
});
