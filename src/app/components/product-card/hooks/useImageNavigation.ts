import { useState, useCallback, useEffect } from 'react';

/**
 * Hook simple para navegar entre imágenes en una galería
 */
export function useImageNavigation(images: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const setImageIndex = useCallback((index: number) => {
    if (images.length === 0) return;
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  // Resetear índice cuando cambian las imágenes
  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex, images]);

  return {
    currentImageIndex: currentIndex,
    currentImage: images[currentIndex] || images[0] || '',
    nextImage,
    prevImage,
    setImageIndex,
  };
}

