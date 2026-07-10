'use client';

import { useQuery } from '@tanstack/react-query';
import { getMicorreoHealth } from '@/app/services/envioConfig.service';
import { configuracionKeys } from './configuracionQueryKeys';

const STALE_MS = 30 * 1000;
const GC_MS = 5 * 60 * 1000;

export function useMicorreoHealthQuery(enabled = true) {
  return useQuery({
    queryKey: configuracionKeys.micorreoHealth,
    queryFn: getMicorreoHealth,
    staleTime: STALE_MS,
    gcTime: GC_MS,
    enabled,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}
