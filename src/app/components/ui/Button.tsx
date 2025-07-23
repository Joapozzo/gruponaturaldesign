import React from 'react';

// Tipos para las variantes de color
type ColorVariant =
    | 'black'
    | 'charcoal'
    | 'slate'
    | 'darkGray'
    | 'gray'
    | 'mediumGray'
    | 'lightGray'
    | 'silver'
    | 'ash'
    | 'lightWhite'
    | 'blackOutline'
    | 'charcoalOutline'
    | 'slateOutline'
    | 'darkGrayOutline'
    | 'grayOutline'
    | 'mediumGrayOutline'
    | 'lightGrayOutline'
    | 'lightWhiteOutline'
    | 'red'
    | 'redOutline'
    | 'ghost'
    | 'ghostDark'
    | 'minimal';

// Tipos para los tamaños
type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Interface para las props del componente
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ColorVariant;
    size?: SizeVariant;
    outline?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'black',
    size = 'md',
    outline = false,
    disabled = false,
    fullWidth = false,
    className = '',
    onClick,
    ...props
}) => {
    // Variantes de colores
    const colorVariants: Record<ColorVariant, string> = {
        // Negros y grises sólidos
        black: 'bg-black hover:bg-gray-900 text-white',
        charcoal: 'bg-gray-900 hover:bg-gray-800 text-white',
        slate: 'bg-gray-800 hover:bg-gray-700 text-white',
        darkGray: 'bg-gray-700 hover:bg-gray-600 text-white',
        gray: 'bg-gray-600 hover:bg-gray-500 text-white',
        mediumGray: 'bg-gray-500 hover:bg-gray-400 text-white',
        lightGray: 'bg-gray-400 hover:bg-gray-300 text-gray-900',
        silver: 'bg-gray-300 hover:bg-gray-200 text-gray-900',
        ash: 'bg-gray-200 hover:bg-gray-100 text-gray-900',
        lightWhite: 'bg-gray-200 hover:bg-gray-100 text-gray-900',

        // Variantes outline negros/grises
        blackOutline: 'border-2 border-black text-black hover:bg-black hover:text-white',
        charcoalOutline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
        slateOutline: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
        darkGrayOutline: 'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white',
        grayOutline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
        mediumGrayOutline: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white',
        lightGrayOutline: 'border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white',
        lightWhiteOutline: 'border-2 border-gray-100 text-gray-100 hover:bg-gray-200 hover:text-black',

        // Rojo sólido y outline
        red: 'bg-red-600 hover:bg-red-700 text-white',
        redOutline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',

        // Variantes especiales monocromáticas
        ghost: 'text-gray-700 hover:bg-gray-100',
        ghostDark: 'text-gray-300 hover:bg-gray-800',
        minimal: 'text-gray-600 hover:text-black underline-offset-4 hover:underline',
    };

    // Tamaños
    const sizeVariants: Record<SizeVariant, string> = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
        xxl: 'px-12 py-5 text-2xl',
    };

    // Si es outline, usar la variante outline correspondiente
    const getVariant = (): ColorVariant => {
        if (outline && !variant.includes('Outline') && !['ghost', 'ghostDark', 'minimal'].includes(variant)) {
            return `${variant}Outline` as ColorVariant;
        }
        return variant;
    };

    // Clases base
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:scale-95 cursor-pointer select-none';

    // Clases para disabled
    const disabledClasses = 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100';

    // Clases para ancho completo
    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses = `
        ${baseClasses}
        ${colorVariants[getVariant()]}
        ${sizeVariants[size]}
        ${disabled ? disabledClasses : ''}
        ${widthClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={buttonClasses}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

// Exportar también los tipos por si los necesitas en otros lados
export type { ButtonProps, ColorVariant, SizeVariant };