'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPrecioConfigPublic } from '@/app/services/checkoutManual.service';

const STALE_MS = 5 * 60 * 1000;
const GC_MS = 30 * 60 * 1000;

export const precioConfigPublicKeys = {
  all: ['tienda', 'config-precios'] as const,
};

/** Config de precios para páginas públicas de la tienda (sin auth admin). */
export function usePrecioConfigPublic() {
  return useQuery({
    queryKey: precioConfigPublicKeys.all,
    queryFn: fetchPrecioConfigPublic,
    staleTime: STALE_MS,
    gcTime: GC_MS,
  });
}
