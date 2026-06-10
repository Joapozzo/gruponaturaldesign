'use client';

import { PedidoShippingLabelButton } from '@/app/components/shipping/PedidoShippingLabelButton';
import type { PedidoLabelAvailability } from '@/app/validation/pedidoShippingLabel.schema';

interface PedidoShippingLabelFieldProps {
  pedidoId: number;
  availability: PedidoLabelAvailability | undefined;
  isLoadingAvailability?: boolean;
  isDownloading?: boolean;
  disabled?: boolean;
  onDownload: () => void;
  /** Si false, no renderiza (ej. retiro en tienda). */
  show?: boolean;
}

export function PedidoShippingLabelField({
  pedidoId,
  availability,
  isLoadingAvailability,
  isDownloading,
  disabled,
  onDownload,
  show = true,
}: PedidoShippingLabelFieldProps) {
  if (!show) return null;

  return (
    <div className="sm:col-span-2">
      <dt className="text-neutral-500">Etiqueta de envío</dt>
      <dd>
        <PedidoShippingLabelButton
          pedidoId={pedidoId}
          availability={availability}
          isLoadingAvailability={isLoadingAvailability}
          isDownloading={isDownloading}
          disabled={disabled}
          onDownload={onDownload}
          size="xs"
          variant="grayOutline"
          className="mt-0.5"
        />
      </dd>
    </div>
  );
}
