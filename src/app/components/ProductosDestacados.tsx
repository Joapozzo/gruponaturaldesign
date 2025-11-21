'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Section from './Section';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';
import { useGroupedProducts } from '../hooks/useGroupedProducts';
import ProductCardGrouped from './ProductCardGrouped';

const ProductosDestacados = () => {
    const router = useRouter();
    const [expandedSku, setExpandedSku] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const currentSlideIndexRef = useRef<number>(0);
    // TEMPORALMENTE SIN FILTROS para ver todos los productos
    const { groupedProducts, isLoading } = useGroupedProducts({
        // activo: true,
        // itemDeVenta: true,
    });
    // console.log('ProductosDestacados', groupedProducts);

    // Tomar solo los primeros 8 productos (sin mutar el array original)
    const productDestacados = groupedProducts.slice(0, 8);

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

    const goToPage = () => {
        router.push(`/catalogo`);
    };

    // Mostrar loading o estado vacío
    if (isLoading) {
        return (
            <Section
                id="productos"
                className="bg-gray-50"
                title='Productos destacados'
                subtitle='Lo mejor de nuestro catálogo en diseño, calidad y funcionalidad.'
                contentClassName='max-w-7xl mx-auto px-10'
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-[550px] w-full"></div>
                        </div>
                    ))}
                </div>
            </Section>
        );
    }

    if (productDestacados.length === 0) {
        return (
            <Section
                id="productos"
                className="bg-gray-50"
                title='Productos destacados'
                subtitle='Lo mejor de nuestro catálogo en diseño, calidad y funcionalidad.'
                contentClassName='max-w-7xl mx-auto px-10'
            >
                <div className="text-center py-20 text-gray-500">
                    No hay productos disponibles
                </div>
            </Section>
        );
    }

    return (
        <Section
            id="productos"
            className="bg-gray-50"
            title='Productos destacados'
            subtitle='Lo mejor de nuestro catálogo en diseño, calidad y funcionalidad.'
            contentClassName='max-w-7xl mx-auto px-10'
        >
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
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
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
                    loop={productDestacados.length >= 3}
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
                    {productDestacados.map((group, index) => (
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
                    <button className="swiper-button-prev-custom w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group">
                        <ArrowRight className="w-5 h-5 text-gray-700 rotate-180 group-hover:text-gray-900" />
                    </button>
                    <button className="swiper-button-next-custom w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group">
                        <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <Button
                        variant="black"
                        size="md"
                        className="tracking-wide inline-flex items-center space-x-3"
                        onClick={goToPage}
                    >
                        <span>VER CATÁLOGO COMPLETO</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </Section>
    );
};

export default ProductosDestacados;