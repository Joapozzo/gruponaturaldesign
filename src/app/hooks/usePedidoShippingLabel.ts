'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { downloadPedidoLabelBlob } from '@/app/components/shipping/downloadPedidoLabelBlob';
import {
  downloadPedidoLabelFile,
  fetchPedidoLabelAvailability,
} from '@/app/services/pedidoShippingLabel.service';
import type { PedidoLabelAvailability } from '@/app/validation/pedidoShippingLabel.schema';

export const pedidoLabelKeys = {
  all: ['admin', 'pedido-label'] as const,
  availability: (pedidoId: number) =>
    [...pedidoLabelKeys.all, 'availability', pedidoId] as const,
};

export function usePedidoLabelAvailability(pedidoId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: pedidoLabelKeys.availability(pedidoId ?? 0),
    queryFn: () => fetchPedidoLabelAvailability(pedidoId!),
    enabled: enabled && pedidoId != null,
    staleTime: 30_000,
    retry: false,
  });
}

export function useDownloadPedidoLabel(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pedidoId: number) => downloadPedidoLabelFile(pedidoId),
    onSuccess: ({ blob, fileName }, pedidoId) => {
      downloadPedidoLabelBlob(blob, fileName);
      toast.success('Etiqueta descargada');
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'pedido-detalle', pedidoId],
      });
      void queryClient.invalidateQueries({
        queryKey: pedidoLabelKeys.availability(pedidoId),
      });
      options?.onSuccess?.();
    },
    onError: (err) => {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'No se pudo descargar la etiqueta';
      toast.error(msg);
    },
  });
}

/** Preferir `shippingLabel` del detalle; fallback al query dedicado. */
export function resolvePedidoLabelAvailability(
  fromDetalle: PedidoLabelAvailability | null | undefined,
  fromQuery: PedidoLabelAvailability | undefined
): PedidoLabelAvailability | undefined {
  return fromDetalle ?? fromQuery;
}
