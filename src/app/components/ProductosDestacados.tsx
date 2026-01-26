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
import Button from './ui/Button';
import { useProductosDestacadosLogic } from '../hooks/useProductosDestacadosLogic';
import ProductCardPublicado from './ProductCardPublicado';

const ProductosDestacados = () => {

  const {
    productos,
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

  if (isError) {
    return (
      <Section
        id="productos"
        className="bg-gray-50 pb-10"
        title="Productos destacados"
        subtitle="Lo mejor de nuestro shop online en diseño, calidad y funcionalidad."
        contentClassName="max-w-7xl mx-auto px-10"
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
        contentClassName="max-w-7xl mx-auto px-10"
      >
        <div className="text-center py-20 text-gray-500">
          No hay productos disponibles
        </div>
        <CTAButton onClick={handleGoToPage} />
      </Section>
    );
  }

  return (
    <Section
      id="productos"
      className="bg-gray-50 pb-10"
      title="Productos destacados"
      subtitle="Lo mejor de nuestro shop online en diseño, calidad y funcionalidad."
      contentClassName="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      <div className="w-full max-w-8xl mx-auto overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={4}
          centeredSlides={false}
          initialSlide={0}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          allowTouchMove={!expandedSku}
          navigation={{
            nextEl: '#swiper-button-next-destacados',
            prevEl: '#swiper-button-prev-destacados',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={
            expandedSku
              ? false
              : {
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          loop={productos.length > 4}
          loopAdditionalSlides={productos.length > 4 ? 2 : 0}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
              spaceBetween: 12,
              centeredSlides: false,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 12,
              centeredSlides: false,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
              centeredSlides: false,
            },
          }}
          className="pb-12"
        >
          {productos.map((producto, index) => (
            <SwiperSlide key={producto.codigoAgrupacion} className="mb-5 !flex">
              <div className="w-full h-full flex-shrink-0">
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

        {/* Navegación personalizada */}
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
    className="text-center mt-10"
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
