'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
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
  | 'brandRed'
  | 'brandRedOutline'
  | 'ghost'
  | 'ghostDark'
  | 'minimal';

type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ColorVariant;
  size?: SizeVariant;
  outline?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const colorVariants: Record<ColorVariant, string> = {
  primary: 'bg-black hover:bg-gray-900 text-white border border-black hover:border-gray-900',
  secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
  danger: 'bg-[#Ed3237] hover:bg-[#A80006] text-white',
  black: 'bg-black hover:bg-gray-900 text-white border border-black hover:border-gray-900',
  charcoal: 'bg-gray-900 hover:bg-gray-800 text-white',
  slate: 'bg-gray-800 hover:bg-gray-700 text-white',
  darkGray: 'bg-gray-700 hover:bg-gray-600 text-white',
  gray: 'bg-gray-600 hover:bg-gray-500 text-white',
  mediumGray: 'bg-gray-500 hover:bg-gray-400 text-white',
  lightGray: 'bg-gray-400 hover:bg-gray-300 text-gray-900',
  silver: 'bg-gray-300 hover:bg-gray-200 text-gray-900',
  ash: 'bg-gray-200 hover:bg-gray-100 text-gray-900',
  lightWhite: 'bg-gray-200 hover:bg-gray-100 text-gray-900',
  blackOutline: 'border-2 border-black text-black hover:bg-black hover:text-white',
  charcoalOutline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  slateOutline: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
  darkGrayOutline: 'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white',
  grayOutline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
  mediumGrayOutline: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white',
  lightGrayOutline: 'border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white',
  lightWhiteOutline: 'border-2 border-gray-100 text-gray-100 hover:bg-gray-200 hover:text-black',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  redOutline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
  brandRed: 'bg-[#Ed3237] hover:bg-[#A80006] text-white',
  brandRedOutline: 'border-2 border-[#Ed3237] text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white',
  ghost: 'text-gray-700 hover:bg-gray-100',
  ghostDark: 'text-gray-300 hover:bg-gray-800',
  minimal: 'text-gray-600 hover:text-black underline-offset-4 hover:underline',
};

const sizeVariants: Record<SizeVariant, string> = {
  xs: 'px-3 py-1.5 text-[10px]',
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-7 py-3 text-sm',
  xl: 'px-8 py-3.5 text-base',
  xxl: 'px-10 py-4 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'black',
      size = 'md',
      outline = false,
      disabled = false,
      fullWidth = false,
      className = '',
      loading = false,
      leftIcon,
      rightIcon,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const getVariant = (): ColorVariant => {
      if (outline && !variant.includes('Outline') && !['ghost', 'ghostDark', 'minimal', 'brandRed', 'primary', 'secondary', 'danger'].includes(variant)) {
        return `${variant}Outline` as ColorVariant;
      }
      return variant;
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer select-none inline-flex flex-row items-center justify-center gap-2',
          isDisabled && 'opacity-50 cursor-not-allowed',
          fullWidth && 'w-full',
          colorVariants[getVariant()],
          sizeVariants[size],
          className
        )}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
export type { ButtonProps, ColorVariant, SizeVariant };
