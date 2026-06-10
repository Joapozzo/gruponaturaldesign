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
          No podés confirmar este pedido hasta que el cliente pague en Mercado Pago.
        </p>
      ) : null}
      {actions.canConfirmWeb ? (
        <p className="text-xs text-neutral-600">
          {pedido.sfactoryOrdenId != null
            ? 'Confirmar reserva stock y aprueba la orden ya cotizada en S-Factory. El estado final será '
            : 'Confirmar reserva stock y crea el pedido en SFactory. El estado final será '}
          <strong>confirmado</strong>.
        </p>
      ) : null}
      {actions.canAprobarEnSfactory && !actions.canConfirmWeb ? (
        <p className="text-xs text-neutral-600">
          La orden ya existe en SFactory. Aprobá en ERP para cerrar la venta; luego podés
          sincronizar el estado local.
        </p>
      ) : null}
      {actions.canEnviarListoRetiro || actions.canMarcarRetirado ? (
        <p className="text-xs text-neutral-600">
          Retiro en tienda: enviá el aviso cuando el pedido esté listo. Podés marcar como retirado
          en cualquier momento (con o sin haber enviado el aviso).
        </p>
      ) : null}
      {actions.canCrearEnvioPostal ? (
        <p className="text-xs text-neutral-600">
          Envío postal: al confirmar el pedido se intenta crear la orden en Andreani/Correo. Si
          falló o quedó pendiente, usá el botón de abajo. La etiqueta Andreani se descarga arriba
          (PDF para imprimir manualmente); Correo solo desde MiCorreo.
        </p>
      ) : null}
    </>
  );
}
