"use client";
import React from 'react';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';

interface ProductSpecsProps {
    selectedVariant: ProductVariant;
    displayProduct: ProductWithImage;
}

export default function ProductSpecs({ selectedVariant, displayProduct }: ProductSpecsProps) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-gray-50 p-2.5 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">
                    Código
                </h4>
                <p className="text-gray-600 font-mono text-xs sm:text-sm">
                    {selectedVariant.codigo}
                </p>
            </div>
            {displayProduct.Rubro && (
                <div className="bg-gray-50 p-2.5 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">
                        Categoría
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                        {displayProduct.Rubro}
                    </p>
                </div>
            )}
        </div>
    );
}

