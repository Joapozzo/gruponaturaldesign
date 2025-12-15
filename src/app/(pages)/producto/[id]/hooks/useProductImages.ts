import React, { useState, useEffect, useMemo } from 'react';
import { getProductImages } from '../helpers/productHelpers';

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

    // Recalcular imágenes cuando cambia el color o el productName
    // Usar useMemo para evitar recálculos innecesarios
    const images = useMemo(() => {
        return getProductImages(imagenes, imagen, maxImages, productName, color, availableColors);
    }, [imagenes, imagen, maxImages, productName, color, availableColors]);

    // Resetear índice cuando cambia el color
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [color]);

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
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

    const openModal = () => {
        setIsImageModalOpen(true);
    };

    const closeModal = () => {
        setIsImageModalOpen(false);
    };

    return {
        images,
        currentImageIndex,
        isImageModalOpen,
        nextImage,
        prevImage,
        goToImage,
        openModal,
        closeModal,
    };
}

