'use client';

import { useQuery } from '@tanstack/react-query';
import { getDatosBancarios } from '@/app/services/empresaDatosBancarios.service';
import { configuracionKeys } from './configuracionQueryKeys';
import { CONFIGURACION_GC_MS, CONFIGURACION_STALE_MS } from './usePrecioConfigQuery';

export function useDatosBancariosQuery() {
  return useQuery({
    queryKey: configuracionKeys.datosBancarios,
    queryFn: getDatosBancarios,
    staleTime: CONFIGURACION_STALE_MS,
    gcTime: CONFIGURACION_GC_MS,
  });
}
