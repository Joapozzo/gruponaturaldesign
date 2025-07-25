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
            image: "/imgs/1.png",
        },
        {
            id: 2,
            name: "Stellantis",
            image: "/imgs/2.png",
        },
        {
            id: 3,
            name: "Tarjeta Naranja",
            image: "/imgs/3.png",
        },
        {
            id: 4,
            name: "Reina Fabiola",
            image: "/imgs/4.png",
        },
        {
            id: 5,
            name: "Arcor",
            image: "/imgs/5.png",
        },
        {
            id: 6,
            name: "CNH",
            image: "/imgs/6.png",
        }
    ];

    // Dividir en 2 grupos de 3
    const slide1 = brands.slice(0, 3); // [1, 2, 3]
    const slide2 = brands.slice(3, 6); // [4, 5, 6]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 2);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    const renderBrandCard = (brand: Brand, index: number) => (
        <motion.div
            key={brand.id}
            className="relative group cursor-pointer flex-1"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
        >
            {/* Imagen del uniforme */}
            <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 mx-4">
                <Image
                    src={brand.image}
                    alt={`Uniforme para ${brand.name}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    width={400}
                    height={400}
                />

                {/* Overlay oscuro sutil */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Logo de la marca */}
                <motion.div
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm font-bold text-gray-900 tracking-wide">
                        {brand.name}
                    </span>
                </motion.div>

                {/* Badge de "Proyecto realizado" */}
                <motion.div
                    className="absolute bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-500"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                >
                    PROYECTO REALIZADO
                </motion.div>
            </div>

            {/* Nombre de la marca debajo */}
            <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
            >
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {brand.name}
                </h4>
                <p className="text-sm text-gray-600">
                    Uniformes corporativos
                </p>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="w-full mt-30 overflow-hidden">
            {/* Slider Container */}
            <div className="relative w-full">
                <motion.div
                    className="flex"
                    animate={{
                        transform: `translateX(-${currentSlide * 50}%)`
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeInOut"
                    }}
                    style={{ width: "200%" }}
                >
                    {/* Slide 1: Primeras 3 marcas */}
                    <div className="w-1/2 flex gap-8 px-8 flex-shrink-0">
                        {slide1.map((brand, index) => renderBrandCard(brand, index))}
                    </div>

                    {/* Slide 2: Últimas 3 marcas */}
                    <div className="w-1/2 flex gap-8 px-8 flex-shrink-0">
                        {slide2.map((brand, index) => renderBrandCard(brand, index))}
                    </div>
                </motion.div>
            </div>

            {/* Indicadores de posición */}
            <div className="flex justify-center mt-8 space-x-2">
                {[0, 1].map((slideIndex) => (
                    <motion.button
                        key={slideIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${slideIndex === currentSlide
                            ? 'bg-gray-900 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        onClick={() => setCurrentSlide(slideIndex)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default BrandsSlider;