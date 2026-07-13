'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import BaseModal from '@/app/components/modal/BaseModal';
import { pedidoService } from '@/app/services/pedido.service';
import { apiClient } from '@/lib/apiClient';
import { getWebPedidoActions } from '@/app/utils/pedidoWebActions';
import { PedidoWebDetalleView } from '@/app/components/admin/pedidos/detail/PedidoWebDetalleView';
import { PedidoSfactoryDetalleView } from '@/app/components/admin/pedidos/detail/PedidoSfactoryDetalleView';
import {
  ShippingTrackingModal,
  type ShippingTrackingModalInitial,
} from '@/app/components/shipping';
import { usePedidoDetailMutations } from '@/app/hooks/usePedidoDetailMutations';
import { resolvePedidoShippingTracking } from '@/app/utils/pedidoShippingTracking';
import type { AdminPedidoRow } from '@/app/types/adminPedido.types';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';

interface PedidoDetailModalProps {
  row: AdminPedidoRow | null;
  isOpen: boolean;
  onClose: () => void;
}

function PedidoDetailLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-12 text-neutral-500 gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      {label}
    </div>
  );
}

function PedidoDetailError({ message }: { message: string }) {
  return <p className="text-sm text-red-600 py-4">{message}</p>;
}

export function PedidoDetailModal({ row, isOpen, onClose }: PedidoDetailModalProps) {
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingInitial, setTrackingInitial] = useState<ShippingTrackingModalInitial | undefined>();

  const webId = row?.source === 'web' ? row.id : null;
  const sfactoryOrdenId = row?.source === 'sfactory' ? row.id : null;

  useEffect(() => {
    if (!isOpen) {
      setMotivoRechazo('');
      setTrackingModalOpen(false);
      setTrackingInitial(undefined);
    }
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

  const webPedido = webQuery.data;
  const actions = webPedido ? getWebPedidoActions(webPedido) : null;

  const { busy, handlers, downloadLabel, isDownloadingLabel } = usePedidoDetailMutations({
    webId,
    pedido: webPedido,
    motivoRechazo,
    onClose,
    onRejectCleared: () => setMotivoRechazo(''),
  });

  const title = useMemo(() => {
    if (!row) return 'Pedido';
    if (row.source === 'web') return `Pedido ecommerce #${row.id}`;
    return `Orden SFactory ${row.numero}`;
  }, [row]);

  const openPedidoTracking = (pedido: AdminPedidoDetalle) => {
    const resolved = resolvePedidoShippingTracking(pedido);
    setTrackingInitial({
      pedidoId: pedido.id,
      provider: resolved.shippingProvider ?? undefined,
      trackingNumber: resolved.trackingNumber ?? undefined,
      trackingUrl: resolved.trackingUrl,
    });
    setTrackingModalOpen(true);
  };

  const body = !row ? null : row.source === 'web' ? (
    webQuery.isPending ? (
      <PedidoDetailLoading label="Cargando detalle..." />
    ) : webQuery.isError ? (
      <PedidoDetailError
        message={
          webQuery.error instanceof Error ? webQuery.error.message : 'Error al cargar'
        }
      />
    ) : webPedido && actions && handlers ? (
      <PedidoWebDetalleView
        pedido={webPedido}
        actions={actions}
        busy={busy}
        motivoRechazo={motivoRechazo}
        onMotivoChange={setMotivoRechazo}
        handlers={handlers}
        onOpenTracking={() => openPedidoTracking(webPedido)}
        onDownloadLabel={downloadLabel}
        isDownloadingLabel={isDownloadingLabel}
      />
    ) : null
  ) : sfQuery.isPending ? (
    <PedidoDetailLoading label="Cargando orden SFactory..." />
  ) : sfQuery.isError ? (
    <PedidoDetailError
      message={sfQuery.error instanceof Error ? sfQuery.error.message : 'Error al cargar'}
    />
  ) : (
    <PedidoSfactoryDetalleView data={sfQuery.data} row={row} />
  );

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="xl">
        {body}
      </BaseModal>
      <ShippingTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        initial={trackingInitial}
        onSaved={async () => {
          if (webId == null) return;
          const r = await webQuery.refetch();
          if (r.data) {
            const resolved = resolvePedidoShippingTracking(r.data);
            setTrackingInitial({
              pedidoId: r.data.id,
              provider: resolved.shippingProvider ?? undefined,
              trackingNumber: resolved.trackingNumber ?? undefined,
              trackingUrl: resolved.trackingUrl,
            });
          }
        }}
      />
    </>
  );
}
