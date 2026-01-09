"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DesignHero = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* Barra vertical oscura a la izquierda - solo en desktop */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[10%] xl:w-[8%] z-10"></div>
      
      <div className="max-w-full mx-auto relative w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 w-full">
          {/* Texto - 60% (6 de 10 columnas) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center px-6 lg:pl-12 lg:pr-8 xl:pl-16 xl:pr-10 py-12 lg:py-16 relative z-20"
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

          {/* Imagen - 40% (4 de 10 columnas) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 relative h-[50vh] sm:h-[60vh] lg:h-[70vh] xl:h-[75vh] w-full"
          >
            <Image
              src="/imgs/nosotros.png"
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