import { describe, it, expect } from 'vitest';
import { buildCheckoutEnvioForMp, buildClienteDireccionFromShipping } from './checkoutMp.service';
import type { ShippingData } from '@/app/types/cart';

describe('checkoutMp build envío', () => {
  const baseShipping: ShippingData = {
    tipo: 'envio',
    checkoutDelivery: 'homeDelivery',
    calle: 'Av. Colón',
    numero: '123',
    localidad: 'Córdoba',
    provincia: 'Córdoba',
    codigo_postal: '5000',
    checkoutEnvio: {
      provider: 'andreani',
      deliveryType: 'homeDelivery',
      cpDestino: '5000',
      clientQuotedAmount: 1500,
      parcel: { weightGrams: 500, height: 10, width: 20, depth: 30, declaredValue: 1000 },
    },
  };

  it('domicilio requiere calle y número en address', () => {
    const envio = buildCheckoutEnvioForMp(baseShipping);
    expect(envio?.address?.streetName).toBe('Av. Colón');
    expect(envio?.address?.streetNumber).toBe('123');
  });

  it('buildClienteDireccionFromShipping formatea línea', () => {
    const line = buildClienteDireccionFromShipping(baseShipping);
    expect(line).toContain('Av. Colón');
    expect(line).toContain('123');
    expect(line).toContain('Córdoba');
  });
});
