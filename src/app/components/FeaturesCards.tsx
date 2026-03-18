'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Store, Truck } from 'lucide-react';

const features = [
  {
    icon: RotateCcw,
    title: 'Cambios y devoluciones',
    description: 'Tenes 30 días para cambiar tu pedido',
  },
  {
    icon: CreditCard,
    title: 'Medio de pago',
    description: '3 cuotas sin interés • 15% off con transferencia',
  },
  {
    icon: Store,
    title: 'Pick up store',
    description: 'Coordiná para retirar tu pedido',
  },
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'Envío gratis a sucursal en compras superiores a $200.000',
  },
];

const FeaturesCards = () => {
  return (
    <div className="w-full px-4 lg:px-15">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 p-5 flex flex-col items-center text-center"
            >
              <div className="mb-3 p-2 bg-gray-50">
                <IconComponent
                  className="w-8 h-8 lg:w-9 lg:h-9 text-gray-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-sm lg:text-base font-semibold text-gray-800 mb-1.5 tracking-wide">
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
  );
};

export default FeaturesCards;
