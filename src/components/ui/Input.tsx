'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type InputVariant =
  | 'blackOutline'
  | 'charcoalOutline'
  | 'darkGrayOutline'
  | 'grayOutline'
  | 'mediumGrayOutline'
  | 'lightGrayOutline'
  | 'ghost';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<InputVariant, string> = {
  blackOutline:
    'border-2 border-gray-900 text-gray-900 bg-white hover:border-black focus:border-black',
  charcoalOutline:
    'border-2 border-gray-800 text-gray-800 bg-white hover:border-gray-700 focus:border-gray-700',
  darkGrayOutline:
    'border-2 border-gray-700 text-gray-700 bg-white hover:border-gray-600 focus:border-gray-600',
  grayOutline:
    'border-2 border-gray-600 text-gray-700 bg-white hover:border-gray-500 focus:border-gray-500',
  mediumGrayOutline:
    'border-2 border-gray-500 text-gray-700 bg-white hover:border-gray-400 focus:border-gray-400',
  lightGrayOutline:
    'border-2 border-gray-200 text-gray-900 bg-white hover:border-gray-300 focus:border-gray-500',
  ghost:
    'border border-gray-200 text-gray-900 bg-white hover:border-gray-300 focus:border-gray-500',
};

const sizeClasses: Record<InputSize, string> = {
  xs: 'h-8 px-2 text-[11px]',
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-11 px-4 text-base',
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'lightGrayOutline',
      inputSize = 'md',
      error = false,
      fullWidth = true,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'rounded-md font-medium transition-all duration-200 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-50';

    const errorClasses = error
      ? 'border-red-500 hover:border-red-500 focus:border-red-600 text-red-700'
      : '';

    if (leftIcon || rightIcon) {
      return (
        <div className={cn('relative', fullWidth ? 'w-full' : 'w-auto')}>
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[inputSize],
              fullWidth && 'w-full',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              errorClasses,
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[inputSize],
          fullWidth && 'w-full',
          errorClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
export type { InputProps, InputVariant, InputSize };
