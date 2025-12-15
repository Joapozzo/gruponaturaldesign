"use client";
import React from 'react';
import { motion } from 'framer-motion';

const PromoBanner = () => {
  const promoItems = [
    "3 CUOTAS SIN INTERÉS",
    "15% OFF CON TRANSFERENCIA",
    "ENVÍO GRATIS A SUCURSAL EN COMPRAS SUPERIORES A $200.000"
  ];
  
  // Repetimos los items varias veces para el efecto infinito, con más separación
  const repeatedText = Array(4).fill(promoItems.join("        •        ")).join("        •        ");

  return (
    <div className="w-full bg-black text-white py-3 overflow-hidden sticky top-0 z-50">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -3000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        <span className="text-xs md:text-sm font-semibold tracking-wide px-8">
          {repeatedText}
        </span>
        <span className="text-xs md:text-sm font-semibold tracking-wide px-8">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

export default PromoBanner;