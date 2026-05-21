'use client';

import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { selectedCardClass, selectedCheckClass, unselectedCardClass } from './checkoutShippingSelectionStyles';

interface CheckoutSelectableDeliveryCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function CheckoutSelectableDeliveryCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
}: CheckoutSelectableDeliveryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all ${
        selected ? selectedCardClass : unselectedCardClass
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold uppercase text-black tracking-tight">{title}</p>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{description}</p>
        </div>
        {selected ? (
          <div
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 ${selectedCheckClass}`}
          >
            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={3} />
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
