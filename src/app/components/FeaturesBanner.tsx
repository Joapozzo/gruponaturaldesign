"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CreditCard, Store, Truck } from 'lucide-react';
import { PAYMENT_BENEFITS_COPY } from '@/app/config/sales.config';

const FeaturesBanner = () => {
  const features = [
    {
      icon: RotateCcw,
      title: "Cambios y devoluciones",
      description: "Tenes 30 dias para cambiar tu pedido"
    },
    {
      icon: CreditCard,
      title: "Medio de pago",
      description: PAYMENT_BENEFITS_COPY.paymentMethodDescription
    },
    {
      icon: Store,
      title: "Pick up store",
      description: "Coordina para retirar tu pedido"
    },
    {
      icon: Truck,
      title: "Envio gratis",
      description: "Envio gratis a sucursal en compras superiores a $200.000"
    }
  ];

  return (
    <div className="w-full bg-gray-100 py-6 lg:py-8">
      <div className="w-full px-4 lg:px-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full items-center md:items-start justify-items-center md:justify-items-start">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center md:items-start md:text-left w-full max-w-xs md:max-w-none"
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
