import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import { productosPublicadosKeys, productosDestacadosKeys } from '@/app/hooks/productosPublicadosKeys';
import type { ProductoPadreConVariantes, PaginatedResponse } from '@/app/types/producto.types';

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
  const [updatingProductoId, setUpdatingProductoId] = useState<number | null>(null);

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
  };

  /** Invalida cache del catálogo público (productos publicados y destacados) */
  const invalidatePublicadosCache = () => {
    queryClient.invalidateQueries({ queryKey: productosPublicadosKeys.all });
    queryClient.invalidateQueries({ queryKey: productosDestacadosKeys.all });
  };

  // Función helper para actualizar el cache optimistamente
  const updateProductoInCache = (
    productoId: number,
    updates: Partial<ProductoPadreConVariantes>
  ) => {
    queryClient.setQueriesData<PaginatedResponse<ProductoPadreConVariantes>>(
      { queryKey: productosKeys.lists() },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((producto) =>
            producto.id === productoId ? { ...producto, ...updates } : producto
          ),
        };
      }
    );
  };

  // Actualizar destacado con actualización optimista
  const updateDestacadoMutation = useMutation({
    mutationFn: ({ id, destacado }: { id: number; destacado: boolean }) =>
      productoService.updateDestacado(id, destacado),
    onMutate: async ({ id, destacado }) => {
      setUpdatingProductoId(id);
      await queryClient.cancelQueries({ queryKey: productosKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: productosKeys.lists() });
      updateProductoInCache(id, { destacado });
      return { previousData };
    },
    onError: (error, variables, context) => {
      setUpdatingProductoId(null);
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      onError?.(error.message || 'Error al actualizar destacado');
    },
    onSettled: () => {
      setUpdatingProductoId(null);
      invalidatePublicadosCache(); // Lista destacados en web
    },
  });

  // Actualizar publicado con actualización optimista
  const updatePublicadoMutation = useMutation({
    mutationFn: ({ id, publicado }: { id: number; publicado: boolean }) =>
      productoService.updatePublicado(id, publicado),
    onMutate: async ({ id, publicado }) => {
      setUpdatingProductoId(id);
      await queryClient.cancelQueries({ queryKey: productosKeys.lists() });
      const previousData = queryClient.getQueriesData({ queryKey: productosKeys.lists() });
      updateProductoInCache(id, { publicado });
      return { previousData };
    },
    onError: (error, variables, context) => {
      setUpdatingProductoId(null);
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      onError?.(error.message || 'Error al actualizar publicado');
    },
    onSettled: () => {
      setUpdatingProductoId(null);
      invalidatePublicadosCache(); // Catálogo público puede haber cambiado
    },
  });

  // Eliminar
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      invalidateQueries();
      invalidatePublicadosCache();
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
      invalidatePublicadosCache();
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
      invalidatePublicadosCache();
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
      invalidatePublicadosCache();
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
      invalidatePublicadosCache();
      onSuccess?.('Productos desmarcados como destacados');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al quitar destacado');
    },
  });

  // Crear producto en SFactory
  const crearProductoMutation = useMutation({
    mutationFn: async (data: import('../services/producto.service').SFactoryItemCreateData) => {
      return productoService.crearProducto(data);
    },
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Producto creado correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al crear el producto');
    },
  });

  // Actualizar producto en SFactory
  const actualizarProductoEnSFactoryMutation = useMutation({
    mutationFn: async ({ itemId, data }: { itemId: number; data: import('../services/producto.service').SFactoryItemEditData }) => {
      return productoService.actualizarProductoEnSFactory(itemId, data);
    },
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Producto actualizado correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al actualizar el producto');
    },
  });

  // Actualizar datos locales
  const actualizarDatosLocalesMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: {
      descripcionMarketing?: string;
      descripcionCorta?: string;
      destacado?: boolean;
      nombre?: string;
      descripcion?: string;
    }}) => {
      return productoService.actualizarDatosLocales(id, data);
    },
    onSuccess: (_data, variables) => {
      invalidateQueries();
      queryClient.invalidateQueries({ queryKey: productosKeys.completo(variables.id) });
      onSuccess?.('Datos locales actualizados correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al actualizar datos locales');
    },
  });

  // Actualizar datos de variante
  const actualizarDatosVarianteMutation = useMutation({
    mutationFn: async ({ productoWebId, data }: { productoWebId: number; data: {
      talle?: string | null;
      color?: string | null;
    }}) => {
      return productoService.actualizarDatosVariante(productoWebId, data);
    },
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Variante actualizada correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al actualizar variante');
    },
  });

  // Validar código (query, no mutation)
  const validarCodigoMutation = useMutation({
    mutationFn: async (codigo: string) => {
      return productoService.validarCodigo(codigo);
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
    // Nuevas mutaciones
    crearProducto: crearProductoMutation.mutateAsync,
    actualizarProductoEnSFactory: actualizarProductoEnSFactoryMutation.mutateAsync,
    actualizarDatosLocales: actualizarDatosLocalesMutation.mutateAsync,
    actualizarDatosVariante: actualizarDatosVarianteMutation.mutateAsync,
    validarCodigo: validarCodigoMutation.mutateAsync,
    // Estados de loading
    isUpdatingDestacado: updateDestacadoMutation.isPending,
    isUpdatingPublicado: updatePublicadoMutation.isPending,
    updatingProductoId,
    isDeleting: deleteMutation.isPending,
    isBulkPublicando: bulkPublicarMutation.isPending,
    isBulkDespublicando: bulkDespublicarMutation.isPending,
    isBulkDestacando: bulkDestacarMutation.isPending,
    isBulkQuitandoDestacado: bulkQuitarDestacadoMutation.isPending,
    isCreandoProducto: crearProductoMutation.isPending,
    isActualizandoSFactory: actualizarProductoEnSFactoryMutation.isPending,
    isActualizandoLocales: actualizarDatosLocalesMutation.isPending,
    isActualizandoVariante: actualizarDatosVarianteMutation.isPending,
    isValidandoCodigo: validarCodigoMutation.isPending,
  };
}

