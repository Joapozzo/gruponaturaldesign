'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BordadoSwitchProps {
    value: boolean;
    onChange: (value: boolean) => void;
    isMobile?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const BordadoSwitch: React.FC<BordadoSwitchProps> = ({
    value,
    onChange,
    isMobile = false,
    disabled = false,
    size = 'medium',
}) => {
    // Determinar tamaños según el prop size
    const sizeClasses = {
        small: {
            container: 'text-xs gap-1.5',
            label: 'text-xs',
            switch: 'h-5 w-9',
            thumb: 'h-3.5 w-3.5',
            thumbX: 20,
            text: 'text-xs',
        },
        medium: {
            container: 'text-sm gap-2',
            label: 'text-sm',
            switch: 'h-6 w-11',
            thumb: 'h-4 w-4',
            thumbX: 24,
            text: 'text-sm',
        },
        large: {
            container: 'text-base gap-3',
            label: 'text-base',
            switch: 'h-7 w-12',
            thumb: 'h-5 w-5',
            thumbX: 28,
            text: 'text-base',
        },
    };

    const sizes = sizeClasses[size];
    const actualSizes = isMobile ? sizeClasses.small : sizes;

    return (
        <div className={`flex items-center ${actualSizes.container}`}>
            <span className={`font-medium text-gray-700 ${actualSizes.label}`}>
                Bordado:
            </span>
            <button
                type="button"
                onClick={() => !disabled && onChange(!value)}
                disabled={disabled}
                className={`
                    relative inline-flex items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                    ${value ? 'bg-red-600' : 'bg-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${actualSizes.switch}
                `}
                aria-label={value ? 'Bordado activado' : 'Bordado desactivado'}
            >
                <motion.span
                    className={`
                        inline-block transform rounded-full bg-white transition-transform
                        ${actualSizes.thumb}
                    `}
                    animate={{
                        x: value ? actualSizes.thumbX : 2,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                    }}
                />
            </button>
            <span className={`font-semibold ${value ? 'text-red-600' : 'text-gray-500'} ${actualSizes.text}`}>
                {value ? 'SÍ' : 'NO'}
            </span>
        </div>
    );
};

export default BordadoSwitch;

