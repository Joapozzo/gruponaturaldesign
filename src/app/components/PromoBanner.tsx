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
    <div className="w-full bg-black text-white py-1 overflow-hidden fixed top-0 left-0 right-0 z-[60] h-[18px] flex items-center">
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
        <span className="text-[8px] md:text-[9px] font-semibold tracking-tight px-2">
          {repeatedText}
        </span>
        <span className="text-[8px] md:text-[9px] font-semibold tracking-tight px-2">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

export default PromoBanner;