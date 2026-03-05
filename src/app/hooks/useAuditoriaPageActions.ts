import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { auditKeys } from '@/app/utils/auditKeys';

interface UseAuditoriaPageActionsParams {
  empresaId: number;
}

export function useAuditoriaPageActions({ empresaId }: UseAuditoriaPageActionsParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: auditKeys.all });
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
