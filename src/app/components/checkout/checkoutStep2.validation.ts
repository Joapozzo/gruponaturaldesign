import type { CustomerData, ShippingData } from '@/app/types/cart';
import { isValidEmailFormat, validateEmailForApp } from '@/lib/email-validation';
import { buildCheckoutEnvioAddress } from '@/app/utils/shippingAddress';

export interface CheckoutStep2FormErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  confirmEmail?: string;
  telefono?: string;
  documento?: string;
  facturaTipo?: string;
  facturaCuit?: string;
  facturaRazonSocial?: string;
  calle?: string;
  numero?: string;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  codigo_postal?: string;
  envio?: string;
}

export interface CheckoutStep2ValidationContext {
  formData: CustomerData;
  confirmEmail: string;
  shipping: ShippingData;
}

/** Contexto mínimo para validar solo campos de envío (validateCheckoutField no usa formData para dirección/CP). */
const DUMMY_CUSTOMER_FOR_SHIPPING: CustomerData = {
  nombre: '',
  apellido: '',
  email: 'x@y.z',
  telefono: '00000000',
  tipo_documento: 'DNI',
};

export { isValidEmailFormat };

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

export function validateCheckoutField(
  name: string,
  value: string,
  ctx: CheckoutStep2ValidationContext
): string | undefined {
  const { formData, confirmEmail, shipping } = ctx;

  switch (name) {
    case 'nombre':
      if (!value.trim()) return 'Requerido';
      if (value.trim().length < 2) return 'Mínimo 2 caracteres';
      break;
    case 'apellido':
      if (!value.trim()) return 'Requerido';
      if (value.trim().length < 2) return 'Mínimo 2 caracteres';
      break;
    case 'email': {
      if (!value.trim()) return 'Requerido';
      const emailErr = validateEmailForApp(value);
      if (emailErr) return emailErr;
      break;
    }
    case 'confirmEmail': {
      if (!value.trim()) return 'Requerido';
      const confirmErr = validateEmailForApp(value);
      if (confirmErr) return confirmErr;
      if (value !== formData.email) return 'Los emails no coinciden';
      break;
    }
    case 'telefono':
      if (!value.trim()) return 'Requerido';
      if (!isValidPhone(value)) return 'Teléfono inválido';
      break;
    case 'documento':
      if (value && value.replace(/\D/g, '').length < 7) {
        return 'Mínimo 7 dígitos';
      }
      break;
    case 'facturaTipo':
      if (formData.necesitaFactura && !value.trim()) return 'Elegí tipo de factura';
      break;
    case 'facturaCuit':
      if (formData.necesitaFactura && value.replace(/\D/g, '').length < 11) {
        return 'CUIT inválido (11 dígitos)';
      }
      break;
    case 'facturaRazonSocial':
      if (formData.necesitaFactura && value.trim().length < 2) {
        return 'Razón social requerida';
      }
      break;
    case 'calle': {
      const dom =
        shipping.tipo === 'envio' && (shipping.checkoutDelivery ?? 'homeDelivery') === 'homeDelivery';
      const street = value.trim() || shipping.direccion?.trim() || '';
      if (dom && !street) return 'Requerido para envío a domicilio';
      break;
    }
    case 'numero': {
      const dom =
        shipping.tipo === 'envio' && (shipping.checkoutDelivery ?? 'homeDelivery') === 'homeDelivery';
      if (dom && !value.trim()) return 'Requerido para envío a domicilio';
      break;
    }
    case 'direccion': {
      const dom =
        shipping.tipo === 'envio' && (shipping.checkoutDelivery ?? 'homeDelivery') === 'homeDelivery';
      if (dom && !value.trim()) {
        return 'Requerido para envío a domicilio';
      }
      break;
    }
    case 'localidad': {
      const dom =
        shipping.tipo === 'envio' && (shipping.checkoutDelivery ?? 'homeDelivery') === 'homeDelivery';
      if (dom && !value.trim()) {
        return 'Requerido para envío a domicilio';
      }
      break;
    }
    case 'provincia':
      if (shipping.tipo === 'envio' && !value.trim()) {
        return 'Requerido para envío';
      }
      break;
    case 'codigo_postal':
      if (shipping.tipo === 'envio' && !value.trim()) {
        return 'Requerido para envío';
      }
      break;
    default:
      break;
  }
  return undefined;
}

