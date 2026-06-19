'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMisPedidosList } from '@/app/hooks/useMisPedidosList';
import { OrderCard } from './OrderCard';
import { OrderCardSkeleton } from './OrderCardSkeleton';
import { ProfileOrdersEmpty } from './ProfileOrdersEmpty';
import { ProfileOrdersError } from './ProfileOrdersError';

interface ProfileOrdersListProps {
  enabled: boolean;
  title?: string;
  /** Si false, el título lo define el layout padre (ej. fila alineada con "Mi perfil"). */
  showTitle?: boolean;
  /** Envuelve la lista en un panel alineado con ProfileUserCard. */
  asPanel?: boolean;
}

export function ProfileOrdersList({
  enabled,
  title = 'Mis pedidos',
  showTitle = true,
  asPanel = false,
}: ProfileOrdersListProps) {
  const {
    orders,
    isInitialLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    pagination,
  } = useMisPedidosList(enabled);

  const totalLabel =
    pagination && pagination.total > 0 ? (
      <span className="text-xs text-gray-500 shrink-0">{pagination.total} en total</span>
    ) : null;

  const showHeader = showTitle || asPanel;

  const content = isInitialLoading ? (
    <ul className="space-y-3 list-none p-0 m-0">
      <li>
        <OrderCardSkeleton />
      </li>
      <li>
        <OrderCardSkeleton />
      </li>
    </ul>
  ) : error ? (
    <ProfileOrdersError
      message={error instanceof Error ? error.message : undefined}
      onRetry={retry}
      embedded={asPanel}
    />
  ) : orders.length === 0 ? (
    <ProfileOrdersEmpty embedded={asPanel} />
  ) : (
    <>
      <ul className="space-y-3 list-none p-0 m-0">
        {orders.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="flex justify-center pt-4">
          <Button
            variant="blackOutline"
            size="sm"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden />
                Cargando...
              </>
            ) : (
              'Cargar más'
            )}
          </Button>
        </div>
      ) : null}
    </>
  );

  if (asPanel) {
    return (
      <section
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full"
        aria-labelledby="orders-section-heading"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <h2 id="orders-section-heading" className="text-sm font-semibold text-gray-700">
            {title}
          </h2>
          {totalLabel}
        </div>
        <div className="p-4 sm:p-6">{content}</div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={showHeader ? 'orders-section-heading' : undefined}
      aria-label={showHeader ? undefined : title}
    >
      {showTitle ? (
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 id="orders-section-heading" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {totalLabel}
        </div>
      ) : totalLabel ? (
        <div className="flex justify-end mb-4">{totalLabel}</div>
      ) : null}

      {content}
    </section>
  );
}
