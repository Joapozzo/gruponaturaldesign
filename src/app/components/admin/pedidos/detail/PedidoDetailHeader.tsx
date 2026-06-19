import { Badge } from '@/components/ui/Badge';
import { mapEstadoPedidoBadgeVariant, mapEstadoPedidoLabel } from '@/app/utils/dashboard.utils';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';

interface PedidoDetailHeaderProps {
  pedido: AdminPedidoDetalle;
}

export function PedidoDetailHeader({ pedido }: PedidoDetailHeaderProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant={mapEstadoPedidoBadgeVariant(pedido.estadoInterno)}>
        {mapEstadoPedidoLabel(pedido.estadoInterno)}
      </Badge>
      <Badge variant="info">Sync: {pedido.syncStatus}</Badge>
      {pedido.sfactoryOrdenId != null ? (
        <Badge variant="success">SFactory #{pedido.sfactoryOrdenId}</Badge>
      ) : null}
      {pedido.estadoInterno === 'confirmado' ? (
        <Badge variant="success">Venta confirmada</Badge>
      ) : null}
      {pedido.sfactoryExternalOrderId ? (
        <span className="text-xs text-neutral-600">Ref: {pedido.sfactoryExternalOrderId}</span>
      ) : null}
    </div>
  );
}
