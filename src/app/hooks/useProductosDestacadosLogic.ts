/**
 * Hook de lógica para ProductosDestacados
 * Maneja toda la lógica de estado, Swiper y datos
 * Separado del componente de presentación (principio de refactorización)
 * Usa la nueva estructura ProductoPublicado optimizada
 */

import { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { useRouter } from 'next/navigation';
import { useProductosDestacados } from './useProductosPublicados';
import type { ProductoPublicado } from '../types/producto-publicado.types';

interface UseProductosDestacadosLogicOptions {
  limit?: number;
  tieneStock?: boolean;
}

interface UseProductosDestacadosLogicReturn {
  // Datos (nueva estructura optimizada)
  productos: ProductoPublicado[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Estado del slider
  expandedSku: string | null;
  setExpandedSku: (sku: string | null) => void;
  
  // Refs de Swiper
  swiperRef: React.MutableRefObject<SwiperType | null>;
  currentSlideIndexRef: React.MutableRefObject<number>;
  prevButtonRef: React.RefObject<HTMLButtonElement | null>;
  nextButtonRef: React.RefObject<HTMLButtonElement | null>;
  
  // Handlers
  handleGoToPage: () => void;
  handleSwiperInit: (swiper: SwiperType) => void;
  handleSlideChange: (swiper: SwiperType) => void;
  handlePrevSlide: () => void;
  handleNextSlide: () => void;
}

/**
 * Hook que encapsula toda la lógica de ProductosDestacados
 * Usa la nueva estructura ProductoPublicado optimizada del backend
 */
export function useProductosDestacadosLogic(
  options: UseProductosDestacadosLogicOptions = {}
): UseProductosDestacadosLogicReturn {
  const router = useRouter();
  const { limit = 20, tieneStock } = options;
  
  // Estado del slider
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  
  // Refs
  const swiperRef = useRef<SwiperType | null>(null);
  const currentSlideIndexRef = useRef<number>(0);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  
  // Fetch de productos destacados (nueva estructura optimizada)
  const { productos, isLoading, isError, error } = useProductosDestacados({
    page: 1,
    limit,
    tieneStock,
  });
  
  // Manejar autoplay cuando un producto está expandido
  useEffect(() => {
    if (!swiperRef.current) return;
    
    if (expandedSku) {
      // Guardar el índice del slide actual
      currentSlideIndexRef.current = swiperRef.current.activeIndex;
      
      // Detener el autoplay
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
        if (swiperRef.current.autoplay.running) {
          swiperRef.current.autoplay.stop();
        }
      }
      
      // Bloquear movimiento táctil
      swiperRef.current.allowTouchMove = false;
      
      // Forzar que se mantenga en el slide actual
      swiperRef.current.slideTo(currentSlideIndexRef.current, 0);
    } else {
      // Reanudar autoplay
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.start();
      }
      // Permitir movimiento del slider
      swiperRef.current.allowTouchMove = true;
    }
    
    // Actualizar estado visual de los botones de navegación
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
  
  // Handlers
  const handleGoToPage = () => {
    router.push('/shoponline');
  };
  
  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    currentSlideIndexRef.current = swiper.activeIndex;
    // Asegurar que comience desde el primer slide
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
    productos,
    isLoading,
    isError,
    error,
    expandedSku,
    setExpandedSku,
    swiperRef,
    currentSlideIndexRef,
    prevButtonRef,
    nextButtonRef,
    handleGoToPage,
    handleSwiperInit,
    handleSlideChange,
    handlePrevSlide,
    handleNextSlide,
  };
}
