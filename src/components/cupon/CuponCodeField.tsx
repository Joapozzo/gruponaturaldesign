import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CuponCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onAplicar: () => void;
  isLoading: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function CuponCodeField({
  value,
  onChange,
  onAplicar,
  isLoading,
  disabled,
  error,
  className,
}: CuponCodeFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor="cupon-codigo" className="text-sm font-medium text-gray-700">
        Código de cupón
      </label>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <Input
            id="cupon-codigo"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="Ingresá tu código"
            disabled={disabled}
            className={cn(error && 'border-red-500')}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <Button
          variant="black"
          onClick={onAplicar}
          disabled={disabled || !value.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
        </Button>
      </div>
    </div>
  );
}