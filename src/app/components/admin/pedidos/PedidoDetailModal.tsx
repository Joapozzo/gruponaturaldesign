'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import BaseModal from '@/app/components/modal/BaseModal';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { pedidoService } from '@/app/services/pedido.service';
import { apiClient } from '@/lib/apiClient';
import { pedidosKeys } from '@/app/utils/pedidosKeys';
import { mapEstadoPedidoLabel, mapEstadoPedidoBadgeVariant } from '@/app/utils/dashboard.utils';
import { mapMercadoPagoStatusLabel, mapSfactoryEstadoBadgeVariant } from '@/app/utils/pedidoEstadoDisplay';
import {
  formatPedidoEntregaDisplay,
  mapFormaPagoLabel,
} from '@/app/utils/pedidoEntregaDisplay';
import { getWebPedidoActions } from '@/app/utils/pedidoWebActions';
import type { AdminPedidoRow } from '@/app/types/adminPedido.types';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function money(value: string | number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value));
}

interface PedidoDetailModalProps {
  row: AdminPedidoRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PedidoDetailModal({ row, isOpen, onClose }: PedidoDetailModalProps) {
  const queryClient = useQueryClient();
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const webId = row?.source === 'web' ? row.id : null;
  const sfactoryOrdenId = row?.source === 'sfactory' ? row.id : null;

  useEffect(() => {
    if (!isOpen) setMotivoRechazo('');
  }, [isOpen]);

  useEffect(() => {
    setMotivoRechazo('');
  }, [webId, sfactoryOrdenId]);

  const webQuery = useQuery({
    queryKey: ['admin', 'pedido-detalle', webId],
    queryFn: () => pedidoService.getDetalle(webId!),
    enabled: isOpen && webId != null,
    staleTime: 30_000,
  });

  const sfQuery = useQuery({
    queryKey: ['admin', 'pedido-sfactory-detalle', sfactoryOrdenId],
    queryFn: async () => {
      const res = await apiClient.get<unknown>(`/admin/pedidos/sfactory/${sfactoryOrdenId}`);
      if (!res.success || res.data === undefined) {
        throw new Error((res as { message?: string }).message || 'Error al cargar orden SFactory');
      }
      return res.data;
    },
    enabled: isOpen && sfactoryOrdenId != null,
    staleTime: 30_000,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
    await queryClient.invalidateQueries({ queryKey: ['pedidos-sfactory'] });
    await queryClient.invalidateQueries({ queryKey: [...pedidosKeys.lists()] });
  };

  const refetchDetalle = async () => {
    if (webId) await queryClient.invalidateQueries({ queryKey: ['admin', 'pedido-detalle', webId] });
  };

  const aprobarMutation = useMutation({
    mutationFn: (id: number) => pedidoService.aprobar(id),
    onSuccess: async (res) => {
      const msg =
        (res as { message?: string }).message ||
        (res as { data?: { message?: string } }).data?.message ||
        'Pedido confirmado';
      toast.success(msg);
      await invalidate();
      await refetchDetalle();
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo confirmar el pedido');
    },
  });

  const aprobarSfactoryMutation = useMutation({
    mutationFn: (sfId: number) => pedidoService.aprobarSFactory(sfId),
    onSuccess: async (result) => {
      toast.success(result?.message || 'Orden aprobada en SFactory');
      if (webId) await pedidoService.sync(webId);
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo aprobar en SFactory');
    },
  });

  const syncMutation = useMutation({
    mutationFn: (id: number) => pedidoService.sync(id),
    onSuccess: async () => {
      toast.success('Estado sincronizado desde SFactory');
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo sincronizar');
    },
  });

  const reintentarMutation = useMutation({
    mutationFn: (id: number) => pedidoService.reintentarSfactory(id),
    onSuccess: async (res) => {
      toast.success((res as { message?: string }).message || 'Reintento ejecutado');
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo reintentar');
    },
  });

  const rechazarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) => pedidoService.rechazar(id, motivo),
    onSuccess: async () => {
      toast.success('Pedido rechazado / cancelado');
      setMotivoRechazo('');
      await invalidate();
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo rechazar el pedido');
    },
  });

  const title = useMemo(() => {
    if (!row) return 'Pedido';
    if (row.source === 'web') return `Pedido ecommerce #${row.id}`;
    return `Orden SFactory ${row.numero}`;
  }, [row]);

  const webPedido = webQuery.data;
  const actions = webPedido ? getWebPedidoActions(webPedido) : null;
  const anyActionBusy =
    aprobarMutation.isPending ||
    aprobarSfactoryMutation.isPending ||
    syncMutation.isPending ||
    reintentarMutation.isPending ||
    rechazarMutation.isPending;

  const body = !row ? null : row.source === 'web' ? (
    webQuery.isPending ? (
      <div className="flex items-center justify-center py-12 text-neutral-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando detalle...
      </div>
    ) : webQuery.isError ? (
      <p className="text-sm text-red-600 py-4">
        {webQuery.error instanceof Error ? webQuery.error.message : 'Error al cargar'}
      </p>
    ) : webPedido && actions ? (
      <WebDetalleBody
        pedido={webPedido}
        actions={actions}
        motivoRechazo={motivoRechazo}
        onMotivoChange={setMotivoRechazo}
        busy={anyActionBusy}
        onConfirmWeb={() => aprobarMutation.mutate(webPedido.id)}
        onAprobarSfactory={() => {
          if (webPedido.sfactoryOrdenId != null) {
            aprobarSfactoryMutation.mutate(webPedido.sfactoryOrdenId);
          }
        }}
        onSync={() => syncMutation.mutate(webPedido.id)}
        onReintentar={() => reintentarMutation.mutate(webPedido.id)}
        onReject={() =>
          rechazarMutation.mutate({
            id: webPedido.id,
            motivo: motivoRechazo.trim() || undefined,
          })
        }
      />
    ) : null
  ) : sfQuery.isPending ? (
    <div className="flex items-center justify-center py-12 text-neutral-500 gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      Cargando orden SFactory...
    </div>
  ) : sfQuery.isError ? (
    <p className="text-sm text-red-600 py-4">
      {sfQuery.error instanceof Error ? sfQuery.error.message : 'Error al cargar'}
    </p>
  ) : (
    <SfactoryDetalleBody data={sfQuery.data} row={row} />
  );

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      {body}
    </BaseModal>
  );
}

