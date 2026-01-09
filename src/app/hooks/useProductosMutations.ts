import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

interface UseProductosMutationsParams {
  empresaId: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook para manejar todas las mutaciones de productos
 */
export function useProductosMutations({ empresaId, onSuccess, onError }: UseProductosMutationsParams) {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
  };

  // Actualizar destacado
  const updateDestacadoMutation = useMutation({
    mutationFn: ({ id, destacado }: { id: number; destacado: boolean }) =>
      productoService.updateDestacado(id, destacado),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  // Actualizar publicado
  const updatePublicadoMutation = useMutation({
    mutationFn: ({ id, publicado }: { id: number; publicado: boolean }) =>
      productoService.updatePublicado(id, publicado),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  // Eliminar
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Producto eliminado correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al eliminar el producto');
    },
  });

  // Bulk: Publicar
  const bulkPublicarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdatePublicado(ids, true),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Productos publicados correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al publicar productos');
    },
  });

  // Bulk: Despublicar
  const bulkDespublicarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdatePublicado(ids, false),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Productos despublicados correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al despublicar productos');
    },
  });

  // Bulk: Destacar
  const bulkDestacarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdateDestacado(ids, true),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Productos destacados correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al destacar productos');
    },
  });

  // Bulk: Quitar destacado
  const bulkQuitarDestacadoMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdateDestacado(ids, false),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Productos desmarcados como destacados');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al quitar destacado');
    },
  });

  // Crear/Actualizar (placeholder - no implementado aún)
  const saveProductoMutation = useMutation({
    mutationFn: async (data: Partial<ProductoPadreConVariantes>) => {
      // TODO: Implementar servicio de creación/actualización
      throw new Error('Creación/actualización no implementada aún');
    },
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Producto guardado correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al guardar el producto');
    },
  });

  return {
    updateDestacado: updateDestacadoMutation.mutate,
    updatePublicado: updatePublicadoMutation.mutate,
    delete: deleteMutation.mutate,
    bulkPublicar: bulkPublicarMutation.mutate,
    bulkDespublicar: bulkDespublicarMutation.mutate,
    bulkDestacar: bulkDestacarMutation.mutate,
    bulkQuitarDestacado: bulkQuitarDestacadoMutation.mutate,
    saveProducto: saveProductoMutation.mutateAsync,
    // Estados de loading
    isUpdatingDestacado: updateDestacadoMutation.isPending,
    isUpdatingPublicado: updatePublicadoMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkPublicando: bulkPublicarMutation.isPending,
    isBulkDespublicando: bulkDespublicarMutation.isPending,
    isBulkDestacando: bulkDestacarMutation.isPending,
    isBulkQuitandoDestacado: bulkQuitarDestacadoMutation.isPending,
    isSaving: saveProductoMutation.isPending,
  };
}

