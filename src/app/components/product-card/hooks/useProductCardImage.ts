import { useState, useEffect } from 'react';
import { getFirstProductImage, getProductImagesByColor } from '@/app/utils/productHelpers';
import { normalizeImageUrl } from '@/app/utils/normalizeImageUrl';
import { ProductWithImage } from '@/app/types/producto';

const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.png';

function isPlaceholderImage(url: string): boolean {
  return url.includes('producto-placeholder');
}

function isUsableImage(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed !== '' && !isPlaceholderImage(trimmed);
}

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
}: UseProductCardImageProps) {
    const [mainImage, setMainImage] = useState<string>(PLACEHOLDER_IMAGE);
    const [hasValidImage, setHasValidImage] = useState<boolean>(true);

    useEffect(() => {
        if (!product) {
            setMainImage(PLACEHOLDER_IMAGE);
            setHasValidImage(true);
            return;
        }

        setHasValidImage(true);

        const trySetImage = (raw: string | null | undefined): boolean => {
            if (!isUsableImage(raw)) return false;
            const normalized = normalizeImageUrl(raw);
            if (normalized && !isPlaceholderImage(normalized)) {
                setMainImage(normalized);
                return true;
            }
            return false;
        };

        if (product.imagenes && product.imagenes.length > 0) {
            for (const img of product.imagenes) {
                if (trySetImage(img)) return;
            }
        }

        if (trySetImage(product.imagen)) return;

        if (selectedColor && productName) {
            const colorImages = getProductImagesByColor(productName, selectedColor);
            if (colorImages.length > 0 && trySetImage(colorImages[0])) return;
        }

        if (productName && trySetImage(getFirstProductImage(productName))) return;

        setMainImage(PLACEHOLDER_IMAGE);
        setHasValidImage(true);
    }, [selectedColor, productName, product?.imagen, product?.imagenes, product?.Codigo]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setHasValidImage(false);
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
