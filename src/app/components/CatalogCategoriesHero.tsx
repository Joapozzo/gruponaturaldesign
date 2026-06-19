'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  const categorias = [
    {
      id: 'basic',
      nombre: 'BASIC',
      descripcion: 'Prendas esenciales y versátiles para uso diario y profesional.',
      imagen: '/imgs/basic-desktop.jpg',
      rubroId: basicRubroId,
    },
    {
      id: 'workwear',
      nombre: 'WORKWEAR',
      descripcion: 'Indumentaria especializada para trabajo y entornos industriales.',
      imagen: '/imgs/workwear-desktop.jpg',
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
        {categorias.map((categoria, index) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative overflow-hidden cursor-pointer min-h-[40vh] sm:min-h-[45vh] lg:min-h-[50vh]"
              onClick={() => handleCategoryClick(categoria.rubroId)}
            >
              <motion.img
                src={categoria.imagen}
                alt={categoria.nombre}
                className="w-full h-full min-h-[40vh] sm:min-h-[45vh] lg:min-h-[50vh] object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
              />
            </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CatalogCategoriesHero;
