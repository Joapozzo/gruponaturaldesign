import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CuponAplicado } from '@/app/types/cupones';

interface CuponAppliedBannerProps {
  cupon: CuponAplicado;
  onRemove?: () => void;
  className?: string;
}

export function CuponAppliedBanner({ cupon, onRemove, className }: CuponAppliedBannerProps) {
  const formattedDiscount =
    cupon.tipoDescuento === 'porcentaje'
      ? `${cupon.valorDescuento}%`
      : `$${cupon.descuentoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  return (
    <div
      className={cn(
        'flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">
            Cupón aplicado: {cupon.codigo}
          </p>
          <p className="text-xs text-green-600">
            {cupon.nombre} — -{formattedDiscount}
          </p>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-green-600 hover:text-green-800 hover:bg-green-100 rounded p-1 transition-colors"
          aria-label="Quitar cupón"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}