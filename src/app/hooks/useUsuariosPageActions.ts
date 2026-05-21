'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

export const usuariosKeys = {
  all: ['usuarios'] as const,
  lists: () => [...usuariosKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...usuariosKeys.lists(), params] as const,
};

interface UseUsuariosPageActionsParams {}

export function useUsuariosPageActions({}: UseUsuariosPageActionsParams = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
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