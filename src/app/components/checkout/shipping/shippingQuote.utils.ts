import type {
  CheckoutCorreoOpcionQuote,
  CheckoutShippingProvider,
  CheckoutShippingDeliveryType,
} from '@/app/services/checkoutShipping.service';

export type ShippingQuoteOptionId =
  | 'correo-home'
  | 'correo-agency'
  | 'andreani-home';

export const QUOTE_OPTIONS: {
  id: ShippingQuoteOptionId;
  provider: CheckoutShippingProvider;
  deliveryType: CheckoutShippingDeliveryType;
  carrierLabel: string;
  modalityLabel: string;
}[] = [
  {
    id: 'correo-home',
    provider: 'correo',
    deliveryType: 'homeDelivery',
    carrierLabel: 'Correo Argentino',
    modalityLabel: 'A domicilio',
  },
  {
    id: 'correo-agency',
    provider: 'correo',
    deliveryType: 'agency',
    carrierLabel: 'Correo Argentino',
    modalityLabel: 'Retiro en sucursal',
  },
  {
    id: 'andreani-home',
    provider: 'andreani',
    deliveryType: 'homeDelivery',
    carrierLabel: 'Andreani',
    modalityLabel: 'A domicilio',
  },
];

export type QuoteResult =
  | {
      precio: number;
      correoOpciones?: CheckoutCorreoOpcionQuote[];
    }
  | { error: string };

export function sortCorreoByPrice(opts: CheckoutCorreoOpcionQuote[]): CheckoutCorreoOpcionQuote[] {
  return [...opts].sort((a, b) => a.price - b.price);
}

export function defaultCorreoServiceCode(opts: CheckoutCorreoOpcionQuote[]): string | undefined {
  return sortCorreoByPrice(opts)[0]?.serviceCode;
}

/** Tarifa Correo según código elegido o la más barata por defecto */
export function resolveCorreoSelection(
  q: Extract<QuoteResult, { precio: number }>,
  pickedCode: string | undefined
): { price: number; serviceCode?: string } {
  const opts = q.correoOpciones;
  if (!opts?.length) return { price: q.precio };
  const defCode = defaultCorreoServiceCode(opts);
  const code = pickedCode ?? defCode;
  if (!code) {
    const row = sortCorreoByPrice(opts)[0];
    return { price: row.price, serviceCode: row.serviceCode };
  }
  if (/^\d+$/.test(code.trim())) {
    const idx = parseInt(code, 10);
    if (Number.isFinite(idx) && opts[idx]) {
      return { price: opts[idx].price, serviceCode: opts[idx].serviceCode };
    }
  }
  const upper = code.trim().toUpperCase();
  const row =
    opts.find((o) => o.serviceCode && o.serviceCode.trim().toUpperCase() === upper) ??
    sortCorreoByPrice(opts)[0];
  return { price: row.price, serviceCode: row.serviceCode };
}

export function canTriggerQuote(shipping: {
  tipo: string;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  codigo_postal?: string;
}): boolean {
  if (shipping.tipo !== 'envio') return false;
  if (!shipping.direccion?.trim()) return false;
  if (!shipping.localidad?.trim()) return false;
  if (!shipping.provincia?.trim()) return false;
  if (!shipping.codigo_postal?.trim() || shipping.codigo_postal.trim().length < 2) return false;
  return true;
}
