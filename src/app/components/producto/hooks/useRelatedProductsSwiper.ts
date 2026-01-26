/**
 * Hook para manejar la lógica del Swiper en RelatedProducts
 * Encapsula toda la lógica de estado y control del slider
 */

import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface UseRelatedProductsSwiperReturn {
  expandedSku: string | null;
  setExpandedSku: (sku: string | null) => void;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  prevButtonRef: React.RefObject<HTMLButtonElement | null>;
  nextButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function useRelatedProductsSwiper(): UseRelatedProductsSwiperReturn {
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  // Pausar/reanudar autoplay cuando un producto está expandido
  useEffect(() => {
    if (swiperRef.current) {
      if (expandedSku) {
        if (swiperRef.current.autoplay) {
          swiperRef.current.autoplay.stop();
        }
        swiperRef.current.allowTouchMove = false;
      } else {
        if (swiperRef.current.autoplay) {
          swiperRef.current.autoplay.start();
        }
        swiperRef.current.allowTouchMove = true;
      }
    }

    if (prevButtonRef.current && nextButtonRef.current) {
      if (expandedSku) {
        prevButtonRef.current.disabled = true;
        nextButtonRef.current.disabled = true;
      } else {
        prevButtonRef.current.disabled = false;
        nextButtonRef.current.disabled = false;
      }
    }
  }, [expandedSku]);

  return {
    expandedSku,
    setExpandedSku,
    swiperRef,
    prevButtonRef,
    nextButtonRef,
  };
}

