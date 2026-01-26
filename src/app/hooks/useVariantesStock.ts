import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productosKeys } from '@/app/utils/productosKeys';
import { productoWebService } from '@/app/services/productoWeb.service';

interface UpdateStockParams {
  id: number;
  stockCache?: number | null;
  precioCache?: number | null;
}

interface BulkUpdateParams {
  id: number;
  stockCache?: number | null;
  precioCache?: number | null;
}

/**
 * Hook para gestionar actualizaciones de stock y precio de variantes
 */
export function useVariantesStock() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // Mutación para actualizar una variante individual
  const updateMutation = useMutation({
    mutationFn: async (params: UpdateStockParams) => {
      return productoWebService.update(params.id, {
        stockCache: params.stockCache,
        precioCache: params.precioCache,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
    },
  });

  // Actualizar stock individual
  const updateStock = async (varianteId: number, stock: number | null) => {
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: varianteId,
        stockCache: stock,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Actualizar precio individual
  const updatePrecio = async (varianteId: number, precio: number | null) => {
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: varianteId,
        precioCache: precio,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Actualizar múltiples variantes en lote
  const updateBulk = async (updates: BulkUpdateParams[]) => {
    setIsUpdating(true);
    try {
      await productoWebService.updateBulk({
        updates: updates.map(update => ({
          id: update.id,
          stockCache: update.stockCache,
          precioCache: update.precioCache,
        })),
      });
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStock,
    updatePrecio,
    updateBulk,
    isUpdating: isUpdating || updateMutation.isPending,
  };
}

