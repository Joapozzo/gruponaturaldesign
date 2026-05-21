import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { EstadoPedido } from '@/app/types/pedido.types';

const TERMINAL: EstadoPedido[] = ['cancelado', 'vencido', 'entregado'];

export interface WebPedidoActions {
  canConfirmWeb: boolean;
  canAprobarEnSfactory: boolean;
  canReintentarSfactory: boolean;
  canSyncSfactory: boolean;
  canReject: boolean;
  confirmLabel: string;
  awaitingMercadoPago: boolean;
  paymentPendingMessage: string | null;
}

/** Estados SFactory ERP que admiten aprobar desde admin (cotización / en curso). */
const SFACTORY_APROBABLE = new Set(['1', '5']);

export function getWebPedidoActions(pedido: AdminPedidoDetalle): WebPedidoActions {
  const awaitingMercadoPago =
    pedido.estadoInterno === 'pendiente_pago' && pedido.formaPago === 'mercado_pago';

  const canConfirmWeb = pedido.estadoInterno === 'pendiente_confirmacion';

  const hasOrden = pedido.sfactoryOrdenId != null;
  const sfEstado = pedido.sfactoryEstado?.trim() ?? '';

  const canAprobarEnSfactory =
    hasOrden && SFACTORY_APROBABLE.has(sfEstado) && pedido.estadoInterno !== 'cancelado';

  const canReintentarSfactory =
    pedido.estadoInterno === 'fallido' && !hasOrden && pedido.syncStatus !== 'synced';

  const canSyncSfactory = hasOrden;

  const canReject = !TERMINAL.includes(pedido.estadoInterno);

  let confirmLabel = 'Confirmar y enviar a SFactory';
  if (canAprobarEnSfactory && !canConfirmWeb) {
    confirmLabel = 'Aprobar en SFactory (confirmar venta)';
  } else if (canConfirmWeb && hasOrden) {
    confirmLabel = 'Confirmar pedido';
  }

  let paymentPendingMessage: string | null = null;
  if (awaitingMercadoPago) {
    paymentPendingMessage =
      'Falta el pago de Mercado Pago. El pedido se confirmará automáticamente cuando el cliente complete el pago.';
  } else if (pedido.estadoInterno === 'pendiente_pago') {
    paymentPendingMessage = 'El pedido está pendiente de pago y no puede confirmarse manualmente.';
  }

  return {
    canConfirmWeb,
    canAprobarEnSfactory,
    canReintentarSfactory,
    canSyncSfactory,
    canReject,
    confirmLabel,
    awaitingMercadoPago,
    paymentPendingMessage,
  };
}
