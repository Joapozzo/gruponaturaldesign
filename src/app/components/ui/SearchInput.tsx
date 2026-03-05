'use client';

import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

type SearchInputVariant =
    | 'blackOutline'
    | 'charcoalOutline'
    | 'darkGrayOutline'
    | 'grayOutline'
    | 'mediumGrayOutline'
    | 'lightGrayOutline'
    | 'ghost';

type SearchInputSize = 'xs' | 'sm' | 'md' | 'lg';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    variant?: SearchInputVariant;
    size?: SearchInputSize;
    fullWidth?: boolean;
    onClear?: () => void;
    showClearButton?: boolean;
    leftIcon?: React.ReactNode;
    className?: string;
    inputClassName?: string;
}

const variantClasses: Record<SearchInputVariant, string> = {
    blackOutline: 'border-2 border-gray-900 text-gray-900 bg-white hover:border-black focus:border-black',
    charcoalOutline: 'border-2 border-gray-800 text-gray-800 bg-white hover:border-gray-700 focus:border-gray-700',
    darkGrayOutline: 'border-2 border-gray-700 text-gray-700 bg-white hover:border-gray-600 focus:border-gray-600',
    grayOutline: 'border-2 border-gray-600 text-gray-600 bg-white hover:border-gray-500 focus:border-gray-500',
    mediumGrayOutline: 'border-2 border-gray-500 text-gray-500 bg-white hover:border-gray-400 focus:border-gray-400',
    lightGrayOutline: 'border-2 border-gray-200 text-gray-700 bg-white hover:border-gray-300 focus:border-gray-500',
    ghost: 'border border-gray-200 text-gray-700 bg-white hover:border-gray-300 focus:border-gray-500',
};

const sizeClasses: Record<SearchInputSize, string> = {
    xs: 'h-8 pl-7 pr-8 text-[10px]',
    sm: 'h-9 sm:h-[36px] pl-7 pr-8 text-[11px] sm:text-xs',
    md: 'h-[36px] pl-8 pr-9 text-xs',
    lg: 'h-10 pl-8 pr-10 text-sm',
};

const sizeClassesWithClear: Record<SearchInputSize, string> = {
    xs: 'pr-9',
    sm: 'pr-10',
    md: 'pr-10',
    lg: 'pr-12',
};

const labelSizeClasses: Record<SearchInputSize, string> = {
    xs: 'text-[10px] h-[14px]',
    sm: 'text-[10px] sm:text-xs h-[14px] sm:h-[16px]',
    md: 'text-xs h-4',
    lg: 'text-xs sm:text-sm h-4',
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            label,
            variant = 'lightGrayOutline',
            size = 'sm',
            fullWidth = false,
            onClear,
            showClearButton = true,
            leftIcon,
            className = '',
            inputClassName = '',
            ...props
        },
        ref
    ) => {
        const hasValue = props.value != null && String(props.value).length > 0;
        const showClear = showClearButton && hasValue && onClear;

        const baseInputClasses =
            'font-semibold rounded-sm transition-all duration-200 outline-none w-full placeholder-gray-400';

        const focusClasses = 'focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';

        const inputClasses = [
            baseInputClasses,
            variantClasses[variant],
            sizeClasses[size],
            showClear ? sizeClassesWithClear[size] : '',
            focusClasses,
            fullWidth ? 'w-full' : '',
            inputClassName,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'} flex-1 min-w-0 ${className}`}>
                {label && (
                    <label className="font-medium text-gray-700 mb-0.5 sm:mb-1 flex items-end">
                        <span className={labelSizeClasses[size]}>{label}</span>
                    </label>
                )}
                <div className="relative">
                    {leftIcon !== undefined ? (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none [&>svg]:w-3 [&>svg]:h-3">
                            {leftIcon}
                        </div>
                    ) : (
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
                    )}
                    <input
                        ref={ref}
                        type="text"
                        className={inputClasses}
                        {...props}
                    />
                    {showClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
export type { SearchInputVariant, SearchInputSize };
