/**
 * Hook para manejo de imágenes del producto
 * Responsabilidad única: gestión de la galería de imágenes
 * Si el color seleccionado no tiene imagen, usa imagenPrincipal u otra variante.
 */

import { useMemo } from 'react';
import { useImageNavigation } from './useImageNavigation';
import type { VariantePublicada } from '@/app/types/producto-publicado.types';
import { normalizeImageUrl } from '@/app/utils/normalizeImageUrl';

const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.png';

function isPlaceholderImage(url: string): boolean {
  return url.includes('producto-placeholder');
}

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed !== '' && !isPlaceholderImage(trimmed);
}

function resolveProductCardImage(
  selectedVariant: VariantePublicada | null,
  imagenPrincipal: string | null,
  variantes: VariantePublicada[],
): string | null {
  const candidates: (string | null | undefined)[] = [
    selectedVariant?.imagen,
    imagenPrincipal,
    ...variantes.map((v) => v.imagen),
  ];

  for (const raw of candidates) {
    if (!isValidImageUrl(raw)) continue;
    const normalized = normalizeImageUrl(raw);
    if (normalized && !isPlaceholderImage(normalized)) {
      return normalized;
    }
  }

  return null;
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
  const images = useMemo(() => {
    const resolved = resolveProductCardImage(
      selectedVariant,
      imagenPrincipal,
      variantes,
    );
    return resolved ? [resolved] : [PLACEHOLDER_IMAGE];
  }, [selectedVariant, imagenPrincipal, variantes]);

  const safeImages =
    Array.isArray(images) && images.length > 0 ? images : [PLACEHOLDER_IMAGE];

  const { currentImageIndex, nextImage, prevImage, setImageIndex } =
    useImageNavigation(safeImages);

  const currentImage =
    safeImages[currentImageIndex] || safeImages[0] || PLACEHOLDER_IMAGE;

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
