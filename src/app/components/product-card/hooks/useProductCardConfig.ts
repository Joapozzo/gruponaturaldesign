/**
 * Hook para configuración del producto
 * Responsabilidad única: creación de IDs y configuración inicial
 */

import { useCallback } from 'react';

interface UseProductCardConfigReturn {
  createProductId: (codigo: string) => number;
}

export function useProductCardConfig(): UseProductCardConfigReturn {
  const createProductId = useCallback((codigo: string) => {
    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
      const char = codigo.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }, []);

  return {
    createProductId,
  };
}

