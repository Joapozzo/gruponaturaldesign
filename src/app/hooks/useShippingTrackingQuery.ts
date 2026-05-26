'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchShippingTracking } from '@/app/services/shippingTracking.service';
import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';

export const shippingTrackingKeys = {
  all: ['shipping', 'tracking'] as const,
  lookup: (provider: ShippingProviderId, trackingNumber: string, pedidoId?: number) =>
    [...shippingTrackingKeys.all, provider, trackingNumber.trim(), pedidoId ?? 'none'] as const,
};

export function useShippingTrackingQuery(params: {
  provider: ShippingProviderId | null;
  trackingNumber: string;
  pedidoId?: number;
  enabled: boolean;
}) {
  const tn = params.trackingNumber.trim();
  return useQuery({
    queryKey: shippingTrackingKeys.lookup(
      params.provider ?? 'andreani',
      tn,
      params.pedidoId
    ),
    queryFn: () =>
      fetchShippingTracking({
        provider: params.provider!,
        trackingNumber: tn,
        pedidoId: params.pedidoId,
      }),
    enabled: params.enabled && params.provider != null && tn.length > 0,
    staleTime: 60_000,
    retry: false,
  });
}
