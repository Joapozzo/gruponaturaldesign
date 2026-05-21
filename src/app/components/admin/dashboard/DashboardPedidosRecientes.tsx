'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useDashboardPedidosRecientes } from '@/app/hooks/dashboard';
import { DashboardSectionCard } from './DashboardSectionCard';
import { DashboardErrorState } from './DashboardErrorState';
import { DashboardEmptyState } from './DashboardEmptyState';
import { formatMoneyArs, formatPedidoFecha, mapEstadoPedidoLabel, mapEstadoPedidoBadgeVariant } from '@/app/utils/dashboard.utils';

export function DashboardPedidosRecientes() {
  const { data, isError, refetch } = useDashboardPedidosRecientes();

  const viewAll = (
    <Link
      href="/admin/pedidos"
      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
    >
      Ver todos <ArrowUpRight className="w-3 h-3" />
    </Link>
  );

  if (isError) {
    return (
      <DashboardSectionCard title="Pedidos recientes" action={viewAll}>
        <DashboardErrorState message="Error al cargar pedidos" onRetry={refetch} />
      </DashboardSectionCard>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <DashboardSectionCard title="Pedidos recientes" action={viewAll}>
        <DashboardEmptyState message="Sin pedidos en este período" />
      </DashboardSectionCard>
    );
  }

  return (
    <DashboardSectionCard title="Pedidos recientes" action={viewAll} noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Pedidos recientes</caption>
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/40">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">#</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Cliente</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Total</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Estado</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.slice(0, 8).map((pedido) => (
              <tr key={pedido.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-2.5 text-neutral-900 font-medium">#{pedido.id}</td>
                <td className="px-5 py-2.5 text-neutral-600 truncate max-w-32">{pedido.clienteNombre}</td>
                <td className="px-5 py-2.5 text-neutral-900 font-semibold tabular-nums">
                  {formatMoneyArs(pedido.total)}
                </td>
                <td className="px-5 py-2.5">
                  <Badge variant={mapEstadoPedidoBadgeVariant(pedido.estadoInterno)} className="text-xs">
                    {mapEstadoPedidoLabel(pedido.estadoInterno)}
                  </Badge>
                </td>
                <td className="px-5 py-2.5 text-neutral-400 text-xs tabular-nums">
                  {formatPedidoFecha(pedido.fechaPedido)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSectionCard>
  );
}
