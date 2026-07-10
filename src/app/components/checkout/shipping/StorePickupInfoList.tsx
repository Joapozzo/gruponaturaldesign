'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clock, Mail, MapPin, Package } from 'lucide-react';
import { formatRetiroDemoraLabel } from '@/app/utils/storePickupCopy';
import { cn } from '@/lib/utils';

export interface StorePickupInfo {
  retiroDireccion: string;
  retiroHorarios?: string | null;
  retiroDemora?: string | null;
  retiroNotas?: string | null;
}

interface StorePickupInfoListProps {
  tienda: StorePickupInfo;
  /** Sidebar oscuro del checkout desktop */
  variant?: 'panel' | 'sidebar';
  className?: string;
}

function InfoRow({
  icon: Icon,
  children,
  variant,
  muted = false,
}: {
  icon: LucideIcon;
  children: ReactNode;
  variant: 'panel' | 'sidebar';
  muted?: boolean;
}) {
  const isSidebar = variant === 'sidebar';

  return (
    <li className="flex gap-2 items-start">
      <Icon
        className={cn(
          'w-4 h-4 shrink-0 mt-0.5',
          isSidebar ? 'text-gray-400' : 'text-gray-500'
        )}
        aria-hidden
      />
      <span
        className={cn(
          'leading-relaxed',
          isSidebar
            ? cn('text-[10px] sm:text-xs', muted ? 'text-gray-400' : 'text-gray-300')
            : cn('text-xs sm:text-sm', muted ? 'text-gray-600' : 'text-gray-800')
        )}
      >
        {children}
      </span>
    </li>
  );
}

export function StorePickupInfoList({
  tienda,
  variant = 'panel',
  className,
}: StorePickupInfoListProps) {
  const demoraLabel = tienda.retiroDemora
    ? formatRetiroDemoraLabel(tienda.retiroDemora)
    : null;

  return (
    <ul className={cn('space-y-2.5', className)}>
      <InfoRow icon={MapPin} variant={variant}>
        {tienda.retiroDireccion}
      </InfoRow>
      {tienda.retiroHorarios ? (
        <InfoRow icon={Clock} variant={variant}>
          Horarios: {tienda.retiroHorarios}
        </InfoRow>
      ) : null}
      {demoraLabel ? (
        <InfoRow icon={Package} variant={variant}>
          {demoraLabel}
        </InfoRow>
      ) : null}
      {tienda.retiroNotas ? (
        <InfoRow icon={Mail} variant={variant} muted>
          {tienda.retiroNotas}
        </InfoRow>
      ) : null}
    </ul>
  );
}
