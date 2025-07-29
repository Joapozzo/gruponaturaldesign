import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Product from './Product';
import Section from './Section';
import { productos } from '../data/productos'; 
import Button from './ui/Button';

const ProductosDestacados = () => {
    return (
        <Section 
            id="productos" 
            className="bg-gray-50" 
            title='Productos destacados' 
            subtitle='Lo mejor de nuestro catálogo en diseño, calidad y funcionalidad.'
            contentClassName='max-w-7xl mx-auto'
        >
            {/* Slider de productos */}
            <div className="px-4 sm:px-6 lg:px-8">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    pagination={{ 
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 32,
                        },
                    }}
                    className="pb-12"
                >
                    {productos.map((producto, index) => (
                        <SwiperSlide key={producto.id}>
                            <Product product={producto} index={index} />
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
                        size="lg"
                        className="tracking-wide inline-flex items-center space-x-3"
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