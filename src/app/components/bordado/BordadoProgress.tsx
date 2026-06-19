'use client';

import { cn } from '@/lib/utils';
import { ProgressBar } from '../ui/ProgressBar';

interface BordadoProgressProps {
    current: number;
    minItems: number;
    className?: string;
}

export function BordadoProgress({ current, minItems, className }: BordadoProgressProps) {
    const complete = current >= minItems;
    const remaining = Math.max(0, minItems - current);

    return (
        <div className={cn('space-y-2', className)}>
            <p className="text-[11px] text-neutral-600 leading-snug">
                {complete
                    ? 'Ya podés activar bordado en tus productos'
                    : remaining === 1
                      ? 'Falta 1 prenda para bordar tu logo'
                      : `Faltan ${remaining} prendas para bordar tu logo`}
            </p>

            <div className="space-y-1">
                <ProgressBar
                    value={current}
                    max={minItems}
                    variant="brand"
                    size="md"
                    aria-label={`Progreso bordado: ${current} de ${minItems} prendas`}
                />
                <div className="flex justify-between">
                    <span className="text-[10px] text-neutral-400 tabular-nums">0</span>
                    <span className="text-[10px] text-neutral-400 tabular-nums">{minItems}</span>
                </div>
            </div>
        </div>
    );
}
