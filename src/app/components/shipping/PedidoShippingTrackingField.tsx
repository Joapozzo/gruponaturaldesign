'use client';

import { ExternalLink } from 'lucide-react';
import { ShippingTrackingNumberButton } from '@/app/components/shipping/ShippingTrackingNumberButton';
import { shippingProviderLabel } from '@/app/components/shipping/shippingTracking.constants';
import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';

interface PedidoShippingTrackingFieldProps {
  shippingProvider: ShippingProviderId | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  onOpenTracking: () => void;
  /** Si true, muestra la fila aunque falte el nº (envío postal pendiente). */
  showWhenPending?: boolean;
  pendingLabel?: string;
}

export function PedidoShippingTrackingField({
  shippingProvider,
  trackingNumber,
  trackingUrl,
  onOpenTracking,
  showWhenPending = false,
  pendingLabel = 'Sin número de envío',
}: PedidoShippingTrackingFieldProps) {
  if (!showWhenPending && !trackingNumber && !trackingUrl) return null;

  return (
    <div>
      {shippingProvider ? (
        <p className="text-sm font-medium text-neutral-900">
          {shippingProviderLabel(shippingProvider)}
        </p>
      ) : null}
      <div className={shippingProvider ? 'mt-1.5' : undefined}>
        {trackingNumber ? (
          <ShippingTrackingNumberButton trackingNumber={trackingNumber} onClick={onOpenTracking} />
        ) : showWhenPending ? (
          <p className="text-sm text-neutral-600">{pendingLabel}</p>
        ) : null}
        {trackingUrl ? (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 hover:underline"
          >
            Seguir en sitio del transportista
            <ExternalLink className="w-3 h-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}
