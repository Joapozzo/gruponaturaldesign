'use client';

import { parseProductSpecs } from '@/app/utils/productHelpers';
import { cn } from '@/lib/utils';

interface CartItemVariantSpecsProps {
    especificaciones?: string;
    className?: string;
}

export function CartItemVariantSpecs({ especificaciones, className }: CartItemVariantSpecsProps) {
    const { color, talle } = parseProductSpecs(especificaciones);
    if (!color && !talle) return null;

    return (
        <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
            {color && (
                <span className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                    {color}
                </span>
            )}
            {talle && (
                <span className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded tabular-nums">
                    Talle {talle}
                </span>
            )}
        </div>
    );
}
