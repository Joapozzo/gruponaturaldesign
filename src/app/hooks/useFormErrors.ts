'use client';

import { useState, useCallback } from 'react';
import { scrollToFirstError } from '@/app/utils/productoFormModal.utils';

/**
 * Hook reutilizable para estado de errores de formulario y scroll al primer error.
 */
export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setErrorsAndScroll = useCallback((newErrors: Record<string, string>) => {
    setErrors(newErrors);
    scrollToFirstError(newErrors);
  }, []);

  const setErrorsFromBackend = useCallback((backendErrors: Record<string, string>) => {
    setErrors((prev) => ({ ...prev, ...backendErrors }));
    scrollToFirstError(backendErrors);
  }, []);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setErrors,
    clearError,
    setErrorsAndScroll,
    setErrorsFromBackend,
    resetErrors,
  };
}
