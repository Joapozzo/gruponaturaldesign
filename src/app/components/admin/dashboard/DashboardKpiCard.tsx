'use client';

import { cn } from '@/lib/utils';
import { DashboardKpiTrend } from './DashboardKpiTrend';

interface DashboardKpiCardProps {
  label: string;
  value: string;
  delta: { absoluto: number; pct: number | null };
  hasComparison: boolean;
  className?: string;
}

export function DashboardKpiCard({ label, value, delta, hasComparison, className }: DashboardKpiCardProps) {
  return (
    <div className={cn('bg-white border border-neutral-200 rounded-lg p-5', className)}>
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-bold text-neutral-900 tabular-nums leading-tight">{value}</p>
      {hasComparison && (
        <div className="mt-2">
          <DashboardKpiTrend value={delta.absoluto} pct={delta.pct} />
        </div>
      )}
    </div>
  );
}
