/**
 * Hook para manejo de imágenes del producto
 * Responsabilidad única: gestión de la galería de imágenes
 * Si el color seleccionado no tiene imagen, usa la de otra variante del mismo producto.
 */

import { useMemo } from 'react';
import { useImageNavigation } from './useImageNavigation';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';

function isValidImageUrl(url: string | null | undefined): boolean {
  return Boolean(url && typeof url === 'string' && url.trim() !== '');
}

interface UseProductCardImagesProps {
  selectedVariant: VariantePublicada | null;
  imagenPrincipal: string | null;
  /** Todas las variantes del producto; se usa para fallback cuando el color seleccionado no tiene imagen */
  variantes?: VariantePublicada[];
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
  variantes = [],
}: UseProductCardImagesProps): UseProductCardImagesReturn {
  // Preparar imágenes: 1) imagen del color seleccionado 2) imagenPrincipal 3) primera variante con imagen 4) placeholder
  const images = useMemo(() => {
    if (isValidImageUrl(selectedVariant?.imagen)) {
      return [selectedVariant!.imagen!];
    }
    if (isValidImageUrl(imagenPrincipal)) {
      return [imagenPrincipal!];
    }
    const otraVarianteConImagen = variantes.find((v) => isValidImageUrl(v.imagen));
    if (otraVarianteConImagen?.imagen) {
      return [otraVarianteConImagen.imagen];
    }
    return ['/imgs/producto-placeholder.png'];
  }, [selectedVariant, imagenPrincipal, variantes]);

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

