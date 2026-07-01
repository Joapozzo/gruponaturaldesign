import React from 'react';

type SelectVariant =
    | 'blackOutline'
    | 'charcoalOutline'
    | 'darkGrayOutline'
    | 'grayOutline'
    | 'mediumGrayOutline'
    | 'lightGrayOutline'
    | 'ghost';

type SelectSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    variant?: SelectVariant;
    size?: SelectSize;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    className?: string;
    selectClassName?: string;
}

const variantClasses: Record<SelectVariant, string> = {
    blackOutline: 'border-2 border-gray-900 text-gray-900 bg-white hover:border-black focus:border-black',
    charcoalOutline: 'border-2 border-gray-800 text-gray-800 bg-white hover:border-gray-700 focus:border-gray-700',
    darkGrayOutline: 'border-2 border-gray-700 text-gray-700 bg-white hover:border-gray-600 focus:border-gray-600',
    grayOutline: 'border-2 border-gray-600 text-gray-600 bg-white hover:border-gray-500 focus:border-gray-500',
    mediumGrayOutline: 'border-2 border-gray-500 text-gray-500 bg-white hover:border-gray-400 focus:border-gray-400',
    lightGrayOutline: 'border-2 border-gray-200 text-gray-700 bg-white hover:border-gray-300 focus:border-gray-500',
    ghost: 'border border-gray-200 text-gray-700 bg-white hover:border-gray-300 focus:border-gray-500',
};

const sizeClasses: Record<SelectSize, string> = {
    xs: 'h-8 pl-6 pr-8 text-base sm:text-[10px]',
    sm: 'h-9 sm:h-[36px] pl-6 pr-8 text-base sm:text-[11px] sm:text-xs',
    md: 'h-[36px] pl-7 pr-9 text-base sm:text-xs',
    lg: 'h-10 pl-8 pr-10 text-base sm:text-sm',
};

const sizeClassesWithIcon: Record<SelectSize, string> = {
    xs: 'pl-7',
    sm: 'pl-7',
    md: 'pl-8',
    lg: 'pl-9',
};

const labelSizeClasses: Record<SelectSize, string> = {
    xs: 'text-[10px] h-[14px]',
    sm: 'text-[10px] sm:text-xs h-[14px] sm:h-[16px]',
    md: 'text-xs h-4',
    lg: 'text-xs sm:text-sm h-4',
};

const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    variant = 'lightGrayOutline',
    size = 'sm',
    fullWidth = false,
    leftIcon,
    className = '',
    selectClassName = '',
    disabled,
    ...rest
}) => {
    const baseSelectClasses =
        'font-semibold rounded-sm transition-all duration-200 outline-none cursor-pointer appearance-none w-full';

    const focusClasses = 'focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const widthClasses = fullWidth ? 'w-full' : '';

    const selectClasses = [
        baseSelectClasses,
        variantClasses[variant],
        sizeClasses[size],
        leftIcon ? sizeClassesWithIcon[size] : '',
        focusClasses,
        disabledClasses,
        widthClasses,
        selectClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
            {label && (
                <label className="font-medium text-gray-700 mb-0.5 sm:mb-1 flex items-end">
                    <span className={labelSizeClasses[size]}>{label}</span>
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none [&>svg]:w-3 [&>svg]:h-3">
                        {leftIcon}
                    </div>
                )}
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={selectClasses}
                    {...rest}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Select;
export type { SelectVariant, SelectSize };