export function validateCheckoutCustomerOnly(ctx: {
  formData: CustomerData;
  confirmEmail: string;
}): { ok: boolean; errors: CheckoutStep2FormErrors } {
  const { formData, confirmEmail } = ctx;
  const errors: CheckoutStep2FormErrors = {};
  let ok = true;

  const dummyShipping: ShippingData = {
    tipo: 'retiro',
  };

  const vctx: CheckoutStep2ValidationContext = {
    formData,
    confirmEmail,
    shipping: dummyShipping,
  };

  (['nombre', 'apellido', 'email', 'telefono'] as const).forEach((field) => {
    const err = validateCheckoutField(field, formData[field] ?? '', vctx);
    if (err) {
      errors[field] = err;
      ok = false;
    }
  });

  const confirmErr = validateCheckoutField('confirmEmail', confirmEmail, vctx);
  if (confirmErr) {
    errors.confirmEmail = confirmErr;
    ok = false;
  }

  if (formData.documento) {
    const err = validateCheckoutField('documento', formData.documento, vctx);
    if (err) {
      errors.documento = err;
      ok = false;
    }
  }

  if (formData.necesitaFactura) {
    (['facturaTipo', 'facturaCuit', 'facturaRazonSocial'] as const).forEach((field) => {
      const value =
        field === 'facturaTipo'
          ? formData.facturaTipo ?? ''
          : field === 'facturaCuit'
            ? formData.cuit ?? ''
            : formData.facturaRazonSocial ?? '';
      const err = validateCheckoutField(field, value, vctx);
      if (err) {
        errors[field] = err;
        ok = false;
      }
    });
  }

  return { ok, errors };
}

export function validateCheckoutShippingOnly(shipping: ShippingData): {
  ok: boolean;
  errors: CheckoutStep2FormErrors;
} {
  const errors: CheckoutStep2FormErrors = {};
  let ok = true;

  if (shipping.tipo !== 'envio') {
    return { ok: true, errors: {} };
  }

  const ctx: CheckoutStep2ValidationContext = {
    formData: DUMMY_CUSTOMER_FOR_SHIPPING,
    confirmEmail: DUMMY_CUSTOMER_FOR_SHIPPING.email,
    shipping,
  };

  const delivery = shipping.checkoutDelivery ?? 'homeDelivery';
  if (delivery === 'homeDelivery') {
    (['calle', 'numero', 'localidad'] as const).forEach((field) => {
      const value =
        field === 'calle'
          ? shipping.calle ?? shipping.direccion ?? ''
          : (shipping[field] ?? '');
      const err = validateCheckoutField(field, value, ctx);
      if (err) {
        if (field === 'calle') errors.calle = err;
        else if (field === 'numero') errors.numero = err;
        else errors.localidad = err;
        ok = false;
      }
    });
    if (!buildCheckoutEnvioAddress(shipping)) {
      errors.envio = errors.envio ?? 'Completá la dirección de envío';
      ok = false;
    }
  }
  (['provincia', 'codigo_postal'] as const).forEach((field) => {
    const err = validateCheckoutField(field, shipping[field] ?? '', ctx);
    if (err) {
      errors[field] = err;
      ok = false;
    }
  });

  if (!shipping.checkoutEnvio) {
    errors.envio = 'Elegí una opción de envío cotizada antes de continuar';
    ok = false;
  } else if (
    shipping.checkoutEnvio.deliveryType === 'agency' &&
    !shipping.checkoutEnvio.agencyId?.trim()
  ) {
    errors.envio = 'Elegí una sucursal para continuar';
    ok = false;
  }

  return { ok, errors };
}

export function validateCheckoutStep2All(ctx: CheckoutStep2ValidationContext): {
  ok: boolean;
  errors: CheckoutStep2FormErrors;
} {
  const cust = validateCheckoutCustomerOnly({
    formData: ctx.formData,
    confirmEmail: ctx.confirmEmail,
  });
  const ship = validateCheckoutShippingOnly(ctx.shipping);

  const errors: CheckoutStep2FormErrors = { ...cust.errors, ...ship.errors };
  return { ok: cust.ok && ship.ok, errors };
}

/** Paso "Datos": cliente listo para ir a envío. */
export function isCustomerStepCompleteForCheckout(customerData: CustomerData | null): boolean {
  if (!customerData) return false;
  return validateCheckoutCustomerOnly({
    formData: customerData,
    confirmEmail: customerData.email ?? '',
  }).ok;
}

/** Datos persistidos en carrito tras completar datos + envío; usado para el paso de pago. */
export function isCheckoutDataCompleteForPayment(
  customerData: CustomerData | null,
  shippingData: ShippingData | null
): boolean {
  if (!customerData || !shippingData) return false;
  const ctx: CheckoutStep2ValidationContext = {
    formData: customerData,
    confirmEmail: customerData.email ?? '',
    shipping: shippingData,
  };
  return validateCheckoutStep2All(ctx).ok;
}
