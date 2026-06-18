'use client';

import { Download, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { PedidoLabelAvailability } from '@/app/validation/pedidoShippingLabel.schema';

const MICORREO_PORTAL_URL = 'https://www.correoargentino.com.ar/MiCorreo';

interface PedidoShippingLabelButtonProps {
  pedidoId: number;
  availability: PedidoLabelAvailability | undefined;
  isLoadingAvailability?: boolean;
  isDownloading?: boolean;
  disabled?: boolean;
  onDownload: () => void;
  size?: 'xs' | 'sm';
  variant?: 'ghost' | 'black' | 'blackOutline' | 'grayOutline';
  className?: string;
}

export function PedidoShippingLabelButton({
  pedidoId,
  availability,
  isLoadingAvailability = false,
  isDownloading = false,
  disabled = false,
  onDownload,
  size = 'sm',
  variant = 'grayOutline',
  className,
}: PedidoShippingLabelButtonProps) {
  const canDownload = availability?.canDownload === true;
  const showCorreoLink = availability?.reason === 'correo_portal_only';
  const message =
    availability?.message ??
    (isLoadingAvailability ? 'Consultando…' : 'Etiqueta no disponible');
  const buttonDisabled =
    disabled || isDownloading || isLoadingAvailability || !canDownload;

  if (showCorreoLink) {
    return (
      <a
        href={MICORREO_PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:underline ${className ?? ''}`}
      >
        Abrir MiCorreo
        <ExternalLink className="w-3.5 h-3.5" aria-hidden />
      </a>
    );
  }

  return (
    <div className={className}>
      <Button
        type="button"
        size={size}
        variant={variant}
        disabled={buttonDisabled}
        loading={isDownloading}
        title={buttonDisabled ? message : 'Descargar PDF para imprimir'}
        aria-label={`Descargar etiqueta pedido ${pedidoId}`}
        leftIcon={!isDownloading ? <Download className="w-3.5 h-3.5" aria-hidden /> : undefined}
        onClick={onDownload}
      >
        {isDownloading ? 'Descargando…' : 'Descargar etiqueta'}
      </Button>
      {!canDownload && availability && !isLoadingAvailability ? (
        <p className="mt-1.5 text-xs text-neutral-500">{message}</p>
      ) : null}
    </div>
  );
}
