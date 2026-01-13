import { useState } from 'react';
import type { ProductoFormData } from './useProductoForm';

export const useProductoValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: ProductoFormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.codigoAgrupacion.trim()) {
      newErrors.codigoAgrupacion = 'El código de agrupación es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
  };
};

