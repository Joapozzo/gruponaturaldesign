'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';
import { shippingProviderLabel, shippingProviderLogo } from './shippingTracking.constants';

interface ShippingProviderLogoProps {
  provider: ShippingProviderId;
  size?: 'sm' | 'md';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { box: 'w-8 h-8', img: 'max-h-5', text: 'text-sm' },
  md: { box: 'w-10 h-10 sm:w-12 sm:h-12', img: 'max-h-8', text: 'text-sm sm:text-base' },
};

export function ShippingProviderLogo({
  provider,
  size = 'sm',
  showName = false,
  className = '',
}: ShippingProviderLogoProps) {
  const logoSrc = shippingProviderLogo(provider);
  const name = shippingProviderLabel(provider);
  const s = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <span
        className={`shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 ${s.box}`}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={name}
            width={32}
            height={32}
            className={`object-contain w-auto ${s.img}`}
          />
        ) : (
          <Mail className="w-5 h-5 text-[#003DA5]" aria-hidden />
        )}
      </span>
      {showName ? (
        <span className={`font-semibold text-neutral-900 truncate ${s.text}`}>{name}</span>
      ) : null}
    </div>
  );
}
