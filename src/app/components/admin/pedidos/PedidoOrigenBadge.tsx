'use client';

import { Badge } from '@/components/ui/Badge';
import type { AdminPedidoRow } from '@/app/types/adminPedido.types';

export function PedidoOrigenBadge({ row }: { row: AdminPedidoRow }) {
  if (row.source === 'sfactory') {
    return (
      <Badge variant="default" className="bg-neutral-100 text-neutral-700 border-neutral-200">
        SFactory · ERP
      </Badge>
    );
  }

  const web = row.web;
  if (!web) {
    return (
      <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-200">
        Ecommerce
      </Badge>
    );
  }

  if (web.sfactoryOrdenId != null) {
    return (
      <div className="flex flex-wrap gap-1">
        <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-200">
          Ecommerce
        </Badge>
        <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200">
          En SFactory
        </Badge>
      </div>
    );
  }

  const syncBadge =
    web.syncStatus === 'error' || web.syncStatus === 'conflict' ? (
      <Badge variant="danger">Sync {web.syncStatus === 'error' ? 'error' : 'conflicto'}</Badge>
    ) : (
      <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
        Pendiente SFactory
      </Badge>
    );

  return (
    <div className="flex flex-wrap gap-1">
      <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-200">
        Ecommerce
      </Badge>
      {syncBadge}
    </div>
  );
}
