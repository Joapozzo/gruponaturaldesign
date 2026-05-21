import React from 'react';
import { cn } from '@/lib/utils';
import type { CuponTipoDescuento } from '@/app/types/cupones';

interface AdminCuponTipoLabelProps {
  tipo: CuponTipoDescuento;
  valor: number;
  className?: string;
}

export function AdminCuponTipoLabel({ tipo, valor, className }: AdminCuponTipoLabelProps) {
  const label = tipo === 'porcentaje' ? `${valor}%` : `$${valor.toLocaleString('es-AR')}`;
  return (
    <span className={cn('font-medium text-sm', className)}>{label}</span>
  );
}