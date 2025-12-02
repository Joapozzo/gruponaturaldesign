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

        // Prioridad 1: Imagen del color seleccionado
        if (selectedColor && productName) {
            const colorImages = getProductImagesByColor(productName, selectedColor);
            if (colorImages.length > 0) {
                setMainImage(colorImages[0]);
                return;
            }
        }

        // Prioridad 2: Primera imagen disponible del producto (cualquier color)
        if (productName) {
            setMainImage(getFirstProductImage(productName));
            return;
        }

        // Prioridad 3: Imágenes del producto si existen
        const productImages =
            product.imagenes && product.imagenes.length > 0
                ? product.imagenes.filter((img) => img && img.trim() !== '' && !img.includes('.png'))
                : product.imagen && product.imagen.trim() !== '' && !product.imagen.includes('.png')
                  ? [product.imagen]
                  : [];
        if (productImages.length > 0) {
            setMainImage(productImages[0]);
            return;
        }

        // Fallback: placeholder
        setMainImage(PLACEHOLDER_IMAGE);
    }, [selectedColor, productName, product.imagen, product.imagenes]);

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

        // Si ya intentamos con todos los colores o no hay más opciones, marcar como sin imagen
        if (imageLoadAttempts >= availableColors.length || availableColors.length === 0) {
            setHasValidImage(false);
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

