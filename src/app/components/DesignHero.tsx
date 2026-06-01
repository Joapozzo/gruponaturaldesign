"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const DESIGN_IMAGES = [
  { src: '/imgs/sections/design-1.jpg', alt: 'Uniformes profesionales - diseño 1' },
  { src: '/imgs/sections/design-2.jpg', alt: 'Uniformes profesionales - diseño 2' },
] as const;

const DesignHero = () => {
  return (
    <div className="w-full bg-[#DFDCE3] overflow-x-hidden min-h-0 lg:h-screen">
      <div className="w-full mx-auto relative overflow-x-hidden lg:h-full lg:min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-2 w-full min-h-0 lg:h-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center px-6 lg:pl-12 lg:pr-8 xl:pl-16 xl:pr-10 py-12 lg:py-16 relative z-20 bg-[#DFDCE3]"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-black mb-4 lg:mb-6 leading-[1.1] tracking-tight"
            >
              DISEÑADA PARA<br />
              TRABAJAR, CREADA<br />
              PARA DESTACAR.
            </motion.h2>

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

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-row w-full h-[50vh] sm:h-[60vh] lg:h-full min-h-[280px]"
          >
            {DESIGN_IMAGES.map((img, i) => (
              <div
                key={img.src}
                className="relative flex-1 min-w-0 h-full"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  priority={i === 0}
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DesignHero;
