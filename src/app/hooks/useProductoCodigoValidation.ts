'use client';

import { useState, useCallback } from 'react';

export interface UseProductoCodigoValidationParams {
  validarCodigo: (codigo: string) => Promise<{ existe: boolean; mensaje?: string }>;
  onErrorSet?: (errors: Record<string, string>) => void;
  clearError?: (field: string) => void;
}

/**
 * Hook reutilizable para validación de código en tiempo real (ej. código único).
 */
export function useProductoCodigoValidation({
  validarCodigo: validarCodigoFn,
  onErrorSet,
  clearError,
}: UseProductoCodigoValidationParams) {
  const [isValidatingCodigo, setIsValidatingCodigo] = useState(false);
  const [codigoValido, setCodigoValido] = useState<boolean | undefined>(undefined);
  const [codigoMensaje, setCodigoMensaje] = useState('');

  const validarCodigo = useCallback(
    async (codigo: string): Promise<boolean> => {
      if (!codigo || codigo.length < 3) {
        setCodigoValido(undefined);
        setCodigoMensaje('');
        clearError?.('codigoCompleto');
        return true;
      }

      setIsValidatingCodigo(true);
      try {
        const resultado = await validarCodigoFn(codigo);
        setCodigoValido(!resultado.existe);
        setCodigoMensaje(resultado.mensaje || '');
        if (resultado.existe) {
          onErrorSet?.({ codigoCompleto: resultado.mensaje || 'Este código ya existe' });
          return false;
        }
        clearError?.('codigoCompleto');
        return true;
      } catch {
        setCodigoValido(false);
        setCodigoMensaje('Error al validar código');
        return false;
      } finally {
        setIsValidatingCodigo(false);
      }
    },
    [validarCodigoFn, onErrorSet, clearError]
  );

  const resetCodigoValidation = useCallback(() => {
    setCodigoValido(undefined);
    setCodigoMensaje('');
  }, []);

  return {
    isValidatingCodigo,
    codigoValido,
    codigoMensaje,
    setCodigoValido,
    setCodigoMensaje,
    validarCodigo,
    resetCodigoValidation,
  };
}
