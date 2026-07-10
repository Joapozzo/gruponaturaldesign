'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ShippingData } from '@/app/types/cart';
import { useCart } from '@/app/components/hooks/useCart';
import { useSales } from '@/app/contexts/SalesContext';
import { useCheckoutShippingForm } from '@/app/hooks/useCheckoutShippingForm';
import {
  quoteCheckoutShipping,
  fetchCheckoutShippingAgencies,
  mapCartItemsToShippingQuoteItems,
  type CheckoutShippingParcelDto,
  type ShippingAgencyDto,
} from '@/app/services/checkoutShipping.service';
import { validateCheckoutShippingOnly } from '@/app/components/checkout/checkoutStep2.validation';
import {
  QUOTE_OPTIONS,
  type QuoteResult,
  type ShippingQuoteOptionId,
  resolveCorreoSelection,
  canTriggerQuote,
  buildShippingAddressQuoteKey,
  shippingPatchAffectsQuote,
  shippingFieldAffectsQuote,
} from '@/app/components/checkout/shipping/shippingQuote.utils';
import { resolveShippingDeclaredValueSubtotal } from '@/app/utils/shippingDeclaredValue';

export interface UseCheckoutStep3ShippingArgs {
  onNext: () => void;
}

export function useCheckoutStep3Shipping({ onNext }: UseCheckoutStep3ShippingArgs) {
  const { shippingData, setShippingData, itemCount, items, subtotal, total, totalLista, totalTransfer } =
    useCart();
  const { isWholesaleLimitReached } = useSales();

  const {
    shipping,
    errors,
    touched,
    handleShippingChange,
    patchShipping,
    handleBlur,
    handleSubmit,
  } = useCheckoutShippingForm(shippingData, setShippingData, isWholesaleLimitReached, onNext);

  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteByOption, setQuoteByOption] = useState<
    Partial<Record<ShippingQuoteOptionId, QuoteResult>>
  >({});
  const [correoRatePick, setCorreoRatePick] = useState<
    Partial<Record<ShippingQuoteOptionId, string>>
  >({});
  const [selectedOptionId, setSelectedOptionId] = useState<ShippingQuoteOptionId | null>(null);
  const [agencyPick, setAgencyPick] = useState<{ id: string; label: string } | null>(null);
  const [agencies, setAgencies] = useState<ShippingAgencyDto[]>([]);
  const [agenciesLoading, setAgenciesLoading] = useState(false);
  const [quotedParcel, setQuotedParcel] = useState<CheckoutShippingParcelDto | null>(null);
  const quotedAddressKeyRef = useRef<string | null>(null);

  const invalidateShippingQuote = useCallback(() => {
    quotedAddressKeyRef.current = null;
    setQuoteByOption({});
    setCorreoRatePick({});
    setSelectedOptionId(null);
    setAgencyPick(null);
    setQuotedParcel(null);
    patchShipping({ checkoutEnvio: undefined });
  }, [patchShipping]);

  const isQuoteFreshForAddress = useCallback(
    (addressKey?: string) => {
      const key = addressKey ?? buildShippingAddressQuoteKey(shipping);
      return quotedAddressKeyRef.current != null && quotedAddressKeyRef.current === key;
    },
    [shipping]
  );

  const handleShippingChangeWrapped = useCallback(
    (field: keyof ShippingData, value: string) => {
      if (shippingFieldAffectsQuote(field) && quotedAddressKeyRef.current) {
        invalidateShippingQuote();
      }
      handleShippingChange(field, value);
    },
    [handleShippingChange, invalidateShippingQuote]
  );

  const patchShippingWrapped = useCallback(
    (patch: Partial<ShippingData>) => {
      if (shippingPatchAffectsQuote(patch) && quotedAddressKeyRef.current) {
        quotedAddressKeyRef.current = null;
        setQuoteByOption({});
        setCorreoRatePick({});
        setSelectedOptionId(null);
        setAgencyPick(null);
        setQuotedParcel(null);
        patchShipping({ ...patch, checkoutEnvio: undefined });
        return;
      }
      patchShipping(patch);
    },
    [patchShipping]
  );

  const resolveActiveParcel = useCallback((): CheckoutShippingParcelDto | null => {
    return quotedParcel ?? shipping.checkoutEnvio?.parcel ?? null;
  }, [quotedParcel, shipping.checkoutEnvio?.parcel]);

  const applySelection = useCallback(
    (
      optionId: ShippingQuoteOptionId,
      quotes: Partial<Record<ShippingQuoteOptionId, QuoteResult>>,
      agency: { id: string; label: string } | null,
      cpDestino: string,
      parcel: {
        weightGrams: number;
        height: number;
        width: number;
        depth: number;
        declaredValue: number;
      },
      rateOverrides?: Partial<Record<ShippingQuoteOptionId, string>>
    ) => {
      const opt = QUOTE_OPTIONS.find((o) => o.id === optionId);
      const q = quotes[optionId];
      if (!opt || !q || 'error' in q) return;
      const currentKey = buildShippingAddressQuoteKey(shipping);
      if (!quotedAddressKeyRef.current || currentKey !== quotedAddressKeyRef.current) return;

      const mergePick = { ...correoRatePick, ...rateOverrides };
      let clientQuotedAmount = q.precio;
      let correoProductType: string | undefined;

      if (opt.provider === 'correo' && q.correoOpciones?.length) {
        const picked = mergePick[optionId];
        const resolved = resolveCorreoSelection(q, picked);
        clientQuotedAmount = resolved.price;
        if (resolved.serviceCode) correoProductType = resolved.serviceCode;
      }

      patchShipping({
        checkoutProvider: opt.provider,
        checkoutDelivery: opt.deliveryType,
        checkoutEnvio: {
          provider: opt.provider,
          deliveryType: opt.deliveryType,
          parcel,
          cpDestino: cpDestino.trim(),
          clientQuotedAmount,
          ...(correoProductType ? { correoProductType } : {}),
          ...(opt.deliveryType === 'agency' && agency
            ? { agencyId: agency.id, agencyLabel: agency.label }
            : {}),
        },
      });
    },
    [patchShipping, correoRatePick, shipping]
  );

  const pickCheapestAndApply = useCallback(
    (
      quotes: Partial<Record<ShippingQuoteOptionId, QuoteResult>>,
      cpDestino: string,
      parcel: {
        weightGrams: number;
        height: number;
        width: number;
        depth: number;
        declaredValue: number;
      }
    ) => {
      let bestId: ShippingQuoteOptionId | null = null;
      let bestPrecio = Infinity;
      for (const id of Object.keys(quotes) as ShippingQuoteOptionId[]) {
        const r = quotes[id];
        if (r && 'precio' in r && r.precio < bestPrecio) {
          bestPrecio = r.precio;
          bestId = id;
        }
      }
      if (bestId == null) return;
      setSelectedOptionId(bestId);
      setAgencyPick(null);
      applySelection(bestId, quotes, null, cpDestino, parcel);
    },
    [applySelection]
  );

  const runQuotes = useCallback(async () => {
    if (!canTriggerQuote(shipping)) return;
    const cp = shipping.codigo_postal!.trim();
    const shippingItems = mapCartItemsToShippingQuoteItems(items);
    if (shippingItems.length === 0) return;

    const declaredValueSubtotal = resolveShippingDeclaredValueSubtotal(
      'lista',
      totalLista,
      totalTransfer
    );

    setQuoteLoading(true);
    setQuoteByOption({});
    setCorreoRatePick({});
    setSelectedOptionId(null);
    quotedAddressKeyRef.current = null;
    patchShipping({ checkoutEnvio: undefined });

    let sharedParcel:
      | {
          weightGrams: number;
          height: number;
          width: number;
          depth: number;
          declaredValue: number;
        }
      | null = null;

    const results = await Promise.all(
      QUOTE_OPTIONS.map(async (opt) => {
        try {
          const data = await quoteCheckoutShipping({
            provider: opt.provider,
            deliveryType: opt.deliveryType,
            items: shippingItems,
            declaredValueSubtotal,
            cpDestino: cp,
          });
          if (!sharedParcel) sharedParcel = data.parcel;
          const correoOpciones =
            opt.provider === 'correo' && data.correoOpciones?.length
              ? data.correoOpciones.map((c) => ({
                  price: c.price,
                  serviceName: c.serviceName,
                  serviceCode: c.serviceCode,
                  currency: c.currency,
                }))
              : undefined;
          return [opt.id, { precio: data.precio, correoOpciones } as QuoteResult] as const;
        } catch (e) {
          return [
            opt.id,
            { error: e instanceof Error ? e.message : 'No disponible' } as QuoteResult,
          ] as const;
        }
      })
    );

    const next: Partial<Record<ShippingQuoteOptionId, QuoteResult>> = {};
    results.forEach(([id, r]) => {
      next[id] = r;
    });
    setQuoteByOption(next);
    setQuoteLoading(false);
    if (sharedParcel) {
      setQuotedParcel(sharedParcel);
      quotedAddressKeyRef.current = buildShippingAddressQuoteKey(shipping);
      pickCheapestAndApply(next, cp, sharedParcel);
    }
  }, [shipping, items, totalLista, totalTransfer, patchShipping, pickCheapestAndApply]);

  const onCodigoPostalBlur = useCallback(() => {
    handleBlur('codigo_postal');
  }, [handleBlur]);

  const canCalculateShipping = useMemo(() => {
    return shipping.tipo === 'envio' && canTriggerQuote(shipping);
  }, [shipping]);

  const calculateShipping = useCallback(() => {
    if (!canCalculateShipping) return;
    void runQuotes();
  }, [canCalculateShipping, runQuotes]);

  const hydratedFromCart = useRef(false);
  useEffect(() => {
    if (hydratedFromCart.current) return;
    const ce = shippingData?.checkoutEnvio;
    const tipo = shippingData?.tipo;
    if (!ce || tipo !== 'envio') return;
    hydratedFromCart.current = true;
    const match = QUOTE_OPTIONS.find(
      (o) => o.provider === ce.provider && o.deliveryType === ce.deliveryType
    );
    if (!match) return;
    setSelectedOptionId(match.id);
    if (ce.correoProductType) {
      setCorreoRatePick((prev) => ({ ...prev, [match.id]: ce.correoProductType! }));
    }
    setQuoteByOption((prev) => ({
      ...prev,
      [match.id]: { precio: ce.clientQuotedAmount },
    }));
    if (ce.deliveryType === 'agency' && ce.agencyId && ce.agencyLabel) {
      setAgencyPick({ id: ce.agencyId, label: ce.agencyLabel });
    }
    if (ce.parcel) {
      setQuotedParcel(ce.parcel);
    }
    if (shippingData) {
      quotedAddressKeyRef.current = buildShippingAddressQuoteKey(shippingData);
    }
  }, [shippingData]);

  useEffect(() => {
    if (shipping.tipo !== 'envio') {
      setAgencies([]);
      return;
    }
    if (!selectedOptionId?.endsWith('-agency')) {
      setAgencies([]);
      return;
    }
    const opt = QUOTE_OPTIONS.find((o) => o.id === selectedOptionId);
    const stateId = shipping.provincia?.trim();
    if (!opt || !stateId) return;

    let cancelled = false;
    setAgenciesLoading(true);
    setAgencies([]);
    void fetchCheckoutShippingAgencies({
      provider: opt.provider,
      stateId,
      reception: true,
    })
      .then((list) => {
        if (!cancelled) setAgencies(list);
      })
      .catch(() => {
        if (!cancelled) setAgencies([]);
      })
      .finally(() => {
        if (!cancelled) setAgenciesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedOptionId, shipping.tipo, shipping.provincia]);

  const handleSelectDeliveryTipo = useCallback(
    (tipo: 'envio' | 'retiro') => {
      quotedAddressKeyRef.current = null;
      setQuoteByOption({});
      setCorreoRatePick({});
      setSelectedOptionId(null);
      setAgencyPick(null);
      setAgencies([]);
      setQuotedParcel(null);
      if (tipo === 'retiro') {
        patchShipping({
          tipo: 'retiro',
          checkoutEnvio: undefined,
          checkoutProvider: undefined,
          checkoutDelivery: undefined,
        });
      } else {
        patchShipping({
          tipo: 'envio',
          checkoutEnvio: undefined,
        });
      }
    },
    [patchShipping]
  );

  const handleOptionCardClick = useCallback(
    (optionId: ShippingQuoteOptionId) => {
      if (!isQuoteFreshForAddress()) return;
      const q = quoteByOption[optionId];
      const parcel = resolveActiveParcel();
      if (!q || 'error' in q || !parcel) return;
      const cp = shipping.codigo_postal?.trim() ?? '';
      setSelectedOptionId(optionId);
      setAgencyPick(null);
      applySelection(optionId, quoteByOption, null, cp, parcel);
    },
    [quoteByOption, applySelection, shipping.codigo_postal, resolveActiveParcel, isQuoteFreshForAddress]
  );

  const handleCorreoRateSelect = useCallback(
    (optionId: ShippingQuoteOptionId, serviceCode: string) => {
      if (!isQuoteFreshForAddress()) return;
      const q = quoteByOption[optionId];
      const parcel = resolveActiveParcel();
      if (!q || 'error' in q || !parcel) return;
      setCorreoRatePick((prev) => ({ ...prev, [optionId]: serviceCode }));
      const cp = shipping.codigo_postal?.trim() ?? '';
      if (selectedOptionId !== optionId) {
        setSelectedOptionId(optionId);
        setAgencyPick(null);
      }
      applySelection(optionId, quoteByOption, null, cp, parcel, { [optionId]: serviceCode });
    },
    [selectedOptionId, applySelection, quoteByOption, shipping.codigo_postal, resolveActiveParcel, isQuoteFreshForAddress]
  );

  const onAgencySelect = useCallback(
    (agencyId: string) => {
      if (!isQuoteFreshForAddress()) return;
      if (!selectedOptionId?.endsWith('-agency')) return;
      const q = quoteByOption[selectedOptionId];
      const parcel = resolveActiveParcel();
      if (!q || 'error' in q || !parcel) return;
      const cp = shipping.codigo_postal?.trim() ?? '';
      const a = agencies.find((x) => x.agencyId === agencyId);
      const label = a ? `${a.name} — ${a.address}` : agencyId;
      setAgencyPick(agencyId ? { id: agencyId, label } : null);
      applySelection(
        selectedOptionId,
        quoteByOption,
        agencyId ? { id: agencyId, label } : null,
        cp,
        parcel
      );
    },
    [selectedOptionId, quoteByOption, agencies, applySelection, shipping.codigo_postal, resolveActiveParcel, isQuoteFreshForAddress]
  );

  const canContinue = useMemo(() => {
    if (isWholesaleLimitReached) return false;
    if (shipping.tipo === 'envio' && shipping.checkoutEnvio && !isQuoteFreshForAddress()) {
      return false;
    }
    return validateCheckoutShippingOnly(shipping).ok;
  }, [shipping, isWholesaleLimitReached, isQuoteFreshForAddress]);

  const continueHint = useMemo(() => {
    if (canContinue) return undefined;
    if (shipping.tipo === 'retiro') return undefined;
    if (shipping.tipo === 'envio' && !validateCheckoutShippingOnly(shipping).ok) {
      if (shipping.checkoutEnvio && !isQuoteFreshForAddress()) {
        return 'La dirección cambió — volvé a calcular el envío';
      }
      if (!shipping.checkoutEnvio?.clientQuotedAmount && Object.keys(quoteByOption).length === 0) {
        return 'Completá la dirección para continuar';
      }
      if (Object.keys(quoteByOption).length > 0 && !shipping.checkoutEnvio) {
        return 'Volvé a calcular el envío después de cambiar la dirección';
      }
      if (
        shipping.checkoutEnvio?.deliveryType === 'agency' &&
        !shipping.checkoutEnvio?.agencyId?.trim()
      ) {
        return 'Elegí una sucursal para continuar';
      }
      return 'Completá la dirección para continuar';
    }
    return undefined;
  }, [canContinue, shipping, quoteByOption, isQuoteFreshForAddress]);

  return {
    items,
    itemCount,
    subtotal,
    total,
    shipping,
    errors,
    touched,
    handleShippingChange: handleShippingChangeWrapped,
    patchShipping: patchShippingWrapped,
    handleBlur,
    handleSubmit,
    quoteLoading,
    quoteByOption,
    correoRatePick,
    selectedOptionId,
    agencyPick,
    agencies,
    agenciesLoading,
    onCodigoPostalBlur,
    canCalculateShipping,
    calculateShipping,
    handleSelectDeliveryTipo,
    handleOptionCardClick,
    handleCorreoRateSelect,
    onAgencySelect,
    canContinue,
    continueHint,
  };
}
