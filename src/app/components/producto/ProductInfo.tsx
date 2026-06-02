"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';
import { formatPrice } from '../../utils/productHelpers';
import { usePrecioConfigPublic } from '@/app/hooks/usePrecioConfigPublic';
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
    const formattedPrice = formatPrice(price);
    const { data: precioConfig } = usePrecioConfigPublic();
    const cuotas = precioConfig?.cuotasFinanciado ?? 3;
    const descuentoTransferPct = Math.round((precioConfig?.descuentoTransferencia ?? 0.15) * 100);

    const precioTransfer = selectedVariant?.producto?.precioTransfer || displayProduct.precioTransfer;
    const precio3cuotas = selectedVariant?.producto?.precio3cuotas || displayProduct.precio3cuotas;
    const precioSImp = selectedVariant?.producto?.precioSImp || displayProduct.precioSImp;

    const formattedTransfer = precioTransfer != null ? formatPrice(precioTransfer) : null;
    const formatted3Cuotas = precio3cuotas != null ? formatPrice(precio3cuotas) : null;
    const formattedSImp = precioSImp != null ? formatPrice(precioSImp) : null;

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

            <div className="space-y-1.5">
                <div className="flex flex-col gap-1 sm:gap-1.5">
                    <span className="text-2xl sm:text-3xl font-bold tabular-nums text-neutral-900">
                        {formattedPrice}
                    </span>

                    {formattedTransfer && (
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xl sm:text-2xl font-bold tabular-nums text-[var(--red)]">
                                {formattedTransfer}
                            </span>
                            <span className="text-[10px] sm:text-xs text-neutral-500 leading-snug">
                                Ahorrá un {descuentoTransferPct}% con transferencia
                            </span>
                        </div>
                    )}
                </div>

                {formatted3Cuotas && (
                    <p className="text-sm text-neutral-600">
                        o hacelo en {cuotas} {cuotas === 1 ? 'cuota de' : 'cuotas de'} {formatted3Cuotas}
                    </p>
                )}

                {formattedSImp && (
                    <p className="text-[10px] leading-snug text-neutral-400">
                        Sin impuestos nacionales: {formattedSImp}.
                    </p>
                )}
            </div>

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
