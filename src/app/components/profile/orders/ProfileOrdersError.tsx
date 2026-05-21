'use client';

import { Button } from '@/components/ui/Button';

interface ProfileOrdersErrorProps {
  message?: string;
  onRetry?: () => void;
  /** Sin caja propia cuando va dentro de un panel contenedor. */
  embedded?: boolean;
}

export function ProfileOrdersError({
  message = 'No se pudieron cargar tus pedidos.',
  onRetry,
  embedded = false,
}: ProfileOrdersErrorProps) {
  return (
    <div
      className={
        embedded
          ? 'py-6 text-center space-y-3'
          : 'bg-white rounded-lg border border-red-100 p-6 text-center space-y-3'
      }
    >
      <p className="text-sm text-red-600">{message}</p>
      {onRetry ? (
        <Button variant="blackOutline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
