import { apiClient } from '@/lib/apiClient';
import type { CartItem, CheckoutEnvioSelection } from '@/app/types/cart';
import { resolveCorreoSelection } from '@/app/components/checkout/shipping/shippingQuote.utils';

export type CheckoutShippingProvider = 'correo' | 'andreani';
export type CheckoutShippingDeliveryType = 'homeDelivery' | 'agency';

export interface CheckoutShippingQuoteItem {
  productoWebId: number;
  cantidad: number;
}

export interface CheckoutShippingQuoteBody {
  provider: CheckoutShippingProvider;
  deliveryType: CheckoutShippingDeliveryType;
  items: CheckoutShippingQuoteItem[];
  declaredValueSubtotal: number;
  cpDestino: string;
}

export interface CheckoutShippingParcelDto {
  weightGrams: number;
  height: number;
  width: number;
  depth: number;
  declaredValue: number;
}

export interface CheckoutCorreoOpcionQuote {
  price: number;
  serviceName?: string;
  serviceCode?: string;
  currency?: string;
}

export interface CheckoutShippingQuoteResponse {
  precio: number;
  moneda: string;
  provider: CheckoutShippingProvider;
  parcel: CheckoutShippingParcelDto;
  correoOpciones?: CheckoutCorreoOpcionQuote[];
  raw?: unknown;
}

export interface ShippingAgencyDto {
  agencyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  schedule: string;
  phone?: string;
  email?: string;
}

export function mapCartItemsToShippingQuoteItems(items: CartItem[]): CheckoutShippingQuoteItem[] {
  return items.map((line) => ({
    productoWebId: line.product.productoWebId ?? line.product.id,
    cantidad: line.quantity,
  }));
}

export async function quoteCheckoutShipping(
  body: CheckoutShippingQuoteBody
): Promise<CheckoutShippingQuoteResponse> {
  const res = await apiClient.post<CheckoutShippingQuoteResponse>('/checkout/shipping/quote', body);
  if (!res.success || res.data == null) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudo cotizar el envío';
    throw new Error(msg);
  }
  return res.data;
}

/**
 * Re-cotiza la opción de envío ya elegida con el valor declarado alineado al modo de pago.
 * Actualiza monto y bulto antes de confirmar checkout (MP o manual).
 */
export async function revalidateCheckoutEnvioQuote(
  checkoutEnvio: CheckoutEnvioSelection,
  items: CartItem[],
  declaredValueSubtotal: number
): Promise<CheckoutEnvioSelection> {
  const data = await quoteCheckoutShipping({
    provider: checkoutEnvio.provider,
    deliveryType: checkoutEnvio.deliveryType,
    items: mapCartItemsToShippingQuoteItems(items),
    declaredValueSubtotal,
    cpDestino: checkoutEnvio.cpDestino,
  });

  let clientQuotedAmount = data.precio;
  let correoProductType = checkoutEnvio.correoProductType;

  if (checkoutEnvio.provider === 'correo' && data.correoOpciones?.length) {
    const resolved = resolveCorreoSelection(
      { precio: data.precio, correoOpciones: data.correoOpciones },
      checkoutEnvio.correoProductType
    );
    clientQuotedAmount = resolved.price;
    if (resolved.serviceCode) correoProductType = resolved.serviceCode;
  }

  return {
    ...checkoutEnvio,
    parcel: data.parcel,
    clientQuotedAmount,
    ...(correoProductType ? { correoProductType } : {}),
  };
}

export async function fetchCheckoutShippingAgencies(params: {
  provider: CheckoutShippingProvider;
  stateId: string;
  pickup?: boolean;
  reception?: boolean;
}): Promise<ShippingAgencyDto[]> {
  const sp = new URLSearchParams();
  sp.set('provider', params.provider);
  sp.set('stateId', params.stateId);
  if (params.pickup === true) sp.set('pickup', 'true');
  if (params.reception === true) sp.set('reception', 'true');
  const res = await apiClient.get<ShippingAgencyDto[]>(
    `/checkout/shipping/agencies?${sp.toString()}`
  );
  if (!res.success || res.data == null) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudieron cargar las sucursales';
    throw new Error(msg);
  }
  return Array.isArray(res.data) ? res.data : [];
}
