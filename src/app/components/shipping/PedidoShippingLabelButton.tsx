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
  const message =
    availability?.message ??
    (isLoadingAvailability ? 'Consultando disponibilidad…' : 'Etiqueta no disponible');
  const showCorreoLink = availability?.reason === 'correo_portal_only';
  const buttonDisabled =
    disabled || isDownloading || isLoadingAvailability || !canDownload;

  return (
    <div className={className}>
      <Button
        type="button"
        size={size}
        variant={variant}
        disabled={buttonDisabled}
        loading={isDownloading}
        title={buttonDisabled ? message : 'Descargar PDF para imprimir manualmente'}
        aria-label={`Descargar etiqueta pedido ${pedidoId}`}
        leftIcon={!isDownloading ? <Download className="w-3.5 h-3.5" aria-hidden /> : undefined}
        onClick={onDownload}
      >
        {isDownloading ? 'Descargando…' : 'Descargar etiqueta'}
      </Button>
      {!canDownload && availability ? (
        <p className="mt-1.5 text-xs text-neutral-600">{message}</p>
      ) : null}
      {showCorreoLink ? (
        <a
          href={MICORREO_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-900 hover:underline"
        >
          Abrir portal MiCorreo
          <ExternalLink className="w-3 h-3" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
