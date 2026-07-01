'use client';

import React, { forwardRef } from 'react';

type InputVariant = 'default' | 'error';

type InputSize = 'sm' | 'md';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: InputVariant;
    size?: InputSize;
    className?: string;
}

const variantClasses: Record<InputVariant, string> = {
    default: 'border-gray-300',
    error: 'border-red-500',
};

const sizeClasses: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-sm',
    md: 'px-4 py-2.5 text-base',
};

const baseClasses =
    'w-full border focus:outline-none focus:ring-2 focus:ring-[#Ed3237] placeholder:text-gray-400/60 transition-colors';

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            variant = 'default',
            size = 'sm',
            className = '',
            ...props
        },
        ref
    ) => {
        const inputClasses = [
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return <input ref={ref} className={inputClasses} {...props} />;
    }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: InputVariant;
    size?: InputSize;
    className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            variant = 'default',
            size = 'sm',
            className = '',
            ...props
        },
        ref
    ) => {
        const inputClasses = [
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            'min-h-[80px] resize-y',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return <textarea ref={ref} className={inputClasses} {...props} />;
    }
);

TextArea.displayName = 'TextArea';

export default Input;
export { TextArea };
export type { InputProps, TextAreaProps, InputVariant, InputSize };
