import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isValidPhone,
  validateCheckoutField,
  type CheckoutStep2ValidationContext,
} from './checkoutStep2.validation';
import type { CustomerData, ShippingData } from '@/app/types/cart';

const baseCustomer: CustomerData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'test@gmail.com',
  telefono: '1122334455',
  tipo_documento: 'DNI',
};

const baseShipping: ShippingData = {
  tipo: 'retiro',
};

function ctx(overrides?: Partial<CheckoutStep2ValidationContext>): CheckoutStep2ValidationContext {
  return {
    formData: baseCustomer,
    confirmEmail: 'test@gmail.com',
    shipping: baseShipping,
    ...overrides,
  };
}

describe('checkoutStep2.validation', () => {
  const prev = process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    else process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = prev;
  });

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
  });

  it('isValidPhone acepta teléfonos con al menos 8 dígitos', () => {
    expect(isValidPhone('11 2233-4455')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  it('validateCheckoutField nombre requerido', () => {
    expect(validateCheckoutField('nombre', '', ctx())).toBe('Requerido');
    expect(validateCheckoutField('nombre', 'J', ctx())).toBe('Mínimo 2 caracteres');
  });

  it('validateCheckoutField confirmEmail debe coincidir', () => {
    expect(
      validateCheckoutField('confirmEmail', 'otro@gmail.com', ctx({ confirmEmail: 'otro@gmail.com' }))
    ).toBe('Los emails no coinciden');
  });

  it('validateCheckoutField codigo_postal requerido en envío', () => {
    const shipping: ShippingData = { tipo: 'envio', checkoutDelivery: 'homeDelivery' };
    expect(
      validateCheckoutField('codigo_postal', '', ctx({ shipping, formData: baseCustomer }))
    ).toBe('Requerido para envío');
  });

  it('factura A/C exige tipo, CUIT y razón social', () => {
    const withFactura: CustomerData = {
      ...baseCustomer,
      necesitaFactura: true,
      facturaTipo: undefined,
      cuit: '',
      facturaRazonSocial: '',
    };
    expect(
      validateCheckoutField('facturaTipo', '', ctx({ formData: withFactura }))
    ).toBe('Elegí tipo de factura');
    expect(
      validateCheckoutField('facturaCuit', '123', ctx({ formData: withFactura }))
    ).toMatch(/CUIT/);
    expect(
      validateCheckoutField('facturaRazonSocial', 'A', ctx({ formData: withFactura }))
    ).toMatch(/razón social/i);
  });

  it('calle y número obligatorios en envío a domicilio', () => {
    const shipping: ShippingData = {
      tipo: 'envio',
      checkoutDelivery: 'homeDelivery',
      localidad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
    };
    expect(
      validateCheckoutField('calle', '', ctx({ shipping, formData: baseCustomer }))
    ).toBe('Requerido para envío a domicilio');
    expect(
      validateCheckoutField('numero', '', ctx({ shipping: { ...shipping, calle: 'Colón' }, formData: baseCustomer }))
    ).toBe('Requerido para envío a domicilio');
  });
});
