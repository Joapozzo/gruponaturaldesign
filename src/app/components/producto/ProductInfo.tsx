"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';
import { ProductPriceBlock } from '@/app/components/precio/ProductPriceBlock';
import { usePrecioPublico } from '@/app/hooks/usePrecioPublico';
import { cn } from '@/lib/utils';
import BordadoSwitch from '@/app/components/product-card/components/BordadoSwitch';

interface ProductInfoProps {
    productName: string;
    displayProduct: ProductWithImage;
    selectedVariant: ProductVariant;
    price: number | null | undefined;
    hideTitle?: boolean;
    className?: string;
    bordado?: boolean;
    onBordadoChange?: (value: boolean) => void;
    canActivateBordado?: boolean;
}

export default function ProductInfo({
    productName,
    displayProduct,
    selectedVariant,
    price,
    hideTitle = false,
    className,
    bordado = false,
    onBordadoChange,
    canActivateBordado = false,
}: ProductInfoProps) {
    const variantProduct = selectedVariant?.producto;
    const { precio, descuentoTransferPct } = usePrecioPublico({
        precioLista: price ?? displayProduct.precioLista ?? null,
        precioTransfer: variantProduct?.precioTransfer ?? displayProduct.precioTransfer,
        precioSinImp: variantProduct?.precioSImp ?? displayProduct.precioSImp,
        precio3cuotas: variantProduct?.precio3cuotas ?? displayProduct.precio3cuotas,
        cuotas: variantProduct?.cuotas ?? displayProduct.cuotas ?? null,
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn('w-full flex flex-col min-h-0', className)}
        >
            {!hideTitle && (
                <h1 className="text-sm sm:text-base font-medium text-neutral-900 mb-2 leading-tight">
                    {productName}
                </h1>
            )}

            <ProductPriceBlock
                precio={precio}
                descuentoTransferPct={descuentoTransferPct}
                variant="detail"
            />

            {onBordadoChange && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                    <BordadoSwitch
                        value={bordado}
                        onChange={onBordadoChange}
                        isMobile={false}
                        size="medium"
                        disabled={!canActivateBordado}
                    />
                </div>
            )}
        </motion.div>
    );
}
