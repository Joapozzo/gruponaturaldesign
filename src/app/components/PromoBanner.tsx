"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';
import { buildPromoCuotasLabel } from '@/app/utils/precioDisplay';

const PromoBanner = () => {
  const { data: precioConfig } = usePrecioConfigPublic();
  const cuotas = precioConfig?.cuotasFinanciado ?? 3;
  const descuentoPct = Math.round((precioConfig?.descuentoTransferencia ?? 0.15) * 100);

  const promoItems = [
    buildPromoCuotasLabel(cuotas, true),
    `${descuentoPct}% OFF CON TRANSFERENCIA`,
    "ENVÍO GRATIS A SUCURSAL EN COMPRAS SUPERIORES A $200.000"
  ];
  
  const repeatedText = Array(4).fill(promoItems.join("        •        ")).join("        •        ");

  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden fixed top-0 left-0 right-0 z-[60] h-[32px] flex items-center shrink-0">
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
        <span className="text-[11px] md:text-[12px] font-semibold tracking-tight px-2">
          {repeatedText}
        </span>
        <span className="text-[11px] md:text-[12px] font-semibold tracking-tight px-2">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

export default PromoBanner;
