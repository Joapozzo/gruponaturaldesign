"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Store, Truck } from 'lucide-react';

const FeaturesBanner = () => {
  const features = [
    {
      icon: RotateCcw,
      title: "Cambios y devoluciones",
      description: "Tenes 30 días para cambiar tu pedido"
    },
    {
      icon: CreditCard,
      title: "Medio de pago",
      description: "3 cuotas sin interés • 15% off con transferencia"
    },
    {
      icon: Store,
      title: "Pick up store",
      description: "Coordiná para retirar tu pedido"
    },
    {
      icon: Truck,
      title: "Envío gratis",
      description: "Envío gratis a sucursal en compras superiores a $200.000"
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                <div className="mb-3">
                  <IconComponent 
                    className="w-10 h-10 lg:w-12 lg:h-12 text-gray-600" 
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-gray-800 mb-1.5 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-[10px] lg:text-xs text-gray-600 leading-relaxed">
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

