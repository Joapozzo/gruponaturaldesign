"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GroupedProduct } from '@/app/types/producto';
import type { ColorSelectability } from '@/app/hooks/useProductVariants';
import { getColorHex } from '@/app/components/product-card/utils/colorUtils';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const SWATCH_SIZE = 'h-9 w-9 sm:h-10 sm:w-10';
const TALLE_SIZE = 'h-9 sm:h-10 min-h-9 sm:min-h-10';

interface ProductVariantSelectorProps {
    groupedProduct: GroupedProduct;
    selectedColor: string | null;
    selectedSize: string | null;
    availableSizes: string[];
    hasColors?: boolean;
    colorSelectability?: Record<string, ColorSelectability>;
    onColorSelect: (color: string) => void;
    onSizeSelect: (size: string) => void;
}

function colorsMatch(
    variantColor: string | null | undefined,
    selectedColor: string | null,
): boolean {
    if (selectedColor) {
        return variantColor?.toLowerCase() === selectedColor.toLowerCase();
    }
    return variantColor == null || variantColor === '';
}

function bestVariantForSize(
    groupedProduct: GroupedProduct,
    selectedColor: string | null,
    size: string,
) {
    const matches = groupedProduct.variants.filter(
        (v) => colorsMatch(v.color, selectedColor) && v.talle === size,
    );
    if (matches.length === 0) return undefined;
    return matches.reduce((best, v) =>
        (v.stock ?? 0) >= (best.stock ?? 0) ? v : best,
    );
}

export default function ProductVariantSelector({
    groupedProduct,
    selectedColor,
    selectedSize,
    availableSizes,
    hasColors = true,
    colorSelectability = {},
    onColorSelect,
    onSizeSelect,
}: ProductVariantSelectorProps) {
    if (groupedProduct.totalVariants <= 1) return null;

    const showSizeSelector =
        availableSizes.length > 0 && (Boolean(selectedColor) || !hasColors);

    return (
        <div className="space-y-4 w-full">
            {hasColors &&
                groupedProduct.availableColors &&
                groupedProduct.availableColors.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">
                        Selecciona color
                    </label>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5 p-0.5">
                        {groupedProduct.availableColors.map((color) => {
                            const variantWithColor = groupedProduct.variants.find(
                                (v) => v.color === color,
                            );
                            const colorHex =
                                variantWithColor?.colorHex || getColorHex(color);
                            const isSelected = selectedColor === color;
                            const selectability = colorSelectability[color];
                            const isDisabled = selectability?.selectable === false;
                            const disabledReason = selectability?.reason;

                            return (
                                <motion.button
                                    key={color}
                                    type="button"
                                    onClick={() => {
                                        if (!isDisabled) onColorSelect(color);
                                    }}
                                    disabled={isDisabled}
                                    className={cn(
                                        'relative shrink-0 rounded-full border-2 transition-all duration-200 focus:outline-none',
                                        SWATCH_SIZE,
                                        isDisabled
                                            ? 'border-gray-200 opacity-40 cursor-not-allowed'
                                            : cn(
                                                  'border-gray-300',
                                                  !isSelected && 'hover:border-gray-400',
                                              ),
                                    )}
                                    style={{ backgroundColor: colorHex }}
                                    whileHover={isDisabled ? undefined : { scale: 1.05 }}
                                    whileTap={isDisabled ? undefined : { scale: 0.95 }}
                                    title={
                                        isDisabled && disabledReason
                                            ? `${color} — ${disabledReason}`
                                            : color
                                    }
                                    aria-label={
                                        isDisabled && disabledReason
                                            ? `${color}, ${disabledReason}`
                                            : color
                                    }
                                >
                                    {isSelected && !isDisabled && (
                                        <motion.div
                                            className="absolute -top-0.5 -right-0.5 bg-[#Ed3237] rounded-full p-0.5"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Check className="w-2 h-2 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}

            {showSizeSelector && (
                <div className="space-y-2 w-full">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">
                        Selecciona talle
                    </label>
                    <div className="w-full overflow-x-auto overflow-y-visible overscroll-x-contain">
                        <div className="flex flex-nowrap gap-2 sm:gap-2.5 min-w-full w-max p-0.5">
                        {availableSizes.map((size) => {
                            const isSelected = selectedSize === size;
                            const variant = bestVariantForSize(
                                groupedProduct,
                                selectedColor,
                                size,
                            );
                            const isOutOfStock = variant && variant.stock === 0;

                            return (
                                <Button
                                    key={size}
                                    type="button"
                                    size="sm"
                                    variant={isSelected ? 'black' : 'secondary'}
                                    onClick={() => onSizeSelect(size)}
                                    disabled={!variant || isOutOfStock}
                                    className={cn(
                                        'flex-1 min-w-9 shrink-0 px-3 font-semibold',
                                        TALLE_SIZE,
                                        isOutOfStock &&
                                            'bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 opacity-50',
                                    )}
                                    title={
                                        isOutOfStock
                                            ? 'Sin stock'
                                            : variant
                                              ? `Stock: ${variant.stock}`
                                              : 'No disponible'
                                    }
                                >
                                    {size}
                                </Button>
                            );
                        })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
