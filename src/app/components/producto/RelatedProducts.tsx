"use client";
import React, { useMemo } from 'react';
import { GroupedProduct } from '@/app/types/producto';
import ProductCardPublicado from '@/app/components/ProductCardPublicado';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { useRelatedProductsSwiper } from './hooks/useRelatedProductsSwiper';
import { groupedProductToProductoPublicado } from '@/app/utils/groupedProductToProductoPublicado';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedProductsProps {
    relatedProducts: GroupedProduct[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
    // Convertir GroupedProduct[] a ProductoPublicado[]
    const productosPublicados = useMemo(
        () => relatedProducts.map(groupedProductToProductoPublicado),
        [relatedProducts]
    );

    // Hook para manejar la lógica del Swiper
    const {
        expandedSku,
        setExpandedSku,
        swiperRef,
        prevButtonRef,
        nextButtonRef,
    } = useRelatedProductsSwiper();

    if (productosPublicados.length === 0) return null;

    return (
        <div className="mt-4 sm:mt-6">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .swiper-related-products .swiper-pagination {
                        position: relative !important;
                        bottom: auto !important;
                        margin-top: 20px !important;
                        margin-bottom: 8px !important;
                    }
                `
            }} />
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                Productos relacionados
            </h2>
            
            {/* Slider de productos */}
            <div className="swiper-related-products border-0 [border:0]">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={12}
                    slidesPerView={1}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    allowTouchMove={!expandedSku}
                    navigation={{
                        nextEl: '#swiper-button-next-related',
                        prevEl: '#swiper-button-prev-related',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={expandedSku ? false : {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={productosPublicados.length > 4}
                    loopAdditionalSlides={productosPublicados.length > 4 ? 3 : 0}
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                            spaceBetween: 8,
                        },
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2.5,
                            spaceBetween: 12,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 12,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 12,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 14,
                        },
                    }}
                >
                    {productosPublicados.map((producto, index) => (
                        <SwiperSlide key={producto.codigoAgrupacion} className="!border-0 [border:0]">
                            <ProductCardPublicado 
                                producto={producto} 
                                index={index}
                                expandedSku={expandedSku}
                                onExpandChange={setExpandedSku}
                                compact={true}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Navegación personalizada - debajo del Swiper */}
                <div className="flex justify-center items-center space-x-3 mt-4">
                    <button 
                        ref={prevButtonRef}
                        id="swiper-button-prev-related"
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="swiper-button-prev-related w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Anterior"
                    >
                        <ArrowRight className="w-3.5 h-3.5 text-gray-700 rotate-180 group-hover:text-gray-900" />
                    </button>
                    <button 
                        ref={nextButtonRef}
                        id="swiper-button-next-related"
                        onClick={() => swiperRef.current?.slideNext()}
                        className="swiper-button-next-related w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguiente"
                    >
                        <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>
            </div>
        </div>
    );
}

