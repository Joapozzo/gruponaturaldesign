'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Section from './Section';
import Button from '@/components/ui/Button';
import { useProductosDestacadosLogic } from '../hooks/useProductosDestacadosLogic';
import ProductCardPublicado from './ProductCardPublicado';
import ProductosDestacadosSkeleton from './skeleton/ProductSectionSkeleton';

const ProductosDestacados = () => {

  const {
    productos,
    isLoading,
    isError,
    error,
    expandedSku,
    setExpandedSku,
    prevButtonRef,
    nextButtonRef,
    handleGoToPage,
    handleSwiperInit,
    handleSlideChange,
    handlePrevSlide,
    handleNextSlide,
  } = useProductosDestacadosLogic({
    limit: 20,
  });
  // console.log('productos', productos);

  if (isLoading && productos.length === 0) {
    return <ProductosDestacadosSkeleton />;
  }

  if (isError) {
    return (
      <Section
        id="productos"
        className="bg-gray-50 pb-10"
        title="Productos destacados"
        subtitle="Lo mejor de nuestro shop online en diseño, calidad y funcionalidad."
        contentClassName="w-full px-4 lg:px-15"
      >
        <div className="text-center py-20 text-red-600">
          {error instanceof Error ? error.message : 'Error al cargar productos'}
        </div>
        <CTAButton onClick={handleGoToPage} />
      </Section>
    );
  }

  if (productos.length === 0) {
    return (
      <Section
        id="productos"
        className="bg-gray-50 pb-10"
        title="Productos destacados"
        subtitle="Lo mejor de nuestro shop online en diseño, calidad y funcionalidad."
        contentClassName="w-full px-4 lg:px-15"
      >
        <div className="text-center py-20 text-gray-500">
          No hay productos disponibles
        </div>
        <CTAButton onClick={handleGoToPage} />
      </Section>
    );
  }

  const count = productos.length;
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
    <Section
      id="productos"
      className="bg-gray-50 pb-10"
      title="Productos destacados"
      subtitle="Lo mejor de nuestro shop online en diseño, calidad y funcionalidad."
      contentClassName="w-full px-4 lg:px-15"
    >
      <div className="w-full overflow-hidden border-0 [border:0]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={slidesPerViewBase}
          centeredSlides={allFitOnDesktop}
          initialSlide={0}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          allowTouchMove={!expandedSku}
          navigation={showNav ? {
            nextEl: '#swiper-button-next-destacados',
            prevEl: '#swiper-button-prev-destacados',
          } : false}
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
          {productos.map((producto, index) => (
            <SwiperSlide key={`${producto.id}-${index}`} className="mb-5 !flex !items-start !border-0 [border:0]">
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

        {/* Navegación: solo si hay más de un producto */}
        {showNav && (
          <div className="flex justify-center items-center space-x-3 mt-4">
            <button
              ref={prevButtonRef}
              id="swiper-button-prev-destacados"
              onClick={handlePrevSlide}
              className="swiper-button-prev-custom w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-700 rotate-180 group-hover:text-gray-900" />
            </button>
            <button
              ref={nextButtonRef}
              id="swiper-button-next-destacados"
              onClick={handleNextSlide}
              className="swiper-button-next-custom w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-900" />
            </button>
          </div>
        )}

        {/* Call to Action */}
        <CTAButton onClick={handleGoToPage} />
      </div>
    </Section>
  );
};

// Componente auxiliar para CTA Button
const CTAButton = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    viewport={{ once: true }}
    className="text-center my-8"
  >
    <Button
      variant="black"
      size="sm"
      className="tracking-wide inline-flex items-center space-x-2 text-xs p-4"
      onClick={onClick}
    >
      VER SHOP COMPLETO
      <ArrowRight className="w-4 h-4" />
    </Button>
  </motion.div>
);

export default ProductosDestacados;
