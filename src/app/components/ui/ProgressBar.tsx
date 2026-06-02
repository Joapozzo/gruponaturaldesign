'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max: number;
    size?: 'sm' | 'md';
    variant?: 'neutral' | 'brand';
    className?: string;
    'aria-label'?: string;
}

export function ProgressBar({
    value,
    max,
    size = 'sm',
    variant = 'neutral',
    className,
    'aria-label': ariaLabel,
}: ProgressBarProps) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    const complete = value >= max;

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={ariaLabel}
            className={cn(
                'w-full rounded-full bg-neutral-200 overflow-hidden',
                size === 'sm' ? 'h-1.5' : 'h-2',
                className,
            )}
        >
            <div
                className={cn(
                    'h-full rounded-full transition-all duration-300',
                    variant === 'brand'
                        ? 'bg-[#Ed3237]'
                        : complete
                          ? 'bg-neutral-700'
                          : 'bg-neutral-400',
                )}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}
