"use client";
import React, { useState } from 'react';
import { GroupedProduct } from '@/app/types/producto';
import ProductCardGrouped from '@/app/components/ProductCardGrouped';

interface RelatedProductsProps {
    relatedProducts: GroupedProduct[];
}

export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
    const [expandedSku, setExpandedSku] = useState<string | null>(null);

    if (relatedProducts.length === 0) return null;

    // Tomar solo los primeros 4 productos
    const productsToShow = relatedProducts.slice(0, 4);

    return (
        <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                Productos relacionados
            </h2>
            
            {/* Grid de productos - 4 columnas en desktop, responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {productsToShow.map((group, index) => (
                    <div key={group.skuBase}>
                        <ProductCardGrouped 
                            group={group} 
                            index={index}
                            expandedSku={expandedSku}
                            onExpandChange={setExpandedSku}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

