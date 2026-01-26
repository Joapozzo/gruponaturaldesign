/**
 * Hook para manejo de imágenes del producto
 * Responsabilidad única: gestión de la galería de imágenes
 */

import { useMemo } from 'react';
import { useImageNavigation } from './useImageNavigation';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';

interface UseProductCardImagesProps {
  selectedVariant: VariantePublicada | null;
  imagenPrincipal: string | null;
}

interface UseProductCardImagesReturn {
  images: string[];
  currentImage: string;
  currentImageIndex: number;
  nextImage: () => void;
  prevImage: () => void;
  setImageIndex: (index: number) => void;
  hasMultipleImages: boolean;
}

export function useProductCardImages({
  selectedVariant,
  imagenPrincipal,
}: UseProductCardImagesProps): UseProductCardImagesReturn {
  // Preparar imágenes para la galería
  const images = useMemo(() => {
    if (selectedVariant?.imagen && selectedVariant.imagen.trim() !== '') {
      return [selectedVariant.imagen];
    }
    if (imagenPrincipal && imagenPrincipal.trim() !== '') {
      return [imagenPrincipal];
    }
    return ['/imgs/producto-placeholder.png'];
  }, [selectedVariant, imagenPrincipal]);

  // Asegurar que images siempre sea un array válido
  const safeImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ['/imgs/producto-placeholder.png'];

  // Hook de navegación de imágenes
  const { currentImageIndex, nextImage, prevImage, setImageIndex } = useImageNavigation(safeImages);

  // Imagen actual
  const currentImage = safeImages[currentImageIndex] || safeImages[0] || '/imgs/producto-placeholder.png';

  return {
    images: safeImages,
    currentImage,
    currentImageIndex,
    nextImage,
    prevImage,
    setImageIndex,
    hasMultipleImages: safeImages.length > 1,
  };
}

