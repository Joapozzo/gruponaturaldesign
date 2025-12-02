'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string | null;
    isMobile: boolean;
    onSizeSelect: (size: string, e: React.MouseEvent) => void;
}

export default function SizeSelector({
    sizes,
    selectedSize,
    isMobile,
    onSizeSelect,
}: SizeSelectorProps) {
    return (
        <div className="space-y-1.5 pt-1">
            <label
                className={`font-semibold text-gray-700 uppercase tracking-wide ${
                    isMobile ? 'text-xs' : 'text-sm'
                }`}
            >
                Talle
            </label>
            <div className="flex flex-row gap-1.5 sm:gap-2 max-w-full overflow-x-auto overflow-y-visible pb-2 pt-1 -mx-1 px-1 sm:flex-wrap sm:overflow-x-visible">
                {sizes.map((size) => {
                    const isSelected = selectedSize === size;

                    return (
                        <motion.button
                            key={size}
                            onClick={(e) => onSizeSelect(size, e)}
                            className={`
                                relative rounded-lg font-semibold transition-all duration-200 flex-shrink-0
                                min-w-[40px] sm:min-w-[44px] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm
                                ${isSelected
                                    ? 'bg-black text-white ring-1 sm:ring-2 ring-black'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {size}
                            {isSelected && (
                                <motion.div
                                    className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

