'use client';

import { useEffect, useState } from 'react';
import {
  fetchCuotasQuote,
  fetchPrecioConfigPublic,
  type InstallmentQuotePublic,
} from '@/app/services/checkoutManual.service';

export function useCheckoutInstallmentPreview(
  amount: number,
  enabled: boolean
): {
  quote: InstallmentQuotePublic | null;
  loading: boolean;
  error: string | null;
} {
  const [quote, setQuote] = useState<InstallmentQuotePublic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !Number.isFinite(amount) || amount <= 0) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const config = await fetchPrecioConfigPublic();
        const cuotas = config.cuotasFinanciado ?? 3;
        const data = await fetchCuotasQuote(amount, cuotas);
        if (!cancelled) {
          setQuote(data);
        }
      } catch (e) {
        if (!cancelled) {
          setQuote(null);
          setError(e instanceof Error ? e.message : 'No se pudo cotizar cuotas');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [amount, enabled]);

  return { quote, loading, error };
}
