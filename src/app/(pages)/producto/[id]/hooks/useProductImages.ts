import { useState } from 'react';
import { getProductImages } from '../helpers/productHelpers';

/**
 * Hook para manejar la galería de imágenes del producto
 */
export function useProductImages(
    imagenes: string[] | undefined,
    imagen: string | null | undefined,
    maxImages: number = 5
) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const images = getProductImages(imagenes, imagen, maxImages);

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

