"use client";
import React from 'react';
import { motion } from 'framer-motion';

const PromoBanner = () => {
  const promoText = "10% OFF TRANSFERENCIA / HASTA 6 CUOTAS / ENVIOS A TODO EL PAIS";
  
  // Repetimos el texto varias veces para el efecto infinito
  const repeatedText = Array(10).fill(promoText).join(" • ");

  return (
    <div className="w-full bg-black text-white py-3 overflow-hidden relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        <span className="text-sm md:text-base font-semibold tracking-wider px-4">
          {repeatedText}
        </span>
        <span className="text-sm md:text-base font-semibold tracking-wider px-4">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

export default PromoBanner;

