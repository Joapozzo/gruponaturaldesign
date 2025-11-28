"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { GroupedProduct } from '@/app/types/producto';
import ProductCardGrouped from '@/app/components/ProductCardGrouped';

interface RelatedProductsProps {
    relatedProducts: GroupedProduct[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
    const [expandedSku, setExpandedSku] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const currentSlideIndexRef = useRef<number>(0);

    if (relatedProducts.length === 0) return null;

    // Pausar/reanudar autoplay cuando un producto está expandido
    useEffect(() => {
        if (swiperRef.current) {
            if (expandedSku) {
                // Guardar el índice del slide actual
                currentSlideIndexRef.current = swiperRef.current.activeIndex;
                
                // Detener el autoplay de manera agresiva
                if (swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.stop();
                    // Limpiar el timer del autoplay
                    if (swiperRef.current.autoplay.running) {
                        swiperRef.current.autoplay.stop();
                    }
                }
                
                // Bloquear completamente el movimiento
                swiperRef.current.allowTouchMove = false;
                swiperRef.current.allowSlideNext = false;
                swiperRef.current.allowSlidePrev = false;
                
                // Forzar que se mantenga en el slide actual
                swiperRef.current.slideTo(currentSlideIndexRef.current, 0);
            } else {
                // Si no hay productos expandidos, reanudar el autoplay
                if (swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.start();
                }
                // Permitir el movimiento del slider
                swiperRef.current.allowTouchMove = true;
                swiperRef.current.allowSlideNext = true;
                swiperRef.current.allowSlidePrev = true;
            }
        }
    }, [expandedSku]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 lg:mt-16"
        >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
                Productos relacionados
            </h2>
            
            {/* Slider de productos */}
            <div className="">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        currentSlideIndexRef.current = swiper.activeIndex;
                    }}
                    onSlideChange={(swiper) => {
                        if (!expandedSku) {
                            currentSlideIndexRef.current = swiper.activeIndex;
                        }
                    }}
                    allowTouchMove={!expandedSku}
                    navigation={{
                        nextEl: '.swiper-button-next-related',
                        prevEl: '.swiper-button-prev-related',
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
                    loop={relatedProducts.length >= 3}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.5,
                            spaceBetween: 12,
                        },
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 12,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 28,
                        },
                    }}
                    className="pb-12"
                >
                    {relatedProducts.map((group, index) => (
                        <SwiperSlide key={group.skuBase} className="mb-5">
                            <ProductCardGrouped 
                                group={group} 
                                index={index}
                                expandedSku={expandedSku}
                                onExpandChange={setExpandedSku}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navegación personalizada */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <button className="swiper-button-prev-related w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group">
                        <ArrowRight className="w-5 h-5 text-gray-700 rotate-180 group-hover:text-gray-900" />
                    </button>
                    <button className="swiper-button-next-related w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group">
                        <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

