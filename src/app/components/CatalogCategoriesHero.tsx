"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

interface CatalogCategoriesHeroProps {
    onCategorySelect: (category: string) => void;
    selectedCategory?: string;
}

const CatalogCategoriesHero = ({ onCategorySelect, selectedCategory = 'TODOS' }: CatalogCategoriesHeroProps) => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const categorias = [
        {
            id: 'basic',
            nombre: 'BASIC',
            descripcion: 'Prendas esenciales y versátiles para uso diario y profesional.',
            imagen: '/imgs/cat-1.jpg',
            filterValue: 'BASIC' as const
        },
        {
            id: 'workwear',
            nombre: 'WORKWEAR',
            descripcion: 'Indumentaria especializada para trabajo y entornos industriales.',
            imagen: '/imgs/cat-2.jpg',
            filterValue: 'WORKWEAR' as const
        }
    ];

    const handleCategoryClick = (filterValue: 'BASIC' | 'WORKWEAR') => {
        // Si ya está seleccionada, deseleccionar (mostrar todos)
        if (selectedCategory === filterValue) {
            onCategorySelect('TODOS');
        } else {
            onCategorySelect(filterValue);
        }
        
        // Scroll suave al contenido del catálogo después de un pequeño delay
        setTimeout(() => {
            const catalogContent = document.getElementById('catalog-content');
            if (catalogContent) {
                catalogContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <section className="relative w-full overflow-hidden">
            {/* Dos columnas sin separación - 100% ancho */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {categorias.map((categoria, index) => {
                    const isSelected = selectedCategory === categoria.filterValue;
                    
                    return (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden cursor-pointer"
                            onMouseEnter={() => setHoveredCategory(categoria.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => handleCategoryClick(categoria.filterValue)}
                        >
                            {/* Imagen de fondo - Altura completa */}
                            <div className="relative h-[85vh] w-full overflow-hidden">
                                <motion.img
                                    src={categoria.imagen}
                                    alt={categoria.nombre}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    animate={{
                                        scale: hoveredCategory === categoria.id || isSelected ? 1.05 : 1,
                                        filter: hoveredCategory === categoria.id || isSelected ? 'brightness(0.7)' : 'brightness(0.9)'
                                    }}
                                />

                                {/* Overlay gradiente */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 ${
                                    hoveredCategory === categoria.id || isSelected ? 'from-black/90' : ''
                                }`}></div>

                                {/* Overlay de color de marca en hover o selección */}
                                <motion.div
                                    className={`absolute inset-0 transition-all duration-500 ${
                                        isSelected ? 'bg-[#Ed3237]/30' : 'bg-gray-500/0'
                                    } ${
                                        hoveredCategory === categoria.id ? 'bg-gray-500/20' : ''
                                    }`}
                                    animate={{
                                        opacity: hoveredCategory === categoria.id || isSelected ? 1 : 0
                                    }}
                                />
                            </div>

                            {/* Contenido de texto */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                                <motion.div
                                    animate={{
                                        y: hoveredCategory === categoria.id || isSelected ? -10 : 0,
                                        opacity: 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
                                        {categoria.nombre}
                                    </h3>
                                    <p className="md:text-lg text-sm opacity-90 mb-6 max-w-md leading-relaxed">
                                        {categoria.descripcion}
                                    </p>

                                    {/* Botón de acción */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{
                                            opacity: hoveredCategory === categoria.id || isSelected ? 1 : 0,
                                            x: hoveredCategory === categoria.id || isSelected ? 0 : -20
                                        }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <span className="text-lg font-semibold">
                                            {isSelected ? 'VER TODOS' : 'EXPLORAR COLECCIÓN'}
                                        </span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Ícono de expansión */}
                            <motion.div
                                className={`absolute top-6 right-6 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isSelected ? 'bg-[#Ed3237]/90' : 'bg-white/20'
                                }`}
                                animate={{
                                    scale: hoveredCategory === categoria.id || isSelected ? 1.1 : 1,
                                }}
                            >
                                <Plus className="w-6 h-6 text-white" />
                            </motion.div>

                            {/* Indicador de selección */}
                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute top-6 left-6 bg-[#Ed3237] text-white px-4 py-2 rounded-lg font-semibold text-sm"
                                >
                                    SELECCIONADO
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default CatalogCategoriesHero;

