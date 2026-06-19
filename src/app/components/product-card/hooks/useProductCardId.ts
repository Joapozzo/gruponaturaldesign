/**
 * Hook para generar ID único del producto desde código
 * Responsabilidad única: creación de IDs consistentes
 */

import { useMemo } from 'react';

export function useProductCardId(codigo: string | undefined): number {
  const productId = useMemo(() => {
    if (!codigo) return 0;
    
    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
      const char = codigo.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }, [codigo]);

  return productId;
}

