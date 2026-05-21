'use client';

import { motion } from 'framer-motion';

interface CheckoutStorePickupPanelProps {
  title: string;
  addressText: string;
}

//Rivera Indarte 2143, Córdoba

export function CheckoutStorePickupPanel({ title, addressText }: CheckoutStorePickupPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg space-y-3"
    >
      <h3 className="text-xs sm:text-sm font-bold text-black uppercase">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{addressText}</p>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.5123456789!2d-64.1835!3d-31.4135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2f3456789ab%3A0x123456789abcdef!2sRivera%20Indarte%202143%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación NTDS - Rivera Indarte 2143, Córdoba"></iframe>
    </motion.div>

  );
}
