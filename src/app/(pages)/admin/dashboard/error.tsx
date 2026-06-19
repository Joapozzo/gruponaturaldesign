'use client';

import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
      <h2 className="text-lg font-semibold text-neutral-900 mb-2">
        Error al cargar el dashboard
      </h2>
      <p className="text-sm text-neutral-600 mb-6 max-w-md">
        {error.message || 'Ocurrió un error inesperado. Intentá nuevamente.'}
      </p>
        <Button onClick={reset} variant="blackOutline">
        Reintentar
      </Button>
    </div>
  );
}
