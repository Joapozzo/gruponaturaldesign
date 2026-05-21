import React from 'react';
import { cn } from '@/lib/utils';
import type { CuponEstado } from '@/app/types/cupones';

const estadoStyles: Record<CuponEstado, { bg: string; text: string }> = {
  activo: { bg: 'bg-green-100', text: 'text-green-800' },
  pausado: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  archivado: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const estadoLabels: Record<CuponEstado, string> = {
  activo: 'Activo',
  pausado: 'Pausado',
  archivado: 'Archivado',
};

interface AdminCuponEstadoBadgeProps {
  estado: CuponEstado;
  className?: string;
}

export function AdminCuponEstadoBadge({ estado, className }: AdminCuponEstadoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        estadoStyles[estado].bg,
        estadoStyles[estado].text,
        className
      )}
    >
      {estadoLabels[estado]}
    </span>
  );
}