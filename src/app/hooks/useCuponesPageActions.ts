'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { cuponesAdminKeys } from './cuponesQueryKeys';

interface UseCuponesPageActionsParams {}

export function useCuponesPageActions({}: UseCuponesPageActionsParams = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: cuponesAdminKeys.all });
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