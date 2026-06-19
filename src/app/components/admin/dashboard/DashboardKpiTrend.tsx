'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardKpiTrendProps {
  value: number;
  pct: number | null;
  className?: string;
}

export function DashboardKpiTrend({ value, pct, className }: DashboardKpiTrendProps) {
  if (pct === null) return null;

  const isPositive = pct > 0;
  const isNeutral = pct === 0;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {isNeutral ? (
        <Minus className="w-3.5 h-3.5 text-neutral-400" />
      ) : isPositive ? (
        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
      )}
      <span
        className={cn(
          'text-xs font-medium',
          isNeutral && 'text-neutral-500',
          isPositive && 'text-green-600',
          !isNeutral && !isPositive && 'text-red-500'
        )}
      >
        {isPositive ? '+' : ''}{pct.toFixed(1)}%
      </span>
      {value !== 0 && (
        <span className="text-xs text-neutral-400">
          ({isPositive ? '+' : ''}{value.toLocaleString('es-AR')})
        </span>
      )}
    </div>
  );
}
