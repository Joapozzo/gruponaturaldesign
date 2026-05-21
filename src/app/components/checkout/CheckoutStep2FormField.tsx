'use client';

import type { ReactNode } from 'react';
import Input, { TextArea, type InputProps, type TextAreaProps } from '@/app/components/ui/Input';
import { cn } from '@/lib/utils';

const labelClassName = 'block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1';

const autofillStyle = { color: '#000000' as const, backgroundColor: '#ffffff' as const };

/** Shared with CheckoutStep2TextInput / CheckoutCombobox — keep border/focus tokens in sync */
export const checkoutControlClass =
  'rounded-lg text-xs sm:text-sm text-black px-2.5 sm:px-3 py-2.5 sm:py-3 focus:ring-0 focus:border-red-600';

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: ReactNode;
  className?: string;
};

export function CheckoutStep2FormField({ label, required, error, touched, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label className={labelClassName}>
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      {children}
      {error && touched ? <p className="text-red-600 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{error}</p> : null}
    </div>
  );
}

type CheckoutTextInputProps = InputProps & {
  error?: string;
  touched?: boolean;
};

export function CheckoutStep2TextInput({ error, touched, className, ...props }: CheckoutTextInputProps) {
  return (
    <Input
      variant={error && touched ? 'error' : 'default'}
      size="sm"
      className={cn(checkoutControlClass, className)}
      style={autofillStyle}
      {...props}
    />
  );
}

const selectClassName =
  'w-full px-2 sm:px-2.5 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-xs sm:text-sm text-black bg-white focus:outline-none focus:border-red-600';

export function CheckoutStep2Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(selectClassName, className)} style={autofillStyle} {...props} />;
}

type CheckoutTextAreaProps = TextAreaProps & {
  error?: string;
  touched?: boolean;
};

export function CheckoutStep2TextArea({ error, touched, className, ...props }: CheckoutTextAreaProps) {
  return (
    <TextArea
      variant={error && touched ? 'error' : 'default'}
      size="sm"
      className={cn('resize-none min-h-0', checkoutControlClass, className)}
      style={autofillStyle}
      {...props}
    />
  );
}
