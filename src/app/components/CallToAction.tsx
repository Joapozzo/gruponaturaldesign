"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { useWhatsApp } from './hooks/useWhatsApp';

const CallToAction = () => {
  const { openWhatsApp } = useWhatsApp({ 
    defaultMessage: "¡Hola! Me interesa solicitar un diseño personalizado de uniformes de NTDS. ¿Te gustaría hablar conmigo?" 
  });

  return (
    <div className="relative bg-gray-800 text-white py-20 text-center w-full">
      {/* Barra gris vertical a la izquierda - continuidad con DesignHero */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[10%] xl:w-[8%] bg-gray-800 z-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-8 relative z-20"
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-6 font-display">
          ¿NO ENCONTRÁS LO QUE BUSCÁS?
        </h3>
        <p className="text-lg mb-8 opacity-90">
          Diseñamos uniformes personalizados para tu empresa.
          Más de 25 años creando soluciones únicas.
        </p>
        <Button
          variant="darkGray"
          size="lg"
          className="tracking-wide inline-flex items-center space-x-3"
          onClick={() => openWhatsApp()}
        >
          <span>SOLICITAR DISEÑO PERSONALIZADO</span>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default CallToAction;

