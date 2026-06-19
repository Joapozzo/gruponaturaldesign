import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';

interface PedidoDetailActionHintsProps {
  pedido: AdminPedidoDetalle;
  actions: WebPedidoActions;
}

export function PedidoDetailActionHints({ pedido, actions }: PedidoDetailActionHintsProps) {
  return (
    <>
      {actions.paymentPendingMessage && !actions.canConfirmWeb ? (
        <p className="text-xs text-neutral-600">
          No podes confirmar este pedido hasta que el cliente pague en Mercado Pago.
        </p>
      ) : null}
      {actions.canConfirmWeb ? (
        <p className="text-xs text-neutral-600">
          {pedido.sfactoryOrdenId != null
            ? 'Confirmar reserva stock y aprueba la orden ya cotizada en SFactory. El estado final sera '
            : 'Confirmar reserva stock y crea el pedido en SFactory. El estado final sera '}
          <strong>confirmado</strong>.
        </p>
      ) : null}
      {actions.canAprobarEnSfactory && !actions.canConfirmWeb ? (
        <p className="text-xs text-neutral-600">
          La orden ya existe en SFactory. Aprobar en ERP cierra la venta; despues podes
          sincronizar el estado local.
        </p>
      ) : null}
      {actions.canReintentarSfactory ? (
        <p className="text-xs text-neutral-600">
          Reintentar SFactory vuelve a enviar el pedido al ERP. Usalo cuando el pedido quedo
          fallido y no tiene orden sincronizada.
        </p>
      ) : null}
      {actions.canSyncSfactory ? (
        <p className="text-xs text-neutral-600">
          Sincronizar estado consulta SFactory y actualiza el estado local del pedido. No crea
          envio postal ni modifica el tracking.
        </p>
      ) : null}
      {actions.canEnviarListoRetiro || actions.canMarcarRetirado ? (
        <p className="text-xs text-neutral-600">
          Retiro en tienda: envia el aviso cuando el pedido este listo. Podes marcar como retirado
          en cualquier momento, con o sin haber enviado el aviso.
        </p>
      ) : null}
      {actions.canCrearEnvioPostal ? (
        <p className="text-xs text-neutral-600">
          Envio postal: genera la orden en el carrier, guarda el numero de seguimiento real y
          envia el mail de envio. Si el carrier falla, el pedido queda sin tracking y se puede
          reintentar desde este modal.
        </p>
      ) : null}
      {actions.canShowShippingLabel ? (
        <p className="text-xs text-neutral-600">
          Etiquetas: Andreani permite descarga cuando existe agrupador de bultos. Correo Argentino
          se gestiona desde el portal MiCorreo con el numero de seguimiento visible.
        </p>
      ) : null}
      {actions.canReject ? (
        <p className="text-xs text-neutral-600">
          Rechazar / cancelar cambia el estado del pedido y usa el motivo cargado abajo como
          referencia operativa.
        </p>
      ) : null}
    </>
  );
}
