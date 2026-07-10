import { apiClient } from '@/lib/apiClient';
import type { CartItem, CheckoutEnvioSelection, ShippingData } from '@/app/types/cart';
import { parseProductSpecs } from '@/app/utils/productHelpers';
import {
  type CheckoutPriceMode,
  resolveCheckoutUnitPrice,
} from '@/app/utils/checkoutPricing';
import { buildCheckoutEnvioAddress, formatShippingAddressLine } from '@/app/utils/shippingAddress';

export const CHECKOUT_MP_SNAPSHOT_KEY = 'checkout_mp_snapshot';

export interface CrearPedidoMpItemPayload {
  productoWebId: number;
  productoPadreId: number;
  sfactoryItemId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precioUnitario: number;
  talle?: string;
  color?: string;
  bordado?: boolean;
}

/** Igual que `CheckoutEnvioClientPayload` en API; `address` obligatoria en domicilio. */
export type CheckoutEnvioMpPayload = CheckoutEnvioSelection & {
  address?: {
    streetName: string;
    streetNumber: string;
    city: string;
    state: string;
    zipCode: string;
    floor?: string;
    department?: string;
    barrio?: string;
    loteManzana?: string;
  };
};

export interface CheckoutFacturaPayload {
  necesitaFactura?: boolean;
  facturaTipo?: 'A' | 'C' | null;
  facturaCuit?: string | null;
  facturaRazonSocial?: string | null;
}

export interface IniciarPagoMpBody extends CheckoutFacturaPayload {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  observaciones?: string;
  items: CrearPedidoMpItemPayload[];
  checkoutEnvio?: CheckoutEnvioMpPayload;
  cuponCodigo?: string;
  /** transfer = precio transfer; financiado = precio lista + cuotas MP. */
  mpPricingMode: 'transfer' | 'financiado';
}

/** Arma el payload de envío para MP; `undefined` si no aplica (retiro o falta cotización). */
export function buildCheckoutEnvioForMp(shipping: ShippingData): CheckoutEnvioMpPayload | undefined {
  if (shipping.tipo !== 'envio' || !shipping.checkoutEnvio) return undefined;
  const c = shipping.checkoutEnvio;
  if (c.deliveryType === 'homeDelivery') {
    const address = buildCheckoutEnvioAddress(shipping);
    if (!address) return undefined;
    return { ...c, address };
  }
  return { ...c };
}

export function buildClienteDireccionFromShipping(shipping: ShippingData): string | undefined {
  if (shipping.tipo !== 'envio') return undefined;
  if ((shipping.checkoutDelivery ?? 'homeDelivery') === 'agency' && shipping.checkoutEnvio?.agencyLabel) {
    return `Retiro sucursal: ${shipping.checkoutEnvio.agencyLabel}`;
  }
  const line = formatShippingAddressLine(shipping);
  return line || undefined;
}

export interface IniciarPagoMpResponse {
  pedidoId: number;
  checkoutUrl: string;
  preferenceId: string;
  /** Total productos según S-Factory (post cotización). */
  subtotalProductos?: number;
  costoEnvio?: number;
  totalCobro?: number;
}

import type { MetaPixelAnalytics } from '@/app/analytics/metaPixel/metaPixel.types';

export interface CheckoutMpSnapshot {
  savedAt: number;
  pedidoId?: number;
  clienteEmail?: string;
  totalLabel?: string;
  itemCount?: number;
  analytics?: MetaPixelAnalytics;
}

export function mapCartItemsToMpPayload(
  items: CartItem[],
  priceMode: CheckoutPriceMode = 'lista'
): CrearPedidoMpItemPayload[] {
  return items.map((line) => {
    const p = line.product;
    const id = p.id;
    const precioUnitario = resolveCheckoutUnitPrice(p, priceMode);
    const { color, talle } = parseProductSpecs(line.especificaciones);
    return {
      productoWebId: p.productoWebId ?? id,
      productoPadreId: p.productoPadreId ?? id,
      sfactoryItemId: p.sfactoryItemId ?? id,
      nombre: p.nombre,
      codigo: (p.codigo ?? String(id)).trim() || String(id),
      cantidad: line.quantity,
      precioUnitario,
      ...(talle ? { talle } : {}),
      ...(color ? { color } : {}),
      ...(line.bordado ? { bordado: true } : {}),
    };
  });
}

export function saveCheckoutMpSnapshot(snapshot: Omit<CheckoutMpSnapshot, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  const full: CheckoutMpSnapshot = { ...snapshot, savedAt: Date.now() };
  sessionStorage.setItem(CHECKOUT_MP_SNAPSHOT_KEY, JSON.stringify(full));
}

export function readCheckoutMpSnapshot(): CheckoutMpSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_MP_SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutMpSnapshot;
  } catch {
    return null;
  }
}

export function clearCheckoutMpSnapshot(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CHECKOUT_MP_SNAPSHOT_KEY);
}

/** Cancela en el servidor un checkout MP abandonado (sin pago acreditado). */
export async function abandonarCheckoutMp(pedidoId: number): Promise<void> {
  const res = await apiClient.post<unknown>(
    `/cuenta/pedidos/${pedidoId}/abandonar-checkout`,
    {},
    { suppressAuthRedirect: true }
  );
  if (!res.success) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudo cancelar el checkout';
    throw new Error(msg);
  }
}

export async function iniciarPagoMp(body: IniciarPagoMpBody): Promise<IniciarPagoMpResponse> {
  const res = await apiClient.post<IniciarPagoMpResponse>('/checkout/mp', body);
  if (!res.success || res.data == null) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudo iniciar el pago';
    throw new Error(msg);
  }
  return res.data;
}

export interface IniciarPagoManualBody extends CheckoutFacturaPayload {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  observaciones?: string;
  items: CrearPedidoMpItemPayload[];
  formaPago: 'efectivo' | 'transferencia';
  checkoutEnvio?: CheckoutEnvioMpPayload;
  cuponCodigo?: string;
}

export interface IniciarPagoManualResponse {
  pedidoId: number;
  externalOrderId: string;
  formaPago: 'efectivo' | 'transferencia';
  redirectPath: string;
}

export async function iniciarPagoManual(body: IniciarPagoManualBody): Promise<IniciarPagoManualResponse> {
  const res = await apiClient.post<IniciarPagoManualResponse>('/checkout/manual', body);
  if (!res.success || res.data == null) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudo crear el pedido';
    throw new Error(msg);
  }
  return res.data;
}

export interface PaymentStatusMpResponse {
  pedidoId: number;
  estadoInterno: string;
  mercadoPagoPaymentId: string | null;
  mercadoPagoStatus: string | null;
  total: string;
  mpLiveStatus: string | null;
  paymentMethodId: string | null;
  paymentTypeId: string | null;
  externalReference: string | null;
  offlinePaymentReference: string | null;
}

export async function fetchPaymentStatusMp(pedidoId: number): Promise<PaymentStatusMpResponse> {
  const res = await apiClient.get<PaymentStatusMpResponse>(
    `/checkout/payment-status/${pedidoId}`
  );
  if (!res.success || res.data == null) {
    const msg =
      (res as { message?: string }).message ??
      (res as { error?: string }).error ??
      'No se pudo consultar el estado del pago';
    throw new Error(msg);
  }
  return res.data;
}
