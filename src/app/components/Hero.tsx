'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCcw, CreditCard, Store, Truck } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: RotateCcw,
    title: 'Cambios y devoluciones',
    description: 'Tenes 30 días para cambiar tu pedido',
  },
  {
    icon: CreditCard,
    title: 'Medio de pago',
    description: '3 cuotas sin interés • 15% off con transferencia',
  },
  {
    icon: Store,
    title: 'Pick up store',
    description: 'Coordiná para retirar tu pedido',
  },
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'Envío gratis a sucursal en compras superiores a $200.000',
  },
];

const HERO_SLIDES = ['/imgs/hero-1.png', '/imgs/hero-2.png', '/imgs/hero-3.png'];
const AUTO_PLAY_MS = 5000;

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full flex flex-col overflow-hidden"
    >
      {/* Carrusel 2:1 (5669×2835) — contenedor con misma proporción para ver imágenes completas */}
      <div className="relative w-full aspect-[2/1]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={HERO_SLIDES[index]}
              alt={`Hero ${index + 1}`}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Texto y CTA desactivados: las imágenes ya incluyen texto */}
        {/* <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-12">
          <motion.h1 ...>Vestí a tu equipo con Grupo Natural Design</motion.h1>
          <Button onClick={() => scrollToSection('categorias')}>Comenzá ya</Button>
        </div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="text-white animate-bounce" size={24} />
        </motion.div>
      </div>

      {/* Features: franja fija abajo — mismo contenido que FeaturesBanner */}
      <div className="w-full bg-gray-100 py-4 lg:py-5 shrink-0">
        <div className="w-full px-4 lg:px-15">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-stretch gap-4 sm:gap-6 w-full">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-2">
                    <IconComponent
                      className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xs lg:text-sm font-semibold text-gray-800 mb-1 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] lg:text-xs text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
