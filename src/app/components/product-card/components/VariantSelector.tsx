'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ProductVariant } from '@/app/types/producto';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    isExpanded: boolean;
    onVariantSelect: (variant: ProductVariant, e: React.MouseEvent) => void;
    onToggleExpand: (e: React.MouseEvent) => void;
}

export default function VariantSelector({
    variants,
    selectedVariant,
    isExpanded,
    onVariantSelect,
    onToggleExpand,
}: VariantSelectorProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Opción seleccionada: #{selectedVariant.variantNumber}
                </span>
                <button
                    onClick={onToggleExpand}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                >
                    {isExpanded ? 'Ocultar' : `Ver ${variants.length} opciones`}
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-6 gap-1.5 p-2 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                            {variants.map((variant) => (
                                <motion.button
                                    key={variant.codigo}
                                    onClick={(e) => onVariantSelect(variant, e)}
                                    className={`
                                        relative aspect-square rounded-md text-xs font-semibold
                                        transition-all duration-200 flex items-center justify-center
                                        ${selectedVariant.codigo === variant.codigo
                                            ? 'bg-black text-white ring-2 ring-black ring-offset-1'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    #{variant.variantNumber}
                                    {selectedVariant.codigo === variant.codigo && (
                                        <motion.div
                                            className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full p-0.5"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Check className="w-2 h-2 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

