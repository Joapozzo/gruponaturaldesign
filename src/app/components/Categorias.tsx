import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import Section from './Section';
import categorias from '../data/categorias';
import Button from './ui/Button';
import { useWhatsApp } from './hooks/useWhatsApp';

const Categorias = () => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const { openWhatsApp } = useWhatsApp({ defaultMessage: "¡Hola! Me interesa solicitar un diseño personalizado de uniformes de NTDS. ¿Te gustaría hablar conmigo?" });

    return (
        <Section id="categorias" className="w-full bg-white" title='Categorías' subtitle='Uniformes profesionales diseñados específicamente para cada sector, combinando funcionalidad, comodidad y diseño.'>

            {/* Categorías Grid - Masonry Style */}
            <div className="w-full">
                {/* Primera fila - 2 columnas grandes */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {categorias.slice(0, 2).map((categoria, index) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        // onClick={() => setSelectedCategory(categoria)}
                        >
                            {/* Imagen de fondo */}
                            <div className="relative h-[70vh] w-full overflow-hidden">
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
                                    <p className="text-lg lg:text-xl opacity-90 mb-6 max-w-md leading-relaxed">
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

                {/* Segunda fila - 3 columnas */}
                <div className="w-full">
                    {categorias.slice(2, 5).map((categoria, index) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        // onClick={() => setSelectedCategory(categoria)}
                        >
                            {/* Imagen de fondo */}
                            <div className="relative h-[60vh] w-full overflow-hidden">
                                <motion.img
                                    src={categoria.imagen}
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    animate={{
                                        scale: hoveredCategory === categoria.id ? 1.1 : 1,
                                        filter: hoveredCategory === categoria.id ? 'brightness(0.6)' : 'brightness(0.8)'
                                    }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all duration-500"></div>

                                {/* Color overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-black-500/0 group-hover:bg-black-500/15 transition-all duration-500"
                                    animate={{
                                        opacity: hoveredCategory === categoria.id ? 1 : 0
                                    }}
                                />
                            </div>

                            {/* Contenido */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                                <motion.div
                                    animate={{
                                        y: hoveredCategory === categoria.id ? -5 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 tracking-wide font-display">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="text-sm lg:text-base opacity-90 mb-4 leading-relaxed">
                                        {categoria.descripcion}
                                    </p>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{
                                            opacity: hoveredCategory === categoria.id ? 1 : 0,
                                            scale: hoveredCategory === categoria.id ? 1 : 0.9
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center space-x-2"
                                    >
                                        <span className="text-sm font-semibold">VER MÁS</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Pequeño indicador */}
                            <motion.div
                                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                animate={{
                                    scale: hoveredCategory === categoria.id ? 1.2 : 1,
                                    backgroundColor: hoveredCategory === categoria.id ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-800 text-white py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-8"
                >
                    <h3 className="text-3xl lg:text-4xl font-bold mb-6 font-display">
                        ¿NO ENCONTRÁS LO QUE BUSCÁS?
                    </h3>
                    <p className="text-lg mb-8 opacity-90">
                        Diseñamos uniformes personalizados para tu empresa.
                        Más de 25 años creando soluciones únicas.
                    </p>
                    <Button
                        variant="darkGray"
                        size="lg"
                        className="tracking-wide inline-flex items-center space-x-3"
                        onClick={() => openWhatsApp()}
                    >
                        <span>SOLICITAR DISEÑO PERSONALIZADO</span>
                        <ArrowRight className="w-6 h-6" />
                    </Button>
                </motion.div>
            </div>
        </Section>
    );
};

export default Categorias;