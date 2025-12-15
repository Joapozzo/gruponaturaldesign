import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import Section from './Section';
import { useRouter } from 'next/navigation';
import FeaturesBanner from './FeaturesBanner';
import CallToAction from './CallToAction';

const Categorias = () => {
    const router = useRouter();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const categorias = [
        {
            id: 'shop-online',
            nombre: 'SHOP ONLINE',
            descripcion: 'Explora nuestra amplia colección de uniformes profesionales disponibles para compra inmediata.',
            imagen: '/imgs/shop-online.jpg',
            route: '/shoponline'
        },
        {
            id: 'uniformes-diseno',
            nombre: 'UNIFORMES PERSONALIZADOS',
            descripcion: 'Diseños personalizados y exclusivos creados especialmente para tu empresa.',
            imagen: '/imgs/personalizados.jpg',
            route: '/personalizados'
        }
    ];

    const handleCategoryClick = (route: string) => {
        router.push(route);
    };

    return (
        <>
            <Section id="categorias" className="w-full bg-white" title='Categorías' subtitle='Uniformes profesionales diseñados específicamente para cada sector, combinando funcionalidad, comodidad y diseño.'>

                {/* Categorías Grid - Rectangulares y más altas */}
                <div className="w-full px-4 lg:px-15 pb-10">
                    {/* Dos columnas grandes y rectangulares */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {categorias.map((categoria, index) => (
                            <motion.div
                                key={categoria.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="group relative overflow-hidden cursor-pointer"
                                onMouseEnter={() => setHoveredCategory(categoria.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                onClick={() => handleCategoryClick(categoria.route)}
                            >
                                {/* Imagen de fondo - Más alta/rectangular */}
                                <div className="relative h-[85vh] w-full overflow-hidden">
                                    <motion.img
                                        src={categoria.imagen}
                                        alt={categoria.nombre}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                        animate={{
                                            scale: hoveredCategory === categoria.id ? 1.05 : 1,
                                            filter: hoveredCategory === categoria.id ? 'brightness(0.7)' : 'brightness(0.9)'
                                        }}
                                    />

                                    {/* Overlay gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500"></div>

                                    {/* Overlay de color de marca en hover */}
                                    <motion.div
                                        className="absolute inset-0 bg-gray-500/0 group-hover:bg-gray-500/20 transition-all duration-500"
                                        animate={{
                                            opacity: hoveredCategory === categoria.id ? 1 : 0
                                        }}
                                    />
                                </div>

                                {/* Contenido de texto */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                                    <motion.div
                                        animate={{
                                            y: hoveredCategory === categoria.id ? -10 : 0,
                                            opacity: 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
                                            {categoria.nombre}
                                        </h3>
                                        <p className="md:text-lg text-sm  opacity-90 mb-6 max-w-md leading-relaxed">
                                            {categoria.descripcion}
                                        </p>

                                        {/* Botón de acción */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: hoveredCategory === categoria.id ? 1 : 0,
                                                x: hoveredCategory === categoria.id ? 0 : -20
                                            }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="flex items-center space-x-3"
                                        >
                                            <span className="text-lg font-semibold">EXPLORAR COLECCIÓN</span>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Ícono de expansión */}
                                <motion.div
                                    className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                    animate={{
                                        scale: hoveredCategory === categoria.id ? 1.1 : 1,
                                        backgroundColor: hoveredCategory === categoria.id ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.2)'
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Plus className="w-6 h-6 text-white" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <FeaturesBanner />
            </Section>
        </>
    );
};

export default Categorias;