"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Store, Truck } from 'lucide-react';

const FeaturesBanner = () => {
  const features = [
    {
      icon: RotateCcw,
      title: "CAMBIOS Y DEVOLUCIONES",
      description: "Tenes 30 días para cambiar tu pedido"
    },
    {
      icon: CreditCard,
      title: "MEDIO DE PAGO",
      description: "6 cuotas sin interés a partir de $180.000"
    },
    {
      icon: Store,
      title: "PICK UP STORE",
      description: "Coordiná para retirar tu pedido"
    },
    {
      icon: Truck,
      title: "ENVÍO GRATIS",
      description: "Con monto mínimo de $230.000"
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">
                  <IconComponent 
                    className="w-12 h-12 lg:w-16 lg:h-16 text-gray-600" 
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm lg:text-base font-semibold text-gray-800 mb-2 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBanner;

