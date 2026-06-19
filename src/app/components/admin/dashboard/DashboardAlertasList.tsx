'use client';

import Link from 'next/link';
import { Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { DashboardEmptyState } from './DashboardEmptyState';
import { formatMoneyArs, formatPedidoFecha, mapEstadoPedidoLabel, mapSyncStatusLabel, mapEstadoPedidoBadgeVariant } from '@/app/utils/dashboard.utils';
import type { DashPedidoSnippet } from '@/app/types/dashboard.types';

interface DashboardAlertasListProps {
  items: DashPedidoSnippet[];
  icon: React.ReactNode;
  emptyMessage: string;
  badgeVariant?: 'warning' | 'danger' | 'info';
  href: string;
  totalLabel?: number;
}

export function DashboardAlertasList({
  items,
  icon,
  emptyMessage,
  href,
  totalLabel,
}: DashboardAlertasListProps) {
  if (items.length === 0) {
    return (
      <div className="py-3">
        <DashboardEmptyState message={emptyMessage} className="py-4" />
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-neutral-50">
        {items.slice(0, 5).map((pedido) => (
          <div key={pedido.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="flex-shrink-0 text-neutral-400">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-900">#{pedido.id}</span>
                <span className="text-xs text-neutral-500 truncate">{pedido.clienteNombre}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-neutral-700 tabular-nums">
                  {formatMoneyArs(pedido.total)}
                </span>
                <Badge variant={mapEstadoPedidoBadgeVariant(pedido.estadoInterno)} className="text-xs py-0 px-1.5">
                  {mapEstadoPedidoLabel(pedido.estadoInterno)}
                </Badge>
                {pedido.syncStatus !== 'synced' && (
                  <span className="text-xs text-red-500">
                    {mapSyncStatusLabel(pedido.syncStatus)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-neutral-400 flex-shrink-0">
              {formatPedidoFecha(pedido.fechaPedido)}
            </div>
          </div>
        ))}
      </div>
      <Link
        href={href}
        className="block mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium text-center"
      >
        Ver todos ({totalLabel ?? items.length})
      </Link>
    </div>
  );
}
