'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Banner CTA reutilizable: fondo 100% ancho (negro), contenido con los mismos
 * márgenes/padding que Section (px-4 lg:px-15). Solo el fondo es full-width.
 */
interface CtaBannerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode; // botón(es) u otro contenido
  className?: string;
}

const CtaBanner: React.FC<CtaBannerProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full py-16 lg:py-20 text-center ${className}`}
      style={{ backgroundColor: 'var(--black)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full px-4 lg:px-15 mx-auto"
      >
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
          {title}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default CtaBanner;
