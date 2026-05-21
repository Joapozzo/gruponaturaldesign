'use client';

import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardEmptyStateProps {
  message?: string;
  className?: string;
}

export function DashboardEmptyState({
  message = 'No hay datos para mostrar',
  className,
}: DashboardEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
      <Inbox className="w-8 h-8 text-neutral-300 mb-2" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
