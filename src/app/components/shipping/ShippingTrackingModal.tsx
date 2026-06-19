'use client';

import { useEffect, useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import BaseModal from '@/app/components/modal/BaseModal';
import Button from '@/components/ui/Button';
import { ShippingProviderOptionCard } from '@/app/components/shipping/ShippingProviderOptionCard';
import { ShippingProviderLogo } from '@/app/components/shipping/ShippingProviderLogo';
import { ShippingTrackingTimeline } from '@/app/components/shipping/ShippingTrackingTimeline';
import {
  SHIPPING_TRACKING_PROVIDERS,
  buildClientShippingTrackingUrl,
} from '@/app/components/shipping/shippingTracking.constants';
import { useShippingTrackingQuery } from '@/app/hooks/useShippingTrackingQuery';
import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';

function getQueryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (error && typeof error === 'object') {
    const o = error as { message?: unknown; error?: unknown };
    if (typeof o.message === 'string' && o.message.trim()) return o.message;
    if (typeof o.error === 'string' && o.error.trim()) return o.error;
  }
  return 'Error al consultar';
}

export type ShippingTrackingModalInitial = {
  pedidoId?: number;
  provider?: ShippingProviderId;
  trackingNumber?: string;
  trackingUrl?: string | null;
};

interface ShippingTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: ShippingTrackingModalInitial;
}

export function ShippingTrackingModal({ isOpen, onClose, initial }: ShippingTrackingModalProps) {
  const [provider, setProvider] = useState<ShippingProviderId | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProvider(null);
      setTrackingNumber('');
      setSubmitted(false);
      return;
    }
    setProvider(initial?.provider ?? null);
    setTrackingNumber(initial?.trackingNumber?.trim() ?? '');
    setSubmitted(Boolean(initial?.provider && initial?.trackingNumber?.trim()));
  }, [isOpen, initial?.provider, initial?.trackingNumber]);

  const query = useShippingTrackingQuery({
    provider,
    trackingNumber,
    pedidoId: initial?.pedidoId,
    enabled: submitted && isOpen,
  });

  const externalUrl =
    provider && trackingNumber.trim()
      ? buildClientShippingTrackingUrl(provider, trackingNumber)
      : initial?.trackingUrl?.trim() || null;

  const primaryResult = query.data?.results[0];
  const displayUrl = query.data?.trackingUrl ?? externalUrl;

  const handleConsult = () => {
    if (!provider || !trackingNumber.trim()) return;
    setSubmitted(true);
  };

  const showProviderStep = provider == null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Seguimiento de envío"
      size="md"
    >
      <div className="space-y-5">
        {showProviderStep ? (
          <div className="space-y-3">
            <p className="text-sm text-neutral-600">Elegí el transportista</p>
            {SHIPPING_TRACKING_PROVIDERS.map((opt) => (
              <ShippingProviderOptionCard
                key={opt.id}
                option={opt}
                selected={false}
                onSelect={() => setProvider(opt.id)}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-neutral-600 shrink-0">Proveedor:</span>
                <ShippingProviderLogo provider={provider} size="sm" showName />
              </div>
              {!initial?.provider ? (
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => {
                    setProvider(null);
                    setSubmitted(false);
                  }}
                >
                  Cambiar
                </button>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="shipping-tracking-number"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
              >
                Nº de seguimiento
              </label>
              <input
                id="shipping-tracking-number"
                type="text"
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setSubmitted(false);
                }}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                placeholder="Pegá el número de envío"
                autoComplete="off"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              disabled={!trackingNumber.trim() || query.isFetching}
              onClick={handleConsult}
            >
              {query.isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  Consultando…
                </>
              ) : (
                'Consultar seguimiento'
              )}
            </Button>

            {query.isError ? (
              <p className="text-sm text-[var(--red)]">{getQueryErrorMessage(query.error)}</p>
            ) : null}

            {submitted && query.isSuccess && primaryResult && primaryResult.events.length === 0 ? (
              <p className="text-sm text-neutral-600">
                No hay eventos de seguimiento disponibles. Podés consultar el envío en el sitio del
                transportista.
              </p>
            ) : null}

            {submitted && query.isSuccess && primaryResult ? (
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 font-mono">{primaryResult.trackingNumber}</p>
                <ShippingTrackingTimeline
                  events={primaryResult.events}
                  trackingNumber={primaryResult.trackingNumber}
                />
              </div>
            ) : null}

            {displayUrl ? (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                Abrir en sitio del transportista
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </>
        )}
      </div>
    </BaseModal>
  );
}
