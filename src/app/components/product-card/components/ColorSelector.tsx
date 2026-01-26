'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getColorHex } from '../utils/colorUtils';
import { ProductVariant } from '@/app/types/producto';

interface ColorSelectorProps {
    colors: string[];
    variants?: ProductVariant[] | Array<{ color?: string | null; colorHex?: string }>;
    selectedColor: string | null;
    isMobile?: boolean;
    onColorSelect: (color: string, e?: React.MouseEvent) => void;
}

export default function ColorSelector({
    colors,
    variants = [],
    selectedColor,
    isMobile = false,
    onColorSelect,
}: ColorSelectorProps) {
    // Validar que variants sea un array válido
    const safeVariants = Array.isArray(variants) ? variants : [];
    
    return (
        <div className="space-y-1">
            <label
                className={`font-semibold text-gray-700 uppercase tracking-wide ${
                    isMobile ? 'text-xs' : 'text-[10px]'
                }`}
            >
                Color
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {colors && Array.isArray(colors) && colors.map((color) => {
                    const variantWithColor = safeVariants.find((v: any) => v.color === color);
                    const colorHex = (variantWithColor as any)?.colorHex || getColorHex(color);
                    const isSelected = selectedColor === color;

                    return (
                        <motion.button
                            key={color}
                            onClick={(e) => onColorSelect(color, e)}
                            className={`
                                relative flex items-center justify-center rounded-full
                                transition-all duration-200
                                ${isMobile ? 'w-8 h-8' : 'w-7 h-7'}
                                ${isSelected
                                    ? 'ring-1 ring-black ring-offset-1'
                                    : 'hover:ring-1 hover:ring-gray-300 ring-offset-1'
                                }
                            `}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title={color}
                        >
                            <div
                                className={`rounded-full w-full h-full border ${
                                    isSelected ? 'border-white' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: colorHex }}
                            />
                            {isSelected && (
                                <motion.div
                                    className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full p-0.5"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Check className={isMobile ? 'w-2 h-2' : 'w-2 h-2'} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

