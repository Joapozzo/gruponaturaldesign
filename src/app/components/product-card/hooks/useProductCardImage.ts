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
        const target = e.target as HTMLImageElement;

        // Intentar con otros colores disponibles
        if (productName && availableColors.length > 0 && imageLoadAttempts < availableColors.length) {
            const currentColorIndex = selectedColor ? availableColors.indexOf(selectedColor) : -1;

            // Intentar con el siguiente color
            const nextColorIndex = (currentColorIndex + 1 + imageLoadAttempts) % availableColors.length;
            const nextColor = availableColors[nextColorIndex];

            if (nextColor) {
                const colorImages = getProductImagesByColor(productName, nextColor);
                if (colorImages.length > 0) {
                    setImageLoadAttempts((prev) => prev + 1);
                    target.src = colorImages[0];
                    return;
                }
            }
        }

        // Si ya intentamos con todos los colores o no hay más opciones, usar placeholder
        // SIEMPRE mostrar algo, nunca dejar sin imagen
        if (imageLoadAttempts >= availableColors.length || availableColors.length === 0) {
            // Intentar con la primera imagen disponible del producto (cualquier color)
            if (productName) {
                const firstImage = getFirstProductImage(productName);
                if (firstImage && firstImage !== PLACEHOLDER_IMAGE) {
                    target.src = firstImage;
                    setImageLoadAttempts((prev) => prev + 1);
                    return;
                }
            }
            // Último recurso: usar placeholder pero mantener hasValidImage en true
            target.src = PLACEHOLDER_IMAGE;
            setHasValidImage(true); // Siempre mostrar algo
        } else {
            setImageLoadAttempts((prev) => prev + 1);
        }
    };

    return {
        mainImage,
        hasValidImage,
        handleImageError,
        setHasValidImage,
    };
}

