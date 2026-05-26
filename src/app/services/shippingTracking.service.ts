import { apiClient } from '@/lib/apiClient';
import {
  shippingTrackingResponseSchema,
  type ShippingProviderId,
  type ShippingTrackingResponse,
} from '@/app/validation/shippingTracking.schema';

export async function fetchShippingTracking(params: {
  provider: ShippingProviderId;
  trackingNumber: string;
  pedidoId?: number;
}): Promise<ShippingTrackingResponse> {
  const tn = params.trackingNumber.trim();
  if (params.pedidoId != null) {
    const sp = new URLSearchParams({
      provider: params.provider,
      numbers: tn,
    });
    const res = await apiClient.get<ShippingTrackingResponse['results']>(
      `/shipping/orders/${params.pedidoId}/tracking?${sp.toString()}`
    );
    if (!res.success || !res.data) {
      throw new Error(res.message || res.error || 'No se pudo consultar el seguimiento');
    }
    const parsed = shippingTrackingResponseSchema.safeParse({ results: res.data });
    if (!parsed.success) {
      throw new Error('Respuesta de seguimiento inválida');
    }
    return parsed.data;
  }

  const sp = new URLSearchParams({
    provider: params.provider,
    trackingNumber: tn,
  });
  const res = await apiClient.get<ShippingTrackingResponse>(`/shipping/tracking?${sp.toString()}`);
  if (!res.success || !res.data) {
    throw new Error(res.message || res.error || 'No se pudo consultar el seguimiento');
  }
  const parsed = shippingTrackingResponseSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error('Respuesta de seguimiento inválida');
  }
  return parsed.data;
}
