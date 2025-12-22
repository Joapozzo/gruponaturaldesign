"use client";
import React, { useState, useRef, useEffect } from 'react';
import { GroupedProduct } from '@/app/types/producto';
import ProductCardGrouped from '@/app/components/ProductCardGrouped';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedProductsProps {
    relatedProducts: GroupedProduct[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
    const [expandedSku, setExpandedSku] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    if (relatedProducts.length === 0) return null;

    // Mostrar todos los productos relacionados
    const productsToShow = relatedProducts;


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
            <div className="swiper-related-products">
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
                    loop={productsToShow.length > 4}
                    loopAdditionalSlides={productsToShow.length > 4 ? 3 : 0}
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
                    {productsToShow.map((group, index) => (
                        <SwiperSlide key={group.skuBase}>
                            <ProductCardGrouped 
                                group={group} 
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

