'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function DashboardErrorState({
  message = 'Error al cargar los datos',
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
      <p className="text-sm text-neutral-600 mb-4">{message}</p>
      {onRetry && (
        <Button variant="blackOutline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
