import { Badge } from '@/components/ui/Badge';
import { mapSfactoryEstadoBadgeVariant } from '@/app/utils/pedidoEstadoDisplay';
import type { AdminPedidoRow } from '@/app/types/adminPedido.types';
import { formatPedidoMoney } from './pedidoDetailFormat';

interface PedidoSfactoryDetalleViewProps {
  data: unknown;
  row: AdminPedidoRow;
}

export function PedidoSfactoryDetalleView({ data, row }: PedidoSfactoryDetalleViewProps) {
  const summary = row.sfactory;

  return (
    <div className="space-y-4">
      {summary ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-neutral-500">Cliente</dt>
            <dd className="font-medium">{summary.cliente}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Estado</dt>
            <dd>
              <Badge variant={mapSfactoryEstadoBadgeVariant(summary.estado)}>
                {summary.estado_d} ({summary.estado})
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Total</dt>
            <dd className="font-medium">{formatPedidoMoney(summary.total)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Fecha</dt>
            <dd>{new Date(summary.fecha).toLocaleString('es-AR')}</dd>
          </div>
        </dl>
      ) : null}
      <details className="text-sm">
        <summary className="cursor-pointer text-neutral-700 font-medium">
          JSON completo (SFactory)
        </summary>
        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-neutral-100 p-3 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
      <p className="text-xs text-neutral-500">
        Para aprobar o cancelar esta orden usá los botones en la fila de la tabla.
      </p>
    </div>
  );
}
