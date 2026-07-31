'use client';

import React from 'react';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';
import ProductCardPublicado from '@/app/components/ProductCardPublicado';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { useRelatedProductsSwiper } from './hooks/useRelatedProductsSwiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface RelatedProductsProps {
  relatedProducts: ProductoPublicado[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
  const {
    expandedSku,
    setExpandedSku,
    prevButtonRef,
    nextButtonRef,
    handleSwiperInit,
    handleSlideChange,
    handlePrevSlide,
    handleNextSlide,
  } = useRelatedProductsSwiper();

  if (relatedProducts.length === 0) return null;

  const count = relatedProducts.length;
  const maxSlides = { 320: 1.5, 480: 2, 640: 3, 1024: 5 };
  const slidesPerViewBase = Math.max(1, Math.min(5, count));
  const allFitOnDesktop = count <= 5;
  const showNav = count > 1;

  const breakpoints = {
    320: {
      slidesPerView: Math.max(1, Math.min(maxSlides[320], count)),
      spaceBetween: 12,
      centeredSlides: count <= maxSlides[320],
    },
    480: {
      slidesPerView: Math.max(1, Math.min(maxSlides[480], count)),
      spaceBetween: 12,
      centeredSlides: count <= maxSlides[480],
    },
    640: {
      slidesPerView: Math.max(1, Math.min(maxSlides[640], count)),
      spaceBetween: 16,
      centeredSlides: count <= maxSlides[640],
    },
    1024: {
      slidesPerView: Math.max(1, Math.min(maxSlides[1024], count)),
      spaceBetween: 16,
      centeredSlides: count <= maxSlides[1024],
    },
  };

  return (
    <div className="mt-12 sm:mt-16 pt-4 sm:pt-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center leading-tight">
        Puede interesarte
      </h2>

      <div className="w-full overflow-hidden border-0 [border:0]">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={slidesPerViewBase}
          centeredSlides={allFitOnDesktop}
          initialSlide={0}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          allowTouchMove={!expandedSku}
          navigation={
            showNav
              ? {
                  nextEl: '#swiper-button-next-related',
                  prevEl: '#swiper-button-prev-related',
                }
              : false
          }
          autoplay={
            expandedSku
              ? false
              : {
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          loop={count > 5 && !expandedSku}
          loopAdditionalSlides={count > 5 && !expandedSku ? 2 : 0}
          breakpoints={breakpoints}
          className="pb-12"
        >
          {relatedProducts.map((producto, index) => (
            <SwiperSlide
              key={`${producto.id}-${index}`}
              className="mb-5 !flex !items-start !border-0 [border:0]"
            >
              <div className="w-full flex-shrink-0 border-0 [border:0]">
                <ProductCardPublicado
                  producto={producto}
                  index={index}
                  expandedSku={expandedSku}
                  onExpandChange={setExpandedSku}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showNav && (
          <div className="flex justify-center items-center space-x-3 mt-4">
            <button
              ref={prevButtonRef}
              id="swiper-button-prev-related"
              onClick={handlePrevSlide}
              className="swiper-button-prev-related w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-700 rotate-180 group-hover:text-gray-900" />
            </button>
            <button
              ref={nextButtonRef}
              id="swiper-button-next-related"
              onClick={handleNextSlide}
              className="swiper-button-next-related w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-900" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
