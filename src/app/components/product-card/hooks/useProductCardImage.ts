import { useState, useEffect } from 'react';
import { getFirstProductImage, getProductImagesByColor } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import { ProductWithImage } from '@/app/types/producto';

const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.png';

interface UseProductCardImageProps {
    product: ProductWithImage;
    productName: string;
    selectedColor: string | null;
    availableColors?: string[];
}

export function useProductCardImage({
    product,
    productName,
    selectedColor,
    availableColors = [],
}: UseProductCardImageProps) {
    const [mainImage, setMainImage] = useState<string>(PLACEHOLDER_IMAGE);
    const [hasValidImage, setHasValidImage] = useState<boolean>(true);
    const [imageLoadAttempts, setImageLoadAttempts] = useState<number>(0);

    // Actualizar imagen cuando cambia el color seleccionado o el producto
    useEffect(() => {
        setHasValidImage(true);
        setImageLoadAttempts(0);

        // Prioridad 1: Usar imágenes del producto (la variante seleccionada ya tiene las imágenes correctas para su color)
        // Las imágenes ya vienen organizadas por color desde el servicio en la variante
        if (product.imagenes && product.imagenes.length > 0) {
            // Filtrar imágenes válidas
            const validImages = product.imagenes.filter(
                (img) => img && img.trim() !== '' && !img.includes('.png')
            );
            
            if (validImages.length > 0) {
                // Usar la primera imagen de la variante (ya está filtrada por color)
                setMainImage(validImages[0]);
                return;
            }
        }

        // Prioridad 2: Usar imagen principal del producto
        if (product.imagen && product.imagen.trim() !== '' && !product.imagen.includes('.png')) {
            setMainImage(product.imagen);
            return;
        }

        // Prioridad 3: Intentar generar desde nombre y color (fallback)
        if (selectedColor && productName) {
            const colorImages = getProductImagesByColor(productName, selectedColor);
            if (colorImages.length > 0) {
                setMainImage(colorImages[0]);
                return;
            }
        }

        // Prioridad 4: Primera imagen disponible del producto (cualquier color)
        if (productName) {
            setMainImage(getFirstProductImage(productName));
            return;
        }

        // Fallback: placeholder (siempre asegurar que haya una imagen)
        setMainImage(PLACEHOLDER_IMAGE);
        // No marcar como inválida, siempre mostrar algo
        setHasValidImage(true);
    }, [selectedColor, productName, product.imagen, product.imagenes, product.Codigo]);

    // Manejar error de carga de imagen
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        // Si la imagen falla (404 o cualquier error), mostrar Package icon directamente
        // No intentar cambiar el src, simplemente marcar como inválida para mostrar el fallback
        setHasValidImage(false);
        
        // Prevenir que el error se propague y cause problemas en la consola
        e.preventDefault?.();
        e.stopPropagation?.();
    };

    return {
        mainImage,
        hasValidImage,
        handleImageError,
        setHasValidImage,
    };
}

