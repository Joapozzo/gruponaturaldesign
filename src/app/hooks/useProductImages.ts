import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductImages } from '../utils/productHelpers';
import { productImageService, type ProductImage, type UploadImagesParams } from '../services/productImage.service';

/**
 * Hook para manejar la galería de imágenes del producto
 */
export function useProductImages(
    imagenes: string[] | undefined,
    imagen: string | null | undefined,
    maxImages: number = 5,
    productName?: string,
    color?: string | null,
    availableColors?: string[]
) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [modalLabel, setModalLabel] = useState<string | undefined>(undefined);

    // Recalcular imágenes cuando cambia el color o el productName
    // Si la variante no tiene imágenes, no usar placeholder (galería muestra ninguna)
    const images = useMemo(() => {
        const hasInput = (imagenes && imagenes.length > 0) || (imagen && imagen.trim() !== '');
        if (!hasInput) return [];
        return getProductImages(imagenes, imagen, maxImages, productName, color, availableColors);
    }, [imagenes, imagen, maxImages, productName, color, availableColors]);

    // Resetear índice cuando cambian las imágenes (ej. al cambiar variante)
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [color, images.length, images[0] ?? '']);

    const nextImage = () => {
        if (isImageModalOpen && modalImages.length > 0) {
            // Si el modal está abierto, navegar en las imágenes del modal
            setModalImageIndex((prev) =>
                prev === modalImages.length - 1 ? 0 : prev + 1
            );
        } else if (images.length > 0) {
            // Si el modal está cerrado, navegar en todas las imágenes
            setCurrentImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (isImageModalOpen && modalImages.length > 0) {
            // Si el modal está abierto, navegar en las imágenes del modal
            setModalImageIndex((prev) =>
                prev === 0 ? modalImages.length - 1 : prev - 1
            );
        } else if (images.length > 0) {
            // Si el modal está cerrado, navegar en todas las imágenes
            setCurrentImageIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index: number) => {
        if (index >= 0 && index < images.length) {
            setCurrentImageIndex(index);
        }
    };

    const openModal = (validImages?: string[], validIndex?: number, label?: string) => {
        if (validImages && validImages.length > 0) {
            setModalImages(validImages);
            setModalImageIndex(validIndex !== undefined ? validIndex : 0);
            setModalLabel(label);
        } else {
            // Si no se pasan imágenes válidas, usar todas las imágenes filtradas por color
            setModalImages(images);
            setModalImageIndex(currentImageIndex);
            setModalLabel(undefined);
        }
        setIsImageModalOpen(true);
    };

    const closeModal = () => {
        setIsImageModalOpen(false);
        setModalLabel(undefined);
    };

    return {
        images,
        currentImageIndex,
        isImageModalOpen,
        modalImages: modalImages.length > 0 ? modalImages : images, // Usar imágenes del modal si hay, sino todas
        modalImageIndex: isImageModalOpen ? modalImageIndex : currentImageIndex, // Usar índice del modal si está abierto
        nextImage,
        prevImage,
        goToImage,
        openModal,
        closeModal,
        modalLabel,
    };
}

/**
 * Hook para obtener imágenes de un producto agrupadas por color
 */
export function useProductImagesByColor(productoWebId: number) {
    return useQuery({
        queryKey: ['product-images', 'by-color', productoWebId],
        queryFn: () => productImageService.getImagesByColor(productoWebId),
        enabled: !!productoWebId,
    });
}

/**
 * Hook para obtener imágenes de un producto padre (todas las variantes) agrupadas por color
 */
export function useProductoPadreImages(productoPadreId: number) {
    return useQuery({
        queryKey: ['product-images', 'producto-padre', productoPadreId],
        queryFn: () => productImageService.getProductoPadreImages(productoPadreId),
        enabled: !!productoPadreId,
    });
}

/**
 * Hook para obtener imágenes de un producto (con filtro opcional por color)
 */
export function useProductImagesList(productoWebId: number, color?: string) {
    return useQuery({
        queryKey: ['product-images', productoWebId, color],
        queryFn: () => productImageService.getImages(productoWebId, color),
        enabled: !!productoWebId,
    });
}

/**
 * Hook para subir imágenes de producto
 */
export function useUploadProductImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: UploadImagesParams) => productImageService.uploadImages(params),
        onSuccess: (data, variables) => {
            // Invalidar queries relacionadas
            if (variables.productoWebId) {
                queryClient.invalidateQueries({ queryKey: ['product-images', 'by-color', variables.productoWebId] });
                queryClient.invalidateQueries({ queryKey: ['product-images', variables.productoWebId] });
            }
            if (variables.productoPadreId) {
                queryClient.invalidateQueries({ queryKey: ['product-images', 'producto-padre', variables.productoPadreId] });
            }
        },
    });
}

/**
 * Hook para eliminar una imagen de producto
 */
export function useDeleteProductImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageId: number) => productImageService.deleteImage(imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-images'] });
        },
    });
}

/**
 * Hook para eliminar varias imágenes de producto en lote
 */
export function useDeleteProductImagesBulk() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: number[]) => productImageService.deleteImages(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-images'] });
        },
    });
}

/**
 * Hook para reordenar imágenes de producto
 */
export function useReorderProductImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (images: { id: number; orden: number }[]) =>
            productImageService.reorderImages(images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-images'] });
        },
    });
}

