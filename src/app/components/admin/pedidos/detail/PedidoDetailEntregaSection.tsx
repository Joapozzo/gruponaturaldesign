import {
  PedidoShippingLabelField,
  PedidoShippingTrackingField,
} from '@/app/components/shipping';
import {
  formatPedidoEntregaDisplay,
  isRetiroEnTiendaPedido,
  mapFormaPagoLabel,
} from '@/app/utils/pedidoEntregaDisplay';
import { resolvePedidoShippingTracking } from '@/app/utils/pedidoShippingTracking';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';

interface PedidoDetailEntregaSectionProps {
  pedido: AdminPedidoDetalle;
  actions: WebPedidoActions;
  busy: boolean;
  onOpenTracking: () => void;
  onDownloadLabel: () => void;
  isDownloadingLabel: boolean;
}

export function PedidoDetailEntregaSection({
  pedido,
  actions,
  busy,
  onOpenTracking,
  onDownloadLabel,
  isDownloadingLabel,
}: PedidoDetailEntregaSectionProps) {
  const entrega = formatPedidoEntregaDisplay(pedido);
  const postalShipping = !isRetiroEnTiendaPedido(pedido);
  const shippingTracking = resolvePedidoShippingTracking(pedido);

  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900 mb-2">Entrega y pago</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="sm:col-span-2">
          <dt className="text-neutral-500">Tipo de entrega</dt>
          <dd className="font-medium text-neutral-900">{entrega.tipoLabel}</dd>
          {entrega.detalle ? (
            <dd className="text-xs text-neutral-600 mt-0.5">{entrega.detalle}</dd>
          ) : null}
        </div>
        <div>
          <dt className="text-neutral-500">Costo de envío</dt>
          <dd>{entrega.costoEnvioLabel}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Forma de pago</dt>
          <dd>{mapFormaPagoLabel(pedido.formaPago)}</dd>
        </div>
        {pedido.entregaNotas ? (
          <div className="sm:col-span-2">
            <dt className="text-neutral-500">Notas entrega</dt>
            <dd>{pedido.entregaNotas}</dd>
          </div>
        ) : null}
        <PedidoShippingTrackingField
          shippingProvider={shippingTracking.shippingProvider}
          trackingNumber={shippingTracking.trackingNumber}
          trackingUrl={shippingTracking.trackingUrl}
          onOpenTracking={onOpenTracking}
          showWhenPending={postalShipping}
          pendingLabel={
            pedido.estadoInterno === 'pendiente_confirmacion'
              ? 'Pendiente — se generará al confirmar el pedido (transferencia/efectivo) o tras el pago (Mercado Pago).'
              : 'Pendiente — usá «Generar envío en carrier» o esperá el reintento automático.'
          }
        />
        <PedidoShippingLabelField
          pedidoId={pedido.id}
          availability={pedido.shippingLabel ?? undefined}
          isDownloading={isDownloadingLabel}
          disabled={busy}
          onDownload={onDownloadLabel}
          show={actions.canShowShippingLabel}
        />
      </dl>
    </section>
  );
}
