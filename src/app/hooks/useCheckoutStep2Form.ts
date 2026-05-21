'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CustomerData } from '@/app/types/cart';
import {
  validateCheckoutField,
  validateCheckoutCustomerOnly,
  type CheckoutStep2FormErrors,
  type CheckoutStep2ValidationContext,
} from '@/app/components/checkout/checkoutStep2.validation';

function buildValidationContext(
  formData: CustomerData,
  confirmEmail: string
): Pick<CheckoutStep2ValidationContext, 'formData' | 'confirmEmail'> {
  return { formData, confirmEmail };
}

export function useCheckoutStep2Form(
  customerData: CustomerData | null,
  setCustomerData: (data: CustomerData) => void,
  isWholesaleLimitReached: boolean,
  onNext: () => void
) {
  const [formData, setFormData] = useState<CustomerData>({
    nombre: customerData?.nombre || '',
    apellido: customerData?.apellido || '',
    email: customerData?.email || '',
    telefono: customerData?.telefono || '',
    empresa: customerData?.empresa || '',
    cuit: customerData?.cuit || '',
    fecha_nacimiento: customerData?.fecha_nacimiento || '',
    documento: customerData?.documento || '',
    tipo_documento: customerData?.tipo_documento || 'DNI',
  });

  const [confirmEmail, setConfirmEmail] = useState<string>(customerData?.email || '');

  const [errors, setErrors] = useState<CheckoutStep2FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!customerData) return;
    setFormData((prev) => ({
      ...prev,
      nombre: prev.nombre || customerData.nombre || '',
      apellido: prev.apellido || customerData.apellido || '',
      email: prev.email || customerData.email || '',
      telefono: prev.telefono || customerData.telefono || '',
      empresa: prev.empresa ?? customerData.empresa ?? '',
      cuit: prev.cuit ?? customerData.cuit ?? '',
      fecha_nacimiento: prev.fecha_nacimiento ?? customerData.fecha_nacimiento ?? '',
      documento: prev.documento ?? customerData.documento ?? '',
      tipo_documento: prev.tipo_documento ?? customerData.tipo_documento ?? 'DNI',
    }));
    setConfirmEmail((c) => c || customerData.email || '');
  }, [
    customerData?.nombre,
    customerData?.apellido,
    customerData?.email,
    customerData?.telefono,
    customerData?.empresa,
    customerData?.cuit,
    customerData?.fecha_nacimiento,
    customerData?.documento,
    customerData?.tipo_documento,
  ]);

  const handleCustomerChange = useCallback(
    (field: keyof CustomerData, value: string) => {
      const nextFormData = { ...formData, [field]: value };
      setFormData(nextFormData);
      const dummyShipping = { tipo: 'retiro' as const };
      const ctx: CheckoutStep2ValidationContext = {
        formData: nextFormData,
        confirmEmail,
        shipping: dummyShipping,
      };
      setErrors((prevErr) => {
        const next = { ...prevErr };
        if (touched[field as string]) {
          next[field as keyof CheckoutStep2FormErrors] = validateCheckoutField(field, value, ctx);
        }
        if (field === 'email' && touched.confirmEmail) {
          next.confirmEmail = validateCheckoutField('confirmEmail', confirmEmail, ctx);
        }
        return next;
      });
    },
    [formData, confirmEmail, touched]
  );

  const handleConfirmEmailChange = useCallback(
    (value: string) => {
      setConfirmEmail(value);
      setErrors((prevErr) => {
        if (!touched.confirmEmail) return prevErr;
        const dummyShipping = { tipo: 'retiro' as const };
        const ctx: CheckoutStep2ValidationContext = {
          formData,
          confirmEmail: value,
          shipping: dummyShipping,
        };
        return { ...prevErr, confirmEmail: validateCheckoutField('confirmEmail', value, ctx) };
      });
    },
    [formData, touched.confirmEmail]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((t) => ({ ...t, [field]: true }));
      let value: string;
      if (field === 'confirmEmail') {
        value = confirmEmail;
      } else {
        value = String((formData as unknown as Record<string, string>)[field] ?? '');
      }
      const dummyShipping = { tipo: 'retiro' as const };
      const ctx: CheckoutStep2ValidationContext = {
        formData,
        confirmEmail,
        shipping: dummyShipping,
      };
      setErrors((prev) => ({
        ...prev,
        [field]: validateCheckoutField(field, value, ctx),
      }));
    },
    [formData, confirmEmail]
  );

  const handleSubmit = useCallback(() => {
    if (isWholesaleLimitReached) return;

    const allFields = ['nombre', 'apellido', 'email', 'confirmEmail', 'telefono'];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    if (formData.documento) {
      newTouched.documento = true;
    }
    setTouched((prev) => ({ ...prev, ...newTouched }));

    const { ok, errors: nextErrors } = validateCheckoutCustomerOnly(
      buildValidationContext(formData, confirmEmail)
    );
    setErrors((prev) => ({ ...prev, ...nextErrors }));

    if (ok) {
      setCustomerData(formData);
      onNext();
    }
  }, [isWholesaleLimitReached, formData, confirmEmail, setCustomerData, onNext]);

  return {
    formData,
    confirmEmail,
    errors,
    touched,
    handleCustomerChange,
    handleConfirmEmailChange,
    handleBlur,
    handleSubmit,
  };
}
