'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ShippingData } from '@/app/types/cart';
import {
  validateCheckoutField,
  validateCheckoutShippingOnly,
  type CheckoutStep2FormErrors,
  type CheckoutStep2ValidationContext,
} from '@/app/components/checkout/checkoutStep2.validation';

function buildValidationContext(shipping: ShippingData): CheckoutStep2ValidationContext {
  return {
    formData: {
      nombre: '',
      apellido: '',
      email: 'x@y.z',
      telefono: '00000000',
      tipo_documento: 'DNI',
    },
    confirmEmail: 'x@y.z',
    shipping,
  };
}

export function useCheckoutShippingForm(
  shippingData: ShippingData | null,
  setShippingData: (data: ShippingData) => void,
  isWholesaleLimitReached: boolean,
  onNext: () => void
) {
  const [shipping, setShipping] = useState<ShippingData>({
    tipo: shippingData?.tipo ?? 'envio',
    direccion: shippingData?.direccion || '',
    localidad: shippingData?.localidad || '',
    provincia: shippingData?.provincia || '',
    codigo_postal: shippingData?.codigo_postal || '',
    notas: shippingData?.notas || '',
    fecha_entrega: shippingData?.fecha_entrega || '',
    checkoutProvider: shippingData?.checkoutProvider,
    checkoutDelivery: shippingData?.checkoutDelivery,
    checkoutEnvio: shippingData?.checkoutEnvio,
  });

  const [errors, setErrors] = useState<CheckoutStep2FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!shippingData) return;
    setShipping((prev) => ({
      ...prev,
      tipo: shippingData.tipo ?? prev.tipo,
      direccion: shippingData.direccion ?? prev.direccion,
      localidad: shippingData.localidad ?? prev.localidad,
      provincia: shippingData.provincia ?? prev.provincia,
      codigo_postal: shippingData.codigo_postal ?? prev.codigo_postal,
      notas: shippingData.notas ?? prev.notas,
      fecha_entrega: shippingData.fecha_entrega ?? prev.fecha_entrega,
      checkoutProvider: shippingData.checkoutProvider ?? prev.checkoutProvider,
      checkoutDelivery: shippingData.checkoutDelivery ?? prev.checkoutDelivery,
      checkoutEnvio: shippingData.checkoutEnvio ?? prev.checkoutEnvio,
    }));
  }, [
    shippingData?.tipo,
    shippingData?.direccion,
    shippingData?.localidad,
    shippingData?.provincia,
    shippingData?.codigo_postal,
    shippingData?.notas,
    shippingData?.checkoutProvider,
    shippingData?.checkoutDelivery,
    shippingData?.checkoutEnvio,
  ]);

  /** Keeps inline errors in sync when `patchShipping` updates several fields at once (e.g. provincia + localidad). */
  useEffect(() => {
    setErrors((prev) => {
      const ctx = buildValidationContext(shipping);
      let next = { ...prev };
      let changed = false;
      for (const key of ['direccion', 'localidad', 'provincia', 'codigo_postal'] as const) {
        if (!touched[key]) continue;
        const err = validateCheckoutField(key, shipping[key] ?? '', ctx);
        if (prev[key] !== err) {
          next[key] = err;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [shipping, touched]);

  const patchShipping = useCallback((patch: Partial<ShippingData>) => {
    setShipping((s) => ({ ...s, ...patch }));
  }, []);

  const handleShippingChange = useCallback(
    (field: keyof ShippingData, value: string) => {
      const clearsQuote =
        field === 'tipo' ||
        field === 'direccion' ||
        field === 'calle' ||
        field === 'numero' ||
        field === 'localidad' ||
        field === 'provincia' ||
        field === 'codigo_postal';
      const nextShipping: ShippingData = {
        ...shipping,
        [field]: value,
        ...(clearsQuote ? { checkoutEnvio: undefined } : {}),
      };
      setShipping(nextShipping);
      if (!touched[field as string]) return;
      const ctx = buildValidationContext(nextShipping);
      setErrors((prev) => ({
        ...prev,
        [field]: validateCheckoutField(field, value, ctx),
      }));
    },
    [shipping, touched]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((t) => ({ ...t, [field]: true }));
      const value = String((shipping as unknown as Record<string, string>)[field] ?? '');
      const ctx = buildValidationContext(shipping);
      setErrors((prev) => ({
        ...prev,
        [field]: validateCheckoutField(field, value, ctx),
      }));
    },
    [shipping]
  );

  const handleSubmit = useCallback(() => {
    if (isWholesaleLimitReached) return;

    const newTouched: Record<string, boolean> = {};
    if (shipping.tipo === 'envio') {
      const delivery = shipping.checkoutDelivery ?? 'homeDelivery';
      (['provincia', 'codigo_postal'] as const).forEach((f) => {
        newTouched[f] = true;
      });
      if (delivery === 'homeDelivery') {
        newTouched.direccion = true;
        newTouched.localidad = true;
      }
    }
    setTouched((prev) => ({ ...prev, ...newTouched }));

    const { ok, errors: nextErrors } = validateCheckoutShippingOnly(shipping);
    setErrors((prev) => ({ ...prev, ...nextErrors }));

    if (ok) {
      setShippingData(shipping);
      onNext();
    }
  }, [isWholesaleLimitReached, shipping, setShippingData, onNext]);

  return {
    shipping,
    errors,
    touched,
    handleShippingChange,
    patchShipping,
    handleBlur,
    handleSubmit,
  };
}
