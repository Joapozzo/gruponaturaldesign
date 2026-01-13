import { useMutation, useQueryClient } from '@tanstack/react-query';
import { syncService } from '@/app/services/sync.service';
import { productosKeys } from '@/app/utils/productosKeys';

interface UseProductosSyncParams {
  empresaId: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook para sincronizar productos desde API externa
 */
export function useProductosSync({ empresaId, onSuccess, onError }: UseProductosSyncParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => syncService.syncProductos(empresaId),
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

