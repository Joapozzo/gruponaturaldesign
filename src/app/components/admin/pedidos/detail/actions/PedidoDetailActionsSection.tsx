import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';
import type { PedidoDetailActionHandlers } from '../pedidoDetail.types';
import { PedidoDetailActionBar } from './PedidoDetailActionBar';
import { PedidoDetailActionHints } from './PedidoDetailActionHints';
import { PedidoRejectMotivoField } from './PedidoRejectMotivoField';

interface PedidoDetailActionsSectionProps {
  pedido: AdminPedidoDetalle;
  actions: WebPedidoActions;
  busy: boolean;
  motivoRechazo: string;
  onMotivoChange: (value: string) => void;
  handlers: PedidoDetailActionHandlers;
}

export function hasPedidoDetailActions(actions: WebPedidoActions): boolean {
  return (
    actions.canConfirmWeb ||
    actions.canAprobarEnSfactory ||
    actions.canReintentarSfactory ||
    actions.canSyncSfactory ||
    actions.canReject ||
    actions.canEnviarListoRetiro ||
    actions.canMarcarRetirado ||
    actions.canCrearEnvioPostal ||
    actions.canShowShippingLabel ||
    actions.paymentPendingMessage != null
  );
}

export function PedidoDetailActionsSection({
  pedido,
  actions,
  busy,
  motivoRechazo,
  onMotivoChange,
  handlers,
}: PedidoDetailActionsSectionProps) {
  if (!hasPedidoDetailActions(actions)) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-4 space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900">Acciones</h3>
      <PedidoDetailActionHints pedido={pedido} actions={actions} />
      {actions.canReject ? (
        <PedidoRejectMotivoField value={motivoRechazo} onChange={onMotivoChange} />
      ) : null}
      <PedidoDetailActionBar actions={actions} busy={busy} handlers={handlers} />
    </section>
  );
}
