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
  pendingLabel = 'Pendiente — se generará al confirmar el pedido o al crear el envío en el carrier.',
}: PedidoShippingTrackingFieldProps) {
  if (!showWhenPending && !trackingNumber && !trackingUrl) return null;

  return (
    <div className="sm:col-span-2">
      <dt className="text-neutral-500">Número de envío</dt>
      <dd className="space-y-1">
        {shippingProvider ? (
          <p className="text-xs text-neutral-500">{shippingProviderLabel(shippingProvider)}</p>
        ) : null}
        {trackingNumber ? (
          <ShippingTrackingNumberButton trackingNumber={trackingNumber} onClick={onOpenTracking} />
        ) : showWhenPending ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-1.5">
            {pendingLabel}
          </p>
        ) : null}
        {trackingUrl ? (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 hover:underline"
          >
            Abrir en sitio del transportista
            <ExternalLink className="w-3 h-3" aria-hidden />
          </a>
        ) : null}
      </dd>
    </div>
  );
}
