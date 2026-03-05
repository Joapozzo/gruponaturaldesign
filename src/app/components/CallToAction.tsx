'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { useWhatsApp } from './hooks/useWhatsApp';
import CtaBanner from './CtaBanner';

const CallToAction = () => {
  const { openWhatsApp } = useWhatsApp({
    defaultMessage:
      '¡Hola! Me interesa solicitar un diseño personalizado de uniformes de NTDS. ¿Te gustaría hablar conmigo?',
  });

  return (
    <CtaBanner
      title="¿No encontrás lo que buscás?"
      subtitle="Diseñamos uniformes personalizados para tu empresa. Más de 25 años creando soluciones únicas."
      className="mt-12"
    >
      <Button
        variant="darkGray"
        size="lg"
        className="tracking-wide inline-flex items-center space-x-3"
        onClick={() => openWhatsApp()}
      >
        <span>Solicitar diseño personalizado</span>
        <ArrowRight className="w-6 h-6" />
      </Button>
    </CtaBanner>
  );
};

export default CallToAction;
