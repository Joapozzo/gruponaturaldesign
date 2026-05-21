'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { newsletterAdminKeys } from './newsletterQueryKeys';

interface UseAdminEmailsPageActionsParams {}

export function useAdminEmailsPageActions({}: UseAdminEmailsPageActionsParams = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: newsletterAdminKeys.all });
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