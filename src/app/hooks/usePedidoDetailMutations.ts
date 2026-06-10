'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { pedidoService } from '@/app/services/pedido.service';
import { useDownloadPedidoLabel } from '@/app/hooks/usePedidoShippingLabel';
import { pedidosKeys } from '@/app/utils/pedidosKeys';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { PedidoDetailActionHandlers } from '@/app/components/admin/pedidos/detail/pedidoDetail.types';

interface UsePedidoDetailMutationsOptions {
  webId: number | null;
  pedido: AdminPedidoDetalle | undefined;
  motivoRechazo: string;
  onClose: () => void;
  onRejectCleared: () => void;
}

export function usePedidoDetailMutations({
  webId,
  pedido,
  motivoRechazo,
  onClose,
  onRejectCleared,
}: UsePedidoDetailMutationsOptions) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
    await queryClient.invalidateQueries({ queryKey: ['pedidos-sfactory'] });
    await queryClient.invalidateQueries({ queryKey: [...pedidosKeys.lists()] });
  };

  const refetchDetalle = async () => {
    if (webId != null) {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pedido-detalle', webId] });
    }
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
      if (webId != null) await pedidoService.sync(webId);
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
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) =>
      pedidoService.rechazar(id, motivo),
    onSuccess: async () => {
      toast.success('Pedido rechazado / cancelado');
      onRejectCleared();
      await invalidate();
      onClose();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo rechazar el pedido');
    },
  });

  const listoRetiroMutation = useMutation({
    mutationFn: (id: number) => pedidoService.enviarListoRetiro(id),
    onSuccess: async (res) => {
      toast.success((res as { message?: string }).message || 'Aviso de retiro enviado');
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo enviar el aviso de retiro');
    },
  });

  const marcarRetiradoMutation = useMutation({
    mutationFn: (id: number) => pedidoService.marcarRetirado(id),
    onSuccess: async (res) => {
      toast.success((res as { message?: string }).message || 'Pedido marcado como retirado');
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo marcar como retirado');
    },
  });

  const crearEnvioMutation = useMutation({
    mutationFn: (id: number) => pedidoService.crearEnvioPostal(id),
    onSuccess: async (res) => {
      toast.success((res as { message?: string }).message || 'Envío procesado');
      await invalidate();
      await refetchDetalle();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear el envío');
    },
  });

  const downloadLabelMutation = useDownloadPedidoLabel();

  const busy =
    aprobarMutation.isPending ||
    aprobarSfactoryMutation.isPending ||
    syncMutation.isPending ||
    reintentarMutation.isPending ||
    rechazarMutation.isPending ||
    listoRetiroMutation.isPending ||
    marcarRetiradoMutation.isPending ||
    crearEnvioMutation.isPending ||
    downloadLabelMutation.isPending;

  const handlers: PedidoDetailActionHandlers | null = pedido
    ? {
        confirmWeb: () => aprobarMutation.mutate(pedido.id),
        aprobarSfactory: () => {
          if (pedido.sfactoryOrdenId != null) {
            aprobarSfactoryMutation.mutate(pedido.sfactoryOrdenId);
          }
        },
        reintentar: () => reintentarMutation.mutate(pedido.id),
        sync: () => syncMutation.mutate(pedido.id),
        reject: () =>
          rechazarMutation.mutate({
            id: pedido.id,
            motivo: motivoRechazo.trim() || undefined,
          }),
        crearEnvioPostal: () => crearEnvioMutation.mutate(pedido.id),
        enviarListoRetiro: () => listoRetiroMutation.mutate(pedido.id),
        marcarRetirado: () => marcarRetiradoMutation.mutate(pedido.id),
      }
    : null;

  return {
    busy,
    handlers,
    downloadLabel: () => {
      if (pedido) downloadLabelMutation.mutate(pedido.id);
    },
    isDownloadingLabel: downloadLabelMutation.isPending,
  };
}
