'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { configuracionKeys } from './configuracionQueryKeys';

export function useAdminConfiguracionPageActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: configuracionKeys.precios }),
        queryClient.invalidateQueries({ queryKey: configuracionKeys.datosBancarios }),
        queryClient.invalidateQueries({ queryKey: configuracionKeys.tiendaConfig }),
        queryClient.invalidateQueries({ queryKey: configuracionKeys.envio }),
        queryClient.invalidateQueries({ queryKey: configuracionKeys.integraciones }),
      ]);
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, router]);

  return {
    handleRefresh,
    isRefreshing,
  };
}
