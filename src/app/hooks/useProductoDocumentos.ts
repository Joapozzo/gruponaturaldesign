import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';

/**
 * Hook para subir/eliminar la tabla de talles de un producto padre
 */
export function useUploadTablaTalles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productoPadreId, file }: { productoPadreId: number; file: File }) =>
      productoService.uploadTablaTalles(productoPadreId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(variables.productoPadreId) });
      queryClient.invalidateQueries({ queryKey: productosKeys.completo(variables.productoPadreId) });
    },
  });
}

export function useDeleteTablaTalles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productoPadreId: number) =>
      productoService.deleteTablaTalles(productoPadreId),
    onSuccess: (_data, productoPadreId) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(productoPadreId) });
      queryClient.invalidateQueries({ queryKey: productosKeys.completo(productoPadreId) });
    },
  });
}

/**
 * Hook para subir/eliminar la ficha técnica (indicaciones de bordado, etc.)
 */
export function useUploadFichaTecnica() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productoPadreId, file }: { productoPadreId: number; file: File }) =>
      productoService.uploadFichaTecnica(productoPadreId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(variables.productoPadreId) });
      queryClient.invalidateQueries({ queryKey: productosKeys.completo(variables.productoPadreId) });
    },
  });
}

export function useDeleteFichaTecnica() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productoPadreId: number) =>
      productoService.deleteFichaTecnica(productoPadreId),
    onSuccess: (_data, productoPadreId) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(productoPadreId) });
      queryClient.invalidateQueries({ queryKey: productosKeys.completo(productoPadreId) });
    },
  });
}
