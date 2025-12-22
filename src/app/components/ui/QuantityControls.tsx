'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlsProps {
    quantity: number;
    onIncrement: (e?: React.MouseEvent) => void;
    onDecrement: (e?: React.MouseEvent) => void;
    canAddMore?: boolean;
    maxReached?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function QuantityControls({
    quantity,
    onIncrement,
    onDecrement,
    canAddMore = true,
    maxReached = false,
    disabled = false,
    className = '',
}: QuantityControlsProps) {
    return (
        <div className={`flex items-center space-x-2 sm:space-x-1 bg-gray-100 rounded-lg p-1 sm:p-0.5 ${className}`}>
            {/* Botón Decremento */}
            <motion.button
                className={`w-8 h-8 sm:w-5 sm:h-5 flex items-center justify-center rounded transition-all ${
                    quantity <= 1 || disabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-50 shadow-sm'
                }`}
                onClick={onDecrement}
                disabled={quantity <= 1 || disabled}
                whileHover={quantity > 1 && !disabled ? { scale: 1.1 } : {}}
                whileTap={quantity > 1 && !disabled ? { scale: 0.95 } : {}}
                aria-label="Disminuir cantidad"
            >
                <Minus className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
            </motion.button>

            {/* Cantidad */}
            <span className={`w-8 sm:w-6 text-center font-bold text-sm sm:text-xs ${
                maxReached ? 'text-gray-500' : 'text-black'
            }`}>
                {quantity}
            </span>

            {/* Botón Incremento */}
            <motion.button
                className={`w-8 h-8 sm:w-5 sm:h-5 flex items-center justify-center rounded transition-all ${
                    !canAddMore || maxReached || disabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-50 shadow-sm'
                }`}
                onClick={onIncrement}
                disabled={!canAddMore || maxReached || disabled}
                whileHover={canAddMore && !maxReached && !disabled ? { scale: 1.1 } : {}}
                whileTap={canAddMore && !maxReached && !disabled ? { scale: 0.95 } : {}}
                aria-label="Aumentar cantidad"
            >
                <Plus className="w-4 h-4 sm:w-2.5 sm:h-2.5" />
            </motion.button>
        </div>
    );
}

