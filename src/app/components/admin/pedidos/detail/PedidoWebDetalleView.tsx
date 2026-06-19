import { PedidoDetailAlerts } from './PedidoDetailAlerts';
import { PedidoDetailClienteSection } from './PedidoDetailClienteSection';
import { PedidoDetailEntregaSection } from './PedidoDetailEntregaSection';
import { PedidoDetailHeader } from './PedidoDetailHeader';
import { PedidoDetailItemsSection } from './PedidoDetailItemsSection';
import { PedidoDetailObservacionesSection } from './PedidoDetailObservacionesSection';
import { PedidoDetailActionsSection } from './actions/PedidoDetailActionsSection';
import type { PedidoWebDetalleViewProps } from './pedidoDetail.types';

export function PedidoWebDetalleView({
  pedido,
  actions,
  busy,
  motivoRechazo,
  onMotivoChange,
  handlers,
  onOpenTracking,
  onDownloadLabel,
  isDownloadingLabel,
}: PedidoWebDetalleViewProps) {
  return (
    <div className="space-y-6">
      <PedidoDetailHeader pedido={pedido} />
      <PedidoDetailAlerts pedido={pedido} actions={actions} />
      <PedidoDetailClienteSection pedido={pedido} />
      <PedidoDetailEntregaSection
        pedido={pedido}
        actions={actions}
        busy={busy}
        onOpenTracking={onOpenTracking}
        onDownloadLabel={onDownloadLabel}
        isDownloadingLabel={isDownloadingLabel}
      />
      <PedidoDetailItemsSection pedido={pedido} />
      {pedido.observaciones ? (
        <PedidoDetailObservacionesSection observaciones={pedido.observaciones} />
      ) : null}
      <PedidoDetailActionsSection
        pedido={pedido}
        actions={actions}
        busy={busy}
        motivoRechazo={motivoRechazo}
        onMotivoChange={onMotivoChange}
        handlers={handlers}
      />
    </div>
  );
}
