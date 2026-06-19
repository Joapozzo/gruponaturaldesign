/**
 * Hook para manejar la lógica del Swiper en RelatedProducts
 * Misma lógica de control que useProductosDestacadosLogic
 */

import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

interface UseRelatedProductsSwiperReturn {
  expandedSku: string | null;
  setExpandedSku: (sku: string | null) => void;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  currentSlideIndexRef: React.MutableRefObject<number>;
  prevButtonRef: React.RefObject<HTMLButtonElement | null>;
  nextButtonRef: React.RefObject<HTMLButtonElement | null>;
  handleSwiperInit: (swiper: SwiperType) => void;
  handleSlideChange: (swiper: SwiperType) => void;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
}

export function useRelatedProductsSwiper(): UseRelatedProductsSwiperReturn {
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const currentSlideIndexRef = useRef<number>(0);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!swiperRef.current) return;

    if (expandedSku) {
      currentSlideIndexRef.current = swiperRef.current.activeIndex;

      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
        if (swiperRef.current.autoplay.running) {
          swiperRef.current.autoplay.stop();
        }
      }

      swiperRef.current.allowTouchMove = false;
      swiperRef.current.slideTo(currentSlideIndexRef.current, 0);
    } else {
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.start();
      }
      swiperRef.current.allowTouchMove = true;
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

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    currentSlideIndexRef.current = swiper.activeIndex;
    if (swiper.activeIndex !== 0) {
      swiper.slideTo(0, 0);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    if (!expandedSku) {
      currentSlideIndexRef.current = swiper.activeIndex;
    }
  };

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  return {
    expandedSku,
    setExpandedSku,
    swiperRef,
    currentSlideIndexRef,
    prevButtonRef,
    nextButtonRef,
    handleSwiperInit,
    handleSlideChange,
    handlePrevSlide,
    handleNextSlide,
  };
}
