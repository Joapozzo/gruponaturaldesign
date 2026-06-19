'use client';

import Button from '@/components/ui/Button';
import { useAuditoriaPageActions } from '@/app/hooks/useAuditoriaPageActions';
import { RefreshCw } from 'lucide-react';

interface AuditoriaPageActionsProps {
  empresaId: number;
}

export function AuditoriaPageActions({ empresaId }: AuditoriaPageActionsProps) {
  const { handleRefresh, isRefreshing } = useAuditoriaPageActions({ empresaId });

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className={`w-4 h-4 mr-2 inline ${isRefreshing ? 'animate-spin' : ''}`} />
        Refrescar
      </Button>
    </div>
  );
}
