'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, RotateCcw, CreditCard, Store, Truck } from 'lucide-react';
import Image from 'next/image';
import Button from './ui/Button';
import { useNavigation } from '../hooks/useNavigation';

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

const Hero = () => {
  const [heroImage, setHeroImage] = useState('/imgs/hero.jpg');
  const { scrollToSection } = useNavigation();

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth < 640) {
        setHeroImage('/imgs/hero.jpg');
      } else {
        setHeroImage('/imgs/hero.jpg');
      }
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    return () => window.removeEventListener('resize', updateImage);
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full h-[calc(100vh-var(--navbar-total))] flex flex-col overflow-hidden"
    >
      {/* Hero: imagen + título + CTA — ocupa el espacio restante */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={heroImage}
            alt="Hero NTDS"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-12">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-3 2xl:text-6xl"
          >
            <span className="font-bold">Vestí</span> a tu equipo con
            <br />
            Grupo Natural Design
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-4"
          >
            <Button
              variant="lightWhiteOutline"
              onClick={() => scrollToSection('categorias')}
              size="lg"
              className="font-light tracking-wide mx-auto"
            >
              Comenzá ya
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
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
