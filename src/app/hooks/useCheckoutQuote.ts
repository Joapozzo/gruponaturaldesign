'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CartItem, ShippingData, MpCheckoutModo } from '@/app/types/cart';
import {
  buildCheckoutEnvioForQuote,
  fetchCheckoutQuote,
  mapCartItemsToQuotePayload,
  type CheckoutQuoteResult,
} from '@/app/services/checkoutQuote.service';

type PaymentMetodo = 'transferencia' | 'efectivo' | 'mercado_pago';

export interface UseCheckoutQuoteParams {
  items: CartItem[];
  shippingData: ShippingData | null;
  paymentMetodo: PaymentMetodo;
  mpModo?: MpCheckoutModo;
  cuponCodigo?: string;
  enabled?: boolean;
}

export interface UseCheckoutQuoteResult {
  quote: CheckoutQuoteResult | null;
  mpQuotes: { transfer: CheckoutQuoteResult | null; financiado: CheckoutQuoteResult | null };
  loading: boolean;
  error: string | null;
  refresh: () => Promise<CheckoutQuoteResult | null>;
}

function buildQuoteRequest(
  params: UseCheckoutQuoteParams,
  mpPricingMode?: MpCheckoutModo
): Parameters<typeof fetchCheckoutQuote>[0] | null {
  if (!params.items.length) return null;
  const checkoutEnvio =
    params.shippingData?.tipo === 'envio' && params.shippingData.checkoutEnvio
      ? buildCheckoutEnvioForQuote(params.shippingData)
      : undefined;

  if (params.paymentMetodo === 'mercado_pago') {
    const mode = mpPricingMode ?? params.mpModo ?? 'financiado';
    return {
      items: mapCartItemsToQuotePayload(params.items),
      checkoutEnvio,
      paymentKind: 'mercado_pago',
      mpPricingMode: mode,
      ...(params.cuponCodigo ? { cuponCodigo: params.cuponCodigo } : {}),
    };
  }

  return {
    items: mapCartItemsToQuotePayload(params.items),
    checkoutEnvio,
    paymentKind: 'manual',
    manualFormaPago: params.paymentMetodo,
    ...(params.cuponCodigo ? { cuponCodigo: params.cuponCodigo } : {}),
  };
}

export function useCheckoutQuote(params: UseCheckoutQuoteParams): UseCheckoutQuoteResult {
  const { enabled = true } = params;
  const [quote, setQuote] = useState<CheckoutQuoteResult | null>(null);
  const [mpQuotes, setMpQuotes] = useState<{
    transfer: CheckoutQuoteResult | null;
    financiado: CheckoutQuoteResult | null;
  }>({ transfer: null, financiado: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seqRef = useRef(0);

  const refresh = useCallback(async (): Promise<CheckoutQuoteResult | null> => {
    if (!enabled || !params.items.length) {
      setQuote(null);
      setMpQuotes({ transfer: null, financiado: null });
      return null;
    }

    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);

    try {
      if (params.paymentMetodo === 'mercado_pago') {
        const reqTransfer = buildQuoteRequest(params, 'transfer');
        const reqFin = buildQuoteRequest(params, 'financiado');
        if (!reqTransfer || !reqFin) {
          setQuote(null);
          setMpQuotes({ transfer: null, financiado: null });
          return null;
        }
        const [transfer, financiado] = await Promise.all([
          fetchCheckoutQuote(reqTransfer),
          fetchCheckoutQuote(reqFin),
        ]);
        if (seq !== seqRef.current) return null;
        setMpQuotes({ transfer, financiado });
        const active =
          (params.mpModo ?? 'financiado') === 'transfer' ? transfer : financiado;
        setQuote(active);
        return active;
      }

      const req = buildQuoteRequest(params);
      if (!req) {
        setQuote(null);
        return null;
      }
      const result = await fetchCheckoutQuote(req);
      if (seq !== seqRef.current) return null;
      setQuote(result);
      setMpQuotes({ transfer: null, financiado: null });
      return result;
    } catch (e: unknown) {
      if (seq !== seqRef.current) return null;
      const msg = e instanceof Error ? e.message : 'No se pudo calcular el total';
      setError(msg);
      setQuote(null);
      setMpQuotes({ transfer: null, financiado: null });
      return null;
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, [
    enabled,
    params.items,
    params.shippingData,
    params.paymentMetodo,
    params.mpModo,
    params.cuponCodigo,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  return { quote, mpQuotes, loading, error, refresh };
}
