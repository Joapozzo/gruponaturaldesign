import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService, type UploadImagesParams } from '../services/productImage.service';

/**
 * Hook para obtener imágenes de un producto
 */
export const useProductImages = (productoWebId: number, color?: string) => {
  return useQuery({
    queryKey: ['product-images', productoWebId, color],
    queryFn: () => productImageService.getImages(productoWebId, color),
    enabled: !!productoWebId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener imágenes agrupadas por color
 */
export const useProductImagesByColor = (productoWebId: number) => {
  return useQuery({
    queryKey: ['product-images-by-color', productoWebId],
    queryFn: () => productImageService.getImagesByColor(productoWebId),
    enabled: !!productoWebId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener colores de un producto
 */
export const useProductColors = (productoWebId: number) => {
  return useQuery({
    queryKey: ['product-colors', productoWebId],
    queryFn: () => productImageService.getColors(productoWebId),
    enabled: !!productoWebId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para subir imágenes
 */
export const useUploadProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadImagesParams) =>
      productImageService.uploadImages(params),
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['product-images', variables.productoWebId],
      });
      queryClient.invalidateQueries({
        queryKey: ['product-images-by-color', variables.productoWebId],
      });
      queryClient.invalidateQueries({
        queryKey: ['product-colors', variables.productoWebId],
      });
    },
  });
};

/**
 * Hook para eliminar imágenes
 */
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => productImageService.deleteImage(imageId),
    onSuccess: () => {
      // Invalidar todas las queries de imágenes
      queryClient.invalidateQueries({
        queryKey: ['product-images'],
      });
      queryClient.invalidateQueries({
        queryKey: ['product-images-by-color'],
      });
      queryClient.invalidateQueries({
        queryKey: ['product-colors'],
      });
    },
  });
};

