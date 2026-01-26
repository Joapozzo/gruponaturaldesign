import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncService } from '@/app/services/sync.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { useSync } from '@/components/admin/SyncContext';

interface UseProductosSyncParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook para sincronizar productos desde API externa
 * Usa SyncContext para deshabilitar toda la UI durante la sincronización
 */
export function useProductosSync({ onSuccess, onError }: UseProductosSyncParams = {}) {
  const queryClient = useQueryClient();
  const { setIsSyncing } = useSync();

  const mutation = useMutation({
    mutationFn: async () => {
      // Activar el estado de sincronización en el context para deshabilitar UI
      setIsSyncing(true);
      try {
        return await syncService.syncProductos();
      } finally {
        // Siempre desactivar al terminar (éxito o error)
        setIsSyncing(false);
      }
    },
    onSuccess: (data) => {
      // Invalidar queries de productos para refrescar datos
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
      onSuccess?.(data.message || 'Sincronización completada correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al sincronizar productos');
    },
  });

  return {
    sync: mutation.mutateAsync,
    isSyncing: mutation.isPending,
  };
}

