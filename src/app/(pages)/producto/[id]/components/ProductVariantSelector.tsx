"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GroupedProduct } from '@/app/types/producto';
import { getColorHex } from '@/app/components/product-card/utils/colorUtils';

interface ProductVariantSelectorProps {
    groupedProduct: GroupedProduct;
    selectedColor: string | null;
    selectedSize: string | null;
    availableSizes: string[];
    onColorSelect: (color: string) => void;
    onSizeSelect: (size: string) => void;
}

export default function ProductVariantSelector({
    groupedProduct,
    selectedColor,
    selectedSize,
    availableSizes,
    onColorSelect,
    onSizeSelect,
}: ProductVariantSelectorProps) {
    if (groupedProduct.totalVariants <= 1) return null;

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Selector de Colores */}
            {groupedProduct.availableColors && groupedProduct.availableColors.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Color {selectedColor && `- ${selectedColor}`}
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {groupedProduct.availableColors.map((color) => {
                            const variantWithColor = groupedProduct.variants.find(v => v.color === color);
                            const colorHex = variantWithColor?.colorHex || getColorHex(color);
                            const isSelected = selectedColor === color;

                            return (
                                <motion.button
                                    key={color}
                                    onClick={() => onColorSelect(color)}
                                    className={`
                                        relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200
                                        ${isSelected
                                            ? 'ring-2 ring-black ring-offset-2'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                                    `}
                                    style={{ backgroundColor: colorHex }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={color}
                                >
                                    {isSelected && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#Ed3237] rounded-full p-0.5 sm:p-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selector de Talles */}
            {selectedColor && availableSizes.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <label className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                        Talle {selectedSize && `- ${selectedSize}`}
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {availableSizes.map((size) => {
                            const isSelected = selectedSize === size;
                            
                            // Buscar la variante para este color y talle para verificar stock
                            const variant = groupedProduct.variants.find(
                                v => v.color?.toLowerCase() === selectedColor?.toLowerCase() && v.talle === size
                            );
                            const hasStock = variant && variant.stock !== undefined && variant.stock > 0;
                            const isOutOfStock = variant && variant.stock === 0;

                            return (
                                <motion.button
                                    key={size}
                                    onClick={() => onSizeSelect(size)}
                                    disabled={!variant || isOutOfStock}
                                    className={`
                                        relative min-w-[40px] sm:min-w-[50px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg
                                        text-xs font-bold transition-all duration-200
                                        ${isSelected
                                            ? 'bg-black text-white ring-1 sm:ring-2 ring-black ring-offset-1 sm:ring-offset-2'
                                            : isOutOfStock
                                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }
                                    `}
                                    whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
                                    whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                                    title={isOutOfStock ? 'Sin stock' : variant ? `Stock: ${variant.stock}` : ''}
                                >
                                    {size}
                                    {isSelected && (
                                        <motion.div
                                            className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-[#Ed3237] rounded-full p-0.5 sm:p-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

