import React from 'react';
import { cn } from '@/lib/utils';
import type { CuponAplicado } from '@/app/types/cupones';

interface CuponSummaryRowProps {
  cupon: CuponAplicado;
  className?: string;
}

export function CuponSummaryRow({ cupon, className }: CuponSummaryRowProps) {
  const formattedDiscount = `$${cupon.descuentoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  return (
    <div className={cn('flex justify-between items-center text-sm', className)}>
      <span className="text-gray-600">
        Cupón <span className="font-medium">{cupon.codigo}</span>
      </span>
      <span className="text-green-600 font-medium">-{formattedDiscount}</span>
    </div>
  );
}