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
        <div className="space-y-1 pt-1">
            <label
                className={`font-semibold text-gray-700 uppercase tracking-wide ${
                    isMobile ? 'text-xs' : 'text-[10px]'
                }`}
            >
                Talle
            </label>
            <div className="flex flex-row gap-1 sm:gap-1.5 max-w-full overflow-x-auto overflow-y-visible pb-2 pt-1 -mx-1 px-1 sm:flex-wrap sm:overflow-x-visible">
                {sizes.map((size) => {
                    const isSelected = selectedSize === size;

                    return (
                        <motion.button
                            key={size}
                            onClick={(e) => onSizeSelect(size, e)}
                            className={`
                                relative rounded font-semibold transition-all duration-200 flex-shrink-0
                                min-w-[36px] sm:min-w-[32px] px-1.5 sm:px-2 py-1 sm:py-1 text-[10px] sm:text-[10px]
                                ${isSelected
                                    ? 'bg-black text-white ring-1 ring-black'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {size}
                            {isSelected && (
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
                    );
                })}
            </div>
        </div>
    );
}

