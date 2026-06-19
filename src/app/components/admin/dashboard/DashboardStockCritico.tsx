'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStockCritico } from '@/app/hooks/dashboard';
import { DashboardSectionCard } from './DashboardSectionCard';
import { DashboardErrorState } from './DashboardErrorState';
import { DashboardEmptyState } from './DashboardEmptyState';
import { formatMoneyArs, decimalStringToNumber } from '@/app/utils/dashboard.utils';

function StockBadge({ stock }: { stock: number | null }) {
  if (stock === null) {
    return <span className="text-xs text-neutral-400 italic">Sin sync</span>;
  }
  if (stock === 0) {
    return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">0</span>;
  }
  if (stock <= 1) {
    return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{stock}</span>;
  }
  return <span className="text-xs text-neutral-600">{stock}</span>;
}

export function DashboardStockCritico() {
  const { data, isError, refetch } = useDashboardStockCritico();

  const viewAll = (
    <Link
      href="/admin/productos"
      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
    >
      Ver todos <ArrowUpRight className="w-3 h-3" />
    </Link>
  );

  if (isError) {
    return (
      <DashboardSectionCard title="Stock crítico" action={viewAll}>
        <DashboardErrorState message="Error al cargar stock" onRetry={refetch} />
      </DashboardSectionCard>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <DashboardSectionCard title="Stock crítico" action={viewAll}>
        <DashboardEmptyState message="No hay productos con stock crítico" />
      </DashboardSectionCard>
    );
  }

  return (
    <DashboardSectionCard title="Stock crítico" action={viewAll} noPadding>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Productos con stock crítico</caption>
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/40">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Producto</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Código</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Stock</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium text-neutral-500">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.slice(0, 8).map((item) => {
              const stockNum = item.stockCache !== null ? decimalStringToNumber(item.stockCache) : null;
              return (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-2.5 text-neutral-900 truncate max-w-40">{item.nombre}</td>
                  <td className="px-5 py-2.5 text-neutral-400 text-xs font-mono">{item.sfactoryCodigo}</td>
                  <td className="px-5 py-2.5"><StockBadge stock={stockNum} /></td>
                  <td className="px-5 py-2.5 text-neutral-600 text-xs tabular-nums">
                    {item.precioCache ? formatMoneyArs(decimalStringToNumber(item.precioCache)) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardSectionCard>
  );
}
