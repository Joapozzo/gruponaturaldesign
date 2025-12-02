'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getColorHex } from '../utils/colorUtils';
import { ProductVariant } from '@/app/types/producto';

interface ColorSelectorProps {
    colors: string[];
    variants: ProductVariant[];
    selectedColor: string | null;
    isMobile: boolean;
    onColorSelect: (color: string, e: React.MouseEvent) => void;
}

export default function ColorSelector({
    colors,
    variants,
    selectedColor,
    isMobile,
    onColorSelect,
}: ColorSelectorProps) {
    return (
        <div className="space-y-1.5">
            <label
                className={`font-semibold text-gray-700 uppercase tracking-wide ${
                    isMobile ? 'text-xs' : 'text-sm'
                }`}
            >
                Color
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {colors.map((color) => {
                    const variantWithColor = variants.find((v) => v.color === color);
                    const colorHex = variantWithColor?.colorHex || getColorHex(color);
                    const isSelected = selectedColor === color;

                    return (
                        <motion.button
                            key={color}
                            onClick={(e) => onColorSelect(color, e)}
                            className={`
                                relative flex items-center justify-center rounded-full
                                transition-all duration-200
                                ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}
                                ${isSelected
                                    ? 'ring-2 ring-black ring-offset-2'
                                    : 'hover:ring-2 hover:ring-gray-300 ring-offset-2'
                                }
                            `}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title={color}
                        >
                            <div
                                className={`rounded-full w-full h-full border-2 ${
                                    isSelected ? 'border-white' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: colorHex }}
                            />
                            {isSelected && (
                                <motion.div
                                    className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Check className={isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

