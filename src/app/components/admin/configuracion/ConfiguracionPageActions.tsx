'use client';

import Button from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';

interface ConfiguracionPageActionsProps {
  handleRefresh: () => void;
  isRefreshing: boolean;
}

export function ConfiguracionPageActions({
  handleRefresh,
  isRefreshing,
}: ConfiguracionPageActionsProps) {
  return (
    <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
      <RefreshCw className={`w-4 h-4 mr-2 inline ${isRefreshing ? 'animate-spin' : ''}`} />
      Refrescar
    </Button>
  );
}
