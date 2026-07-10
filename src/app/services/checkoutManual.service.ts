import type { MetaPixelAnalytics } from '@/app/analytics/metaPixel/metaPixel.types';
import { apiClient } from '@/lib/apiClient';

export const CHECKOUT_MANUAL_SNAPSHOT_KEY = 'checkout_manual_snapshot';

export interface DatosBancariosPublic {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  cbu: string | null;
  alias: string | null;
  titular: string;
  cuit: string | null;
  instrucciones: string | null;
}

export interface CheckoutManualSnapshot {
  savedAt: number;
  pedidoId: number;
  externalOrderId: string;
  formaPago: 'transferencia' | 'efectivo';
  totalLabel?: string;
  customerEmail?: string;
  analytics?: MetaPixelAnalytics;
}

export interface InstruccionesPagoResponse {
  pedidoId: number;
  externalOrderId: string;
  formaPago: 'transferencia' | 'efectivo';
  totalFormatted: string;
  expiresAt: string | null;
  customerEmail: string;
  customerName: string;
  bank: DatosBancariosPublic | null;
  bankConfigured: boolean;
}

export function saveCheckoutManualSnapshot(snapshot: Omit<CheckoutManualSnapshot, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  const full: CheckoutManualSnapshot = { ...snapshot, savedAt: Date.now() };
  sessionStorage.setItem(CHECKOUT_MANUAL_SNAPSHOT_KEY, JSON.stringify(full));
}

export function readCheckoutManualSnapshot(): CheckoutManualSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_MANUAL_SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutManualSnapshot;
  } catch {
    return null;
  }
}

/** Quita el snapshot tras confirmar el pedido (p. ej. ya se vació el carrito). */
export function clearCheckoutManualSnapshot(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CHECKOUT_MANUAL_SNAPSHOT_KEY);
}

export async function fetchInstruccionesPago(
  pedidoId: number
): Promise<InstruccionesPagoResponse> {
  const res = await apiClient.get<InstruccionesPagoResponse>(
    `/checkout/pedido/${pedidoId}/instrucciones-pago`
  );
  if (!res.success || res.data == null) {
    throw new Error(
      (res as { message?: string }).message ??
        (res as { error?: string }).error ??
        'No se pudieron cargar las instrucciones de pago'
    );
  }
  return res.data;
}

export async function fetchDatosBancariosPublic(): Promise<DatosBancariosPublic | null> {
  const res = await apiClient.get<DatosBancariosPublic | null>('/checkout/datos-bancarios', {
    skipAuth: true,
  });
  if (!res.success) {
    throw new Error(res.message || 'Error al obtener datos bancarios');
  }
  return res.data ?? null;
}

export interface PrecioConfigPublic {
  descuentoTransferencia: number;
  iva: number;
  cuotasFinanciado: number;
}

export async function fetchPrecioConfigPublic(): Promise<PrecioConfigPublic> {
  const res = await apiClient.get<PrecioConfigPublic>('/checkout/config-precios', {
    skipAuth: true,
  });
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al obtener configuración de precios');
  }
  return res.data;
}
