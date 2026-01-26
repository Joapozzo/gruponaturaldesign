"use client";
import React from 'react';
import { ProductVariant } from '@/app/types/producto';

interface ProductVariantBadgeProps {
    selectedColor: string | null;
    selectedSize: string | null;
    selectedVariant: ProductVariant;
}

export default function ProductVariantBadge({
    selectedColor,
    selectedSize,
    selectedVariant,
}: ProductVariantBadgeProps) {
    if (!selectedColor || !selectedSize) return null;

    return (
        <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-900">
                {selectedColor} - {selectedSize}
            </p>
            <p className="text-xs text-gray-600">
                {selectedVariant.codigo}
            </p>
        </div>
    );
}

