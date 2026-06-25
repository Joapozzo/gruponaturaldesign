import { describe, it, expect } from 'vitest';
import {
  buildCheckoutEnvioAddress,
  formatShippingAddressLine,
  syncShippingLegacyDireccion,
} from './shippingAddress';
import type { ShippingData } from '@/app/types/cart';

describe('shippingAddress', () => {
  it('formatShippingAddressLine con campos desglosados', () => {
    const shipping: ShippingData = {
      tipo: 'envio',
      calle: 'San Martín',
      numero: '100',
      piso: '2',
      depto: 'A',
      barrio: 'Centro',
      localidad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
    };
    const line = formatShippingAddressLine(shipping);
    expect(line).toContain('San Martín');
    expect(line).toContain('100');
    expect(line).toContain('Piso 2');
    expect(line).toContain('Barrio Centro');
    expect(line).toContain('CP 5000');
  });

  it('buildCheckoutEnvioAddress requiere calle y CP', () => {
    const incomplete: ShippingData = {
      tipo: 'envio',
      localidad: 'Córdoba',
      provincia: 'Córdoba',
    };
    expect(buildCheckoutEnvioAddress(incomplete)).toBeUndefined();

    const complete: ShippingData = {
      tipo: 'envio',
      calle: 'Colón',
      numero: '50',
      localidad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
    };
    expect(buildCheckoutEnvioAddress(complete)?.streetNumber).toBe('50');
  });

  it('syncShippingLegacyDireccion deriva direccion', () => {
    const synced = syncShippingLegacyDireccion({
      tipo: 'envio',
      calle: 'Belgrano',
      numero: '200',
    });
    expect(synced.direccion).toBe('Belgrano 200');
  });
});
