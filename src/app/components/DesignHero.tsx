"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DesignHero = () => {
  return (
    <div className="w-full bg-white">
      {/* Barra vertical oscura a la izquierda - solo en desktop */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[10%] xl:w-[8%] z-10"></div>
      
      <div className="max-w-full mx-auto relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 w-full">
          {/* Texto - 60% (6 de 10 columnas) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center px-8 lg:pl-20 lg:pr-12 xl:pl-24 xl:pr-16 py-16 lg:py-24 relative z-20"
          >
            {/* Título principal */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl 2xl:text-7xl font-bold text-black mb-6 lg:mb-8 leading-[1.1] font-display tracking-tight"
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
              className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mt-4"
            >
              Una colección pensada para quienes valoran la comodidad y la funcionalidad sin renunciar al estilo.
            </motion.p>
          </motion.div>

          {/* Imagen - 40% (4 de 10 columnas) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 relative h-[60vh] sm:h-[70vh] lg:h-[80vh] xl:h-[85vh] w-full"
          >
            <Image
              src="/imgs/nosotros.jpg"
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

