'use client';

import { useQuery } from '@tanstack/react-query';
import { getIntegrationsStatus } from '@/app/services/integrations.service';
import { configuracionKeys } from './configuracionQueryKeys';

const STALE_MS = 30 * 1000;
const GC_MS = 10 * 60 * 1000;

export function useIntegrationsStatusQuery(enabled = true) {
  return useQuery({
    queryKey: configuracionKeys.integraciones,
    queryFn: getIntegrationsStatus,
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
}

export { STALE_MS as INTEGRACIONES_STALE_MS, GC_MS as INTEGRACIONES_GC_MS };
