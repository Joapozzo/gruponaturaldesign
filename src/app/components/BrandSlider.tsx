import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Brand {
    id: number;
    name: string;
    image: string;
}

const BrandsSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const brands = [
        {
            id: 1,
            name: "Coca Cola",
            image: "/imgs/products/coca.jpg",
        },
        {
            id: 2,
            name: "Stellantis",
            image: "/imgs/products/stellantis.jpg",
        },
        {
            id: 3,
            name: "Tarjeta Naranja",
            image: "/imgs/products/naranja.jpg",
        },
        {
            id: 4,
            name: "Reina Fabiola",
            image: "/imgs/products/fabiola.jpg",
        },
        {
            id: 5,
            name: "Horse",
            image: "/imgs/products/horse.jpg",
        },
        {
            id: 6,
            name: "CNH",
            image: "/imgs/products/cnh.jpg",
        }
    ];

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const getSlidesConfig = () => {
        if (isMobile) {
            // En móvil: 1 marca por slide
            return {
                slides: brands.map(brand => [brand]),
                totalSlides: brands.length, // 6 slides
                slideWidth: 100 / brands.length // 16.67% por slide
            };
        } else if (isTablet) {
            // En tablet: 2 marcas por slide
            return {
                slides: [
                    brands.slice(0, 2),
                    brands.slice(2, 4),
                    brands.slice(4, 6)
                ],
                totalSlides: 3,
                slideWidth: 100 / 3 // 33.33% por slide
            };
        } else {
            // En desktop: 3 marcas por slide
            return {
                slides: [
                    brands.slice(0, 3),
                    brands.slice(3, 6)
                ],
                totalSlides: 2,
                slideWidth: 100 / 2 // 50% por slide
            };
        }
    };

    const { slides, totalSlides, slideWidth } = getSlidesConfig();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }, 4000);

        return () => clearInterval(timer);
    }, [totalSlides]);

    const renderBrandCard = (brand: Brand, index: number) => (
        <motion.div
            key={brand.id}
            className="relative group cursor-pointer flex-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
        >
            {/* Imagen del uniforme - Más grande en móvil */}
            <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 
                          mx-2 sm:mx-4">
                <Image
                    src={brand.image}
                    alt={`Uniforme para ${brand.name}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    width={400}
                    height={400}
                />
                {/* Overlay oscuro sutil */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Logo de la marca - Ajustado para móvil */}
                <motion.div
                    className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">
                        {brand.name}
                    </span>
                </motion.div>

                {/* Badge de "Proyecto realizado" - Ajustado para móvil */}
                <motion.div
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-gray-900 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-500"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                >
                    PROYECTO REALIZADO
                </motion.div>
            </div>

            {/* Nombre de la marca debajo */}
            <motion.div
                className="text-center mt-3 sm:mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
            >
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {brand.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                    Uniformes corporativos
                </p>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="w-full mt-20 sm:mt-30 overflow-hidden px-4 sm:px-0">
            {/* Slider Container */}
            <div className="relative w-full overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{
                        transform: `translateX(-${currentSlide * slideWidth}%)`
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: `${totalSlides * 100}%`
                    }}
                >
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            className="flex-shrink-0 flex gap-2 sm:gap-4 md:gap-8 px-2 sm:px-4 md:px-8"
                            style={{ width: `${100 / totalSlides}%` }}
                        >
                            {slide.map((brand, index) => renderBrandCard(brand, index))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Indicadores de posición */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <motion.button
                        key={slideIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${slideIndex === currentSlide
                            ? 'bg-gray-900 w-6 sm:w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        onClick={() => setCurrentSlide(slideIndex)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    />
                ))}
            </div>

            {/* Navegación con flechas para pantallas pequeñas */}
            <div className="flex justify-center mt-6 space-x-4 md:hidden">
                <motion.button
                    className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
                    onClick={() => setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>

                <motion.button
                    className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
                    onClick={() => setCurrentSlide((currentSlide + 1) % totalSlides)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default BrandsSlider;