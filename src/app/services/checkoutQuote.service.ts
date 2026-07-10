import { apiClient } from '@/lib/apiClient';
import { extractApiErrorMessage } from '@/lib/apiErrorMessage';
import type { CartItem, ShippingData, MpCheckoutModo } from '@/app/types/cart';
import { parseProductSpecs } from '@/app/utils/productHelpers';
import { buildCheckoutEnvioForMp } from '@/app/services/checkoutMp.service';

export interface CheckoutQuoteItemPayload {
  productoWebId: number;
  cantidad: number;
  talle?: string;
  color?: string;
  bordado?: boolean;
}

export type CheckoutEnvioQuotePayload = Omit<
  ReturnType<typeof buildCheckoutEnvioForMp> extends infer T ? NonNullable<T> : never,
  'clientQuotedAmount' | 'parcel'
>;

export interface CheckoutQuoteRequest {
  items: CheckoutQuoteItemPayload[];
  checkoutEnvio?: CheckoutEnvioQuotePayload;
  paymentKind: 'mercado_pago' | 'manual';
  mpPricingMode?: MpCheckoutModo;
  manualFormaPago?: 'efectivo' | 'transferencia';
  cuponCodigo?: string;
}

export interface CheckoutQuoteLine {
  productoWebId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  talle?: string;
  color?: string;
  bordado?: boolean;
}

export interface CheckoutQuoteResult {
  quoteId: string;
  expiresAt: string;
  moneda: 'ARS';
  lineas: CheckoutQuoteLine[];
  subtotalProductos: number;
  descuentoCupon: number;
  costoEnvio: number;
  totalFinal: number;
  mpPricingMode?: MpCheckoutModo;
  paymentKind: 'mercado_pago' | 'manual';
  manualFormaPago?: 'efectivo' | 'transferencia';
}

export function mapCartItemsToQuotePayload(items: CartItem[]): CheckoutQuoteItemPayload[] {
  return items.map((line) => {
    const p = line.product;
    const id = p.id;
    const { color, talle } = parseProductSpecs(line.especificaciones);
    return {
      productoWebId: p.productoWebId ?? id,
      cantidad: line.quantity,
      ...(talle ? { talle } : {}),
      ...(color ? { color } : {}),
      ...(line.bordado ? { bordado: true } : {}),
    };
  });
}

/** Envío para quote: sin monto ni bulto (el servidor los calcula). */
export function buildCheckoutEnvioForQuote(
  shipping: ShippingData
): CheckoutEnvioQuotePayload | undefined {
  const mp = buildCheckoutEnvioForMp(shipping);
  if (!mp) return undefined;
  const { clientQuotedAmount: _amount, parcel: _parcel, ...rest } = mp;
  return rest;
}

export async function fetchCheckoutQuote(body: CheckoutQuoteRequest): Promise<CheckoutQuoteResult> {
  try {
    const res = await apiClient.post<CheckoutQuoteResult>('/checkout/quote', body);
    if (!res.success || res.data == null) {
      const msg =
        (res as { message?: string }).message ??
        (res as { error?: string }).error ??
        'No se pudo calcular el total';
      throw new Error(msg);
    }
    return res.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'No se pudo calcular el total'));
  }
}
