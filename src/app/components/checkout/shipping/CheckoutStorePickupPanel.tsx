'use client';

import { motion } from 'framer-motion';
import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import { StoreLocationMap } from '@/app/components/StoreLocationMap';
import { StorePickupInfoList } from '@/app/components/checkout/shipping/StorePickupInfoList';

interface CheckoutStorePickupPanelProps {
  title: string;
}

export function CheckoutStorePickupPanel({ title }: CheckoutStorePickupPanelProps) {
  const tienda = useTiendaConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white border border-gray-200 shadow-sm p-3 sm:p-4 rounded-lg space-y-3"
    >
      <h3 className="text-xs sm:text-sm font-bold text-black uppercase">{title}</h3>
      <StorePickupInfoList tienda={tienda} variant="panel" />
      <StoreLocationMap minHeightClass="min-h-[200px] sm:min-h-[220px]" />
    </motion.div>
  );
}
