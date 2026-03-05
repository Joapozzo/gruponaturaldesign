'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';

interface CatalogCategoriesHeroProps {
  onCategorySelect: (rubroId: number | null) => void;
  selectedRubroId?: number | null;
  rubros?: Array<{ id: number; nombre: string }>;
  workwearRubroId: number | null;
  basicRubroId: number | null;
}

const CatalogCategoriesHero = ({
  onCategorySelect,
  selectedRubroId = null,
  workwearRubroId,
  basicRubroId,
}: CatalogCategoriesHeroProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categorias = [
    {
      id: 'basic',
      nombre: 'BASIC',
      descripcion: 'Prendas esenciales y versátiles para uso diario y profesional.',
      imagen: '/imgs/basic.jpg',
      rubroId: basicRubroId,
    },
    {
      id: 'workwear',
      nombre: 'WORKWEAR',
      descripcion: 'Indumentaria especializada para trabajo y entornos industriales.',
      imagen: '/imgs/workwear.jpg',
      rubroId: workwearRubroId,
    },
  ] as Array<{ id: string; nombre: string; descripcion: string; imagen: string; rubroId: number | null }>;

  const handleCategoryClick = (rubroId: number | null) => {
    if (rubroId === null) return;
    if (selectedRubroId === rubroId) {
      onCategorySelect(null);
    } else {
      onCategorySelect(rubroId);
    }
    setTimeout(() => {
      const catalogContent = document.getElementById('catalog-content');
      if (catalogContent) catalogContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {categorias.map((categoria, index) => {
          const isSelected = categoria.rubroId !== null && selectedRubroId === categoria.rubroId;

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
              onClick={() => handleCategoryClick(categoria.rubroId)}
            >
              <div className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] w-full overflow-hidden">
                <motion.img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="w-full h-full object-cover transition-all duration-700 object-top"
                  animate={{
                    scale: hoveredCategory === categoria.id || isSelected ? 1.05 : 1,
                    filter: hoveredCategory === categoria.id || isSelected ? 'brightness(0.7)' : 'brightness(0.9)',
                  }}
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 ${
                    hoveredCategory === categoria.id || isSelected ? 'from-black/90' : ''
                  }`}
                />

                {/* Solo pintar de rojo cuando está seleccionado (sin badge) */}
                <motion.div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isSelected ? 'bg-[#Ed3237]/30' : 'bg-gray-500/0'
                  } ${hoveredCategory === categoria.id ? 'bg-gray-500/20' : ''}`}
                  animate={{ opacity: hoveredCategory === categoria.id || isSelected ? 1 : 0 }}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 text-white">
                <motion.div
                  animate={{ y: hoveredCategory === categoria.id || isSelected ? -10 : 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 font-display">
                    {categoria.nombre}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-base opacity-90 mb-3 sm:mb-6 max-w-md leading-relaxed">
                    {categoria.descripcion}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: hoveredCategory === categoria.id || isSelected ? 1 : 0,
                      x: hoveredCategory === categoria.id || isSelected ? 0 : -20,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <span className="text-xs sm:text-sm lg:text-base font-semibold">
                      {isSelected ? 'VER TODOS' : 'EXPLORAR COLECCIÓN'}
                    </span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                className={`absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected ? 'bg-[#Ed3237]/90' : 'bg-white/20'
                }`}
                animate={{ scale: hoveredCategory === categoria.id || isSelected ? 1.1 : 1 }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CatalogCategoriesHero;
