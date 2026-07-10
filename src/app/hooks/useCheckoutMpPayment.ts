'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MetaPixelAnalytics } from '@/app/analytics/metaPixel/metaPixel.types';
import {
  iniciarPagoMp,
  saveCheckoutMpSnapshot,
  type IniciarPagoMpBody,
} from '@/app/services/checkoutMp.service';

const API_TIMEOUT_MS = 30_000;
const REDIRECT_WATCHDOG_MS = 10_000;

export type MpPaymentPhase = 'idle' | 'creating' | 'redirecting';

interface StartPaymentParams {
  body: IniciarPagoMpBody;
  snapshot?: {
    totalLabel: string;
    itemCount: number;
    clienteEmail?: string;
    analytics?: MetaPixelAnalytics;
  };
  cuponCodigo?: string;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((err: unknown) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

function isValidCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}

export function useCheckoutMpPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<MpPaymentPhase>('idle');
  const [fallbackCheckoutUrl, setFallbackCheckoutUrl] = useState<string | null>(null);
  const redirectWatchdogRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  const clearRedirectWatchdog = useCallback(() => {
    if (redirectWatchdogRef.current != null) {
      window.clearTimeout(redirectWatchdogRef.current);
      redirectWatchdogRef.current = null;
    }
  }, []);

  useEffect(() => () => clearRedirectWatchdog(), [clearRedirectWatchdog]);

  const resetMpPaymentState = useCallback(() => {
    clearRedirectWatchdog();
    inFlightRef.current = false;
    setLoading(false);
    setPhase('idle');
    setFallbackCheckoutUrl(null);
  }, [clearRedirectWatchdog]);

  const startPayment = useCallback(
    async (params: StartPaymentParams): Promise<boolean> => {
      if (inFlightRef.current) return false;

      const { body, snapshot, cuponCodigo } = params;
      inFlightRef.current = true;
      clearRedirectWatchdog();
      setLoading(true);
      setPhase('creating');
      setError(null);
      setFallbackCheckoutUrl(null);

      try {
        const finalBody: IniciarPagoMpBody = {
          ...body,
          ...(cuponCodigo ? { cuponCodigo } : {}),
        };
        const data = await withTimeout(
          iniciarPagoMp(finalBody),
          API_TIMEOUT_MS,
          'La solicitud tardó demasiado. Intentá de nuevo.'
        );

        if (!isValidCheckoutUrl(data.checkoutUrl)) {
          throw new Error('No se recibió un enlace válido de Mercado Pago. Intentá de nuevo.');
        }

        saveCheckoutMpSnapshot({
          ...(snapshot
            ? {
                clienteEmail: snapshot.clienteEmail ?? body.clienteEmail,
                totalLabel: snapshot.totalLabel,
                itemCount: snapshot.itemCount,
                analytics: snapshot.analytics,
              }
            : { clienteEmail: body.clienteEmail }),
          pedidoId: data.pedidoId,
        });

        setPhase('redirecting');
        redirectWatchdogRef.current = window.setTimeout(() => {
          redirectWatchdogRef.current = null;
          inFlightRef.current = false;
          setLoading(false);
          setPhase('idle');
          setError(
            'No pudimos abrir Mercado Pago automáticamente. Usá el enlace para continuar con el pago.'
          );
          setFallbackCheckoutUrl(data.checkoutUrl);
        }, REDIRECT_WATCHDOG_MS);

        window.location.href = data.checkoutUrl;
        return true;
      } catch (e: unknown) {
        clearRedirectWatchdog();
        inFlightRef.current = false;
        const msg = e instanceof Error ? e.message : 'No se pudo iniciar el pago';
        setError(msg);
        setLoading(false);
        setPhase('idle');
        return false;
      }
    },
    [clearRedirectWatchdog]
  );

  const cancelPayment = useCallback(() => {
    resetMpPaymentState();
  }, [resetMpPaymentState]);

  const clearError = useCallback(() => {
    setError(null);
    setFallbackCheckoutUrl(null);
  }, []);

  return {
    startPayment,
    loading,
    error,
    phase,
    fallbackCheckoutUrl,
    cancelPayment,
    clearError,
  };
}
