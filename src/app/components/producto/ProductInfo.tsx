"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Landmark, Tag } from 'lucide-react';
import { ProductWithImage, ProductVariant } from '@/app/types/producto';
import { formatPrice } from '../../utils/productHelpers';
import { useEmpresaPrecioConfig } from '@/app/hooks/useEmpresaPrecioConfig';

interface ProductInfoProps {
    productName: string;
    displayProduct: ProductWithImage;
    selectedVariant: ProductVariant;
    price: number | null | undefined;
    hideTitle?: boolean;
}

export default function ProductInfo({ productName, displayProduct, selectedVariant, price, hideTitle = false }: ProductInfoProps) {
    const formattedPrice = formatPrice(price);
    const { data: precioConfig } = useEmpresaPrecioConfig();
    const cuotas = precioConfig?.cuotasFinanciado ?? 3;
    const cuotasLabel = `${cuotas} ${cuotas === 1 ? 'cuota de' : 'cuotas de'}`;
    
    // Obtener precios adicionales
    const precioTransfer = selectedVariant?.producto?.precioTransfer || displayProduct.precioTransfer;
    const precio3cuotas = selectedVariant?.producto?.precio3cuotas || displayProduct.precio3cuotas;
    const precioSImp = selectedVariant?.producto?.precioSImp || displayProduct.precioSImp;
    
    const formattedTransfer = precioTransfer
        ? `$${precioTransfer.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formatted3Cuotas = precio3cuotas
        ? `$${precio3cuotas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formattedSImp = precioSImp
        ? `$${precioSImp.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    // Usar la descripción completa del producto (descripcionCompleta)
    const description = selectedVariant?.producto?.descripcionCompleta || displayProduct.descripcionCompleta;
    
    // Obtener textiles del producto
    const textiles = selectedVariant?.producto?.textiles || displayProduct.textiles;

    const showPriceRows = Boolean(formattedTransfer || formatted3Cuotas);

    const priceRowClass =
        'flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2.5 sm:items-center sm:gap-3';
    const priceIconClass =
        'mt-0.5 size-4 shrink-0 text-neutral-600 sm:mt-0 sm:size-[18px]';
    const priceLabelClass = 'text-xs font-semibold text-neutral-700 sm:text-sm';
    const priceAmountClass =
        'text-base font-bold tabular-nums text-neutral-900 sm:text-lg';

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-2 sm:space-y-3"
        >
            {/* Título y precio */}
            <div className="w-full">
                {!hideTitle && (
                    <h1 className="text-sm sm:text-base lg:text-lg font-medium text-neutral-900 mb-1 leading-tight">
                        {productName}
                    </h1>
                )}
                <div className="mb-3 flex w-full flex-col gap-2">
                    {showPriceRows ? (
                        <>
                            <div className={priceRowClass}>
                                <Tag className={priceIconClass} aria-hidden />
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                    <span className={priceLabelClass}>Precio de lista</span>
                                    <span className={priceAmountClass}>{formattedPrice}</span>
                                </div>
                            </div>
                            {formattedTransfer && (
                                <div className="flex items-start gap-2.5 rounded-lg border border-[var(--red)] bg-neutral-100 px-3 py-2.5 sm:items-center sm:gap-3">
                                    <Landmark
                                        className="mt-0.5 size-4 shrink-0 text-[var(--red)] sm:mt-0 sm:size-[18px]"
                                        aria-hidden
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                        <span className="text-xs font-semibold text-[var(--red)] sm:text-sm">
                                            Transferencia
                                        </span>
                                        <span className="text-base font-bold tabular-nums text-[var(--red)] sm:text-lg">
                                            {formattedTransfer}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {formatted3Cuotas && (
                                <div className={priceRowClass}>
                                    <CreditCard className={priceIconClass} aria-hidden />
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                                        <span className={priceLabelClass}>{cuotasLabel}</span>
                                        <span className={priceAmountClass}>{formatted3Cuotas}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-sm font-bold tabular-nums text-neutral-900 sm:text-base lg:text-lg">
                            {formattedPrice}
                        </span>
                    )}

                    {formattedSImp && (
                        <p className="text-[10px] leading-snug text-neutral-400">
                            Sin impuestos nacionales: {formattedSImp}.
                        </p>
                    )}
                </div>
                {/* Descripción completa del producto */}
                {description && (
                    <div className="mb-2">
                        <h3 className="text-[10px] sm:text-xs font-bold text-neutral-900 uppercase tracking-wide mb-0.5">
                            Descripción
                        </h3>
                        <p className="text-neutral-700 text-[10px] sm:text-xs leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}
                {/* Textiles */}
                {textiles && (
                    <div className="mb-1.5">
                        <h3 className="text-[10px] sm:text-xs font-bold text-neutral-900 uppercase tracking-wide mb-0.5">
                            Textiles
                        </h3>
                        <p className="text-neutral-700 text-[10px] sm:text-xs leading-relaxed">
                            {textiles}
                        </p>
                    </div>
                )}
                {/* Material (fallback si no hay textiles) */}
                {!textiles && displayProduct.Material && (
                    <div className="mb-1.5">
                        <h3 className="text-[10px] sm:text-xs font-bold text-neutral-900 uppercase tracking-wide mb-0.5">
                            Material
                        </h3>
                        <p className="text-neutral-700 text-[10px] sm:text-xs">
                            {displayProduct.Material}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

