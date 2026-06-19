'use client';

import { PackageSearch } from 'lucide-react';

interface ShippingTrackingNumberButtonProps {
  trackingNumber: string;
  onClick: () => void;
  className?: string;
}

/** Nº de envío clickeable que abre el modal de seguimiento. */
export function ShippingTrackingNumberButton({
  trackingNumber,
  onClick,
  className = '',
}: ShippingTrackingNumberButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline ${className}`}
    >
      <PackageSearch className="w-3.5 h-3.5 shrink-0" aria-hidden />
      {trackingNumber}
    </button>
  );
}
