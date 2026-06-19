"use client";
import React from 'react';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';

interface ProductSpecsProps {
    selectedVariant: ProductVariant;
    displayProduct: ProductWithImage;
}

export default function ProductSpecs({ selectedVariant, displayProduct }: ProductSpecsProps) {
    return (
        <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-gray-50 p-1.5 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-0.5 text-[10px]">
                    Código
                </h4>
                <p className="text-gray-600 font-mono text-[10px]">
                    {selectedVariant.codigo}
                </p>
            </div>
            {displayProduct.Rubro && (
                <div className="bg-gray-50 p-1.5 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-0.5 text-[10px]">
                        Categoría
                    </h4>
                    <p className="text-gray-600 text-[10px]">
                        {(() => {
                            let rubro = displayProduct.Rubro || '';
                            // Quitar "PRODUCTO" del inicio
                            if (rubro.toUpperCase().startsWith('PRODUCTO ')) {
                                rubro = rubro.substring(9); // Quitar "PRODUCTO "
                            }
                            // Normalizar: OFFICE → BASIC
                            if (rubro.toUpperCase().includes('OFFICE')) {
                                return 'BASIC';
                            }
                            return rubro;
                        })()}
                    </p>
                </div>
            )}
        </div>
    );
}

