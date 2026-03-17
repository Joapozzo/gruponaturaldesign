"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DesignHero = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden h-screen">
      <div className="w-full h-full mx-auto relative overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 w-full h-full">
          {/* Texto - 70% (7 de 10 columnas), mismo gap que Categorias */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center px-6 lg:pl-12 lg:pr-8 xl:pl-16 xl:pr-10 py-12 lg:py-16 relative z-20 bg-[#D4D4D4]"
          >
            {/* Título principal */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-black mb-4 lg:mb-6 leading-[1.1] font-display tracking-tight"
            >
              DISEÑADA PARA<br />
              TRABAJAR, CREADA<br />
              PARA DESTACAR.
            </motion.h2>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl mt-3"
            >
              Una colección pensada para quienes valoran la comodidad y la funcionalidad sin renunciar al estilo.
            </motion.p>
          </motion.div>

          {/* Imagen - 30% (3 de 10 columnas) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3 relative h-[50vh] sm:h-[60vh] lg:h-full w-full min-h-[280px]"
          >
            <Image
              src="/imgs/design_hero.jpg"
              alt="Modelos vistiendo uniformes profesionales"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DesignHero;