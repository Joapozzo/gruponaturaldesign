import { mapMercadoPagoStatusLabel } from '@/app/utils/pedidoEstadoDisplay';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';

interface PedidoDetailAlertsProps {
  pedido: AdminPedidoDetalle;
  actions: WebPedidoActions;
}

export function PedidoDetailAlerts({ pedido, actions }: PedidoDetailAlertsProps) {
  const hasBordado = (pedido.items ?? []).some((it) => it.bordado === true);

  return (
    <>
      {hasBordado ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Este pedido incluye prendas con bordado de logo.
        </div>
      ) : null}

      {actions.paymentPendingMessage ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {actions.paymentPendingMessage}
          {pedido.mercadoPagoStatus ? (
            <span className="block mt-1 text-xs text-amber-800">
              Estado MP: {mapMercadoPagoStatusLabel(pedido.mercadoPagoStatus)}
            </span>
          ) : null}
          {pedido.expiresAt ? (
            <span className="block mt-1 text-xs text-amber-800">
              Vence: {new Date(pedido.expiresAt).toLocaleString('es-AR')}
            </span>
          ) : null}
        </div>
      ) : null}

      {pedido.syncError || pedido.sfactoryError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {pedido.syncError || pedido.sfactoryError}
        </div>
      ) : null}
    </>
  );
}
