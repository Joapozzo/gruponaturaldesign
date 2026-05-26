'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import type { ShippingTrackingProviderOption } from '@/app/components/shipping/shippingTracking.constants';
import {
  selectedCardClass,
  selectedCheckClass,
  unselectedCardClass,
} from '@/app/components/checkout/shipping/checkoutShippingSelectionStyles';

interface ShippingProviderOptionCardProps {
  option: ShippingTrackingProviderOption;
  selected: boolean;
  onSelect: () => void;
}

export function ShippingProviderOptionCard({
  option,
  selected,
  onSelect,
}: ShippingProviderOptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full overflow-hidden p-4 sm:p-5 border-2 rounded-xl text-left transition-all ${
        selected ? selectedCardClass : unselectedCardClass
      }`}
    >
      {option.logoSrc ? (
        <Image
          src={option.logoSrc}
          alt=""
          aria-hidden
          width={140}
          height={140}
          className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 object-contain opacity-[0.12] select-none"
        />
      ) : null}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <span className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white border border-gray-200">
          {option.logoSrc ? (
            <Image
              src={option.logoSrc}
              alt={option.name}
              width={32}
              height={32}
              className="object-contain max-h-8 w-auto"
            />
          ) : (
            <Mail className="w-6 h-6 text-[#003DA5]" aria-hidden />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm sm:text-base text-black">{option.name}</h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">{option.description}</p>
        </div>
        {selected ? (
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 ${selectedCheckClass}`}
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
