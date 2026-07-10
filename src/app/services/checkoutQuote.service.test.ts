import { describe, it, expect } from 'vitest';
import {
  buildCheckoutEnvioForQuote,
  mapCartItemsToQuotePayload,
} from './checkoutQuote.service';
import type { CartItem, ShippingData } from '@/app/types/cart';

describe('checkoutQuote.service', () => {
  const cartItem: CartItem = {
    product: {
      id: 10,
      productoWebId: 10,
      productoPadreId: 5,
      sfactoryItemId: 99,
      nombre: 'Remera',
      codigo: 'REM-1',
      precioLista: 100,
      precio: 85,
    },
    quantity: 2,
    especificaciones: 'Talle: M | Color: Negro',
    bordado: true,
  };

  it('mapCartItemsToQuotePayload omite precios del cliente', () => {
    const payload = mapCartItemsToQuotePayload([cartItem]);
    expect(payload).toEqual([
      {
        productoWebId: 10,
        cantidad: 2,
        talle: 'M',
        color: 'Negro',
        bordado: true,
      },
    ]);
    expect(payload[0]).not.toHaveProperty('precioUnitario');
  });

  it('buildCheckoutEnvioForQuote omite monto y bulto', () => {
    const shipping: ShippingData = {
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
    const envio = buildCheckoutEnvioForQuote(shipping);
    expect(envio?.cpDestino).toBe('5000');
    expect(envio).not.toHaveProperty('clientQuotedAmount');
    expect(envio).not.toHaveProperty('parcel');
    expect(envio?.address?.streetName).toBe('Av. Colón');
  });
});