function WebDetalleBody({
  pedido,
  actions,
  motivoRechazo,
  onMotivoChange,
  busy,
  onConfirmWeb,
  onAprobarSfactory,
  onSync,
  onReintentar,
  onReject,
}: {
  pedido: AdminPedidoDetalle;
  actions: ReturnType<typeof getWebPedidoActions>;
  motivoRechazo: string;
  onMotivoChange: (v: string) => void;
  busy: boolean;
  onConfirmWeb: () => void;
  onAprobarSfactory: () => void;
  onSync: () => void;
  onReintentar: () => void;
  onReject: () => void;
}) {
  const entrega = formatPedidoEntregaDisplay(pedido);
  const showActions =
    actions.canConfirmWeb ||
    actions.canAprobarEnSfactory ||
    actions.canReintentarSfactory ||
    actions.canSyncSfactory ||
    actions.canReject ||
    actions.paymentPendingMessage != null;

  return (
    <div className="space-y-6">
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

      <section>
        <h3 className="text-sm font-semibold text-neutral-900 mb-2">Cliente</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-neutral-500">Nombre</dt>
            <dd className="font-medium">{pedido.clienteNombre}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Email</dt>
            <dd>{pedido.clienteEmail}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Teléfono</dt>
            <dd>{pedido.clienteTelefono || '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Dirección</dt>
            <dd>{pedido.clienteDireccion || '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Ref. cliente</dt>
            <dd>{pedido.refCliente || '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Cliente BD</dt>
            <dd>
              {pedido.cliente
                ? `#${pedido.cliente.id} ${pedido.cliente.razonSocial ?? ''}`.trim()
                : '—'}
            </dd>
          </div>
        </dl>
      </section>

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
          {pedido.trackingUrl ? (
            <div className="sm:col-span-2">
              <dt className="text-neutral-500">Tracking</dt>
              <dd>
                <a
                  href={pedido.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {pedido.trackingUrl}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-neutral-900 mb-2">Ítems</h3>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-3 py-2">Producto</th>
                <th className="text-right px-3 py-2">Cant.</th>
                <th className="text-right px-3 py-2">P. unit.</th>
                <th className="text-right px-3 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(pedido.items ?? []).map((it) => (
                <tr key={it.id} className="border-t border-neutral-100">
                  <td className="px-3 py-2">
                    <div className="font-medium">{it.nombre}</div>
                    <div className="text-xs text-neutral-500">{it.codigo}</div>
                  </td>
                  <td className="px-3 py-2 text-right">{Number(it.cantidad)}</td>
                  <td className="px-3 py-2 text-right">{money(it.precioUnitario)}</td>
                  <td className="px-3 py-2 text-right font-medium">{money(it.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex justify-end gap-6 text-sm">
          <span className="text-neutral-600">
            Subtotal <span className="font-medium text-neutral-900">{money(pedido.subtotal)}</span>
          </span>
          {Number(pedido.descuento ?? 0) > 0 ? (
            <span className="text-neutral-600">
              Desc. <span className="font-medium">{money(pedido.descuento ?? 0)}</span>
            </span>
          ) : null}
          {pedido.cuponCodigoSnapshot ? (
            <span className="text-neutral-600">
              Cupón {pedido.cuponCodigoSnapshot}{' '}
              <span className="font-medium">{money(pedido.cuponDescuentoTotal ?? 0)}</span>
            </span>
          ) : null}
          <span className="text-base font-semibold">Total {money(pedido.total)}</span>
        </div>
      </section>

      {pedido.observaciones ? (
        <section>
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">Observaciones</h3>
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{pedido.observaciones}</p>
        </section>
      ) : null}

      {showActions ? (
        <section className="border-t border-neutral-200 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900">Acciones</h3>
          {actions.paymentPendingMessage && !actions.canConfirmWeb ? (
            <p className="text-xs text-neutral-600">
              No podés confirmar este pedido hasta que el cliente pague en Mercado Pago.
            </p>
          ) : null}
          {actions.canConfirmWeb ? (
            <p className="text-xs text-neutral-600">
              Confirmar reserva stock y crea el pedido en SFactory. El estado final será{' '}
              <strong>confirmado</strong>.
            </p>
          ) : null}
          {actions.canAprobarEnSfactory && !actions.canConfirmWeb ? (
            <p className="text-xs text-neutral-600">
              La orden ya existe en SFactory. Aprobá en ERP para cerrar la venta; luego podés
              sincronizar el estado local.
            </p>
          ) : null}
          {actions.canReject && (
            <div>
              <label className="text-xs font-medium text-neutral-600">Motivo rechazo (opcional)</label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => onMotivoChange(e.target.value)}
                rows={2}
                className="mt-1 w-full border border-neutral-300 rounded-md px-2 py-1.5 text-sm"
                placeholder="Ej: datos incompletos..."
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {actions.canConfirmWeb ? (
              <Button variant="primary" disabled={busy} onClick={onConfirmWeb}>
                {busy ? 'Procesando...' : actions.confirmLabel}
              </Button>
            ) : null}
            {actions.canAprobarEnSfactory ? (
              <Button variant="primary" disabled={busy} onClick={onAprobarSfactory}>
                {busy ? 'Procesando...' : 'Aprobar en SFactory'}
              </Button>
            ) : null}
            {actions.canReintentarSfactory ? (
              <Button variant="black" disabled={busy} onClick={onReintentar}>
                Reintentar envío a SFactory
              </Button>
            ) : null}
            {actions.canSyncSfactory ? (
              <Button variant="ghost" disabled={busy} onClick={onSync}>
                Sincronizar estado
              </Button>
            ) : null}
            {actions.canReject ? (
              <Button variant="redOutline" disabled={busy} onClick={onReject}>
                Rechazar / cancelar
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SfactoryDetalleBody({ data, row }: { data: unknown; row: AdminPedidoRow }) {
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
              {summary ? (
                <Badge variant={mapSfactoryEstadoBadgeVariant(summary.estado)}>
                  {summary.estado_d} ({summary.estado})
                </Badge>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Total</dt>
            <dd className="font-medium">{money(summary.total)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Fecha</dt>
            <dd>{new Date(summary.fecha).toLocaleString('es-AR')}</dd>
          </div>
        </dl>
      ) : null}
      <details className="text-sm">
        <summary className="cursor-pointer text-neutral-700 font-medium">JSON completo (SFactory)</summary>
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
