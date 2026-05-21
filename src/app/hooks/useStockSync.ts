import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { syncService } from '@/app/services/sync.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { useSync } from '@/components/admin/SyncContext';

interface UseStockSyncParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

function errorToMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Error al sincronizar stock';
}

/**
 * Sincroniza solo stock/precios desde el depósito ecommerce (S-Factory inventario).
 */
export function useStockSync({ onSuccess, onError }: UseStockSyncParams = {}) {
  const queryClient = useQueryClient();
  const { setIsSyncing } = useSync();

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      try {
        return await syncService.syncStockPrecios();
      } finally {
        setIsSyncing(false);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all });

      const d = result.data;
      if (d) {
        if (d.variantesActualizadas === 0) {
          if (d.codigosConsultados === 0) {
            const msg =
              'Stock: no hay variantes WORKWEAR/OFFICE activas. Sincronizá rubros y productos primero.';
            toast.error(msg, { duration: 8000 });
            onSuccess?.(msg);
            return;
          }
          const msg = `Stock: 0 variantes actualizadas (${d.codigosConsultados} códigos en ${d.lotes} lotes). S-Factory no devolvió filas que coincidan con tus códigos o el depósito ${d.warehouseId} no tiene datos para ellos.`;
          toast.error(msg, { duration: 10000 });
          onSuccess?.(msg);
          return;
        }

        const omitidos = d.codigosOmitidos?.length
          ? ` · Omitidos en S-Factory: ${d.codigosOmitidos.length} (${d.codigosOmitidos.slice(0, 5).join(', ')}${d.codigosOmitidos.length > 5 ? '…' : ''})`
          : '';
        const okMsg = `Stock: ${d.variantesActualizadas} variantes actualizadas · depósito ${d.warehouseId} · ${d.llamadasApi ?? d.lotes} llamada(s) API${omitidos}`;
        if (d.codigosOmitidos?.length) {
          toast(okMsg, { duration: 10000, icon: '⚠️' });
        } else {
          toast.success(okMsg, { duration: 6000 });
        }
        onSuccess?.(okMsg);
        return;
      }

      const fallback = result.message || 'Stock actualizado';
      toast.success(fallback);
      onSuccess?.(fallback);
    },
    onError: (error: unknown) => {
      const msg = errorToMessage(error);
      toast.error(msg, { duration: 8000 });
      onError?.(msg);
    },
  });

  return {
    syncStock: mutation.mutateAsync,
    isStockSyncing: mutation.isPending,
  };
}
