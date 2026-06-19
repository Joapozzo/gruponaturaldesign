'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface DashboardSectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Si es true, el body no aplica padding (útil para tablas full-bleed). */
  noPadding?: boolean;
}

export function DashboardSectionCard({
  title,
  action,
  children,
  className,
  noPadding,
}: DashboardSectionCardProps) {
  return (
    <Card variant="bordered" padding="none" className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">{title}</h3>
        {action}
      </div>
      <div className={cn(noPadding ? 'p-0' : 'p-5')}>{children}</div>
    </Card>
  );
}
