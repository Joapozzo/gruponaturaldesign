'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Input from '@/app/components/ui/Input';
import { checkoutControlClass } from '@/app/components/checkout/CheckoutStep2FormField';
import { cn } from '@/lib/utils';

export type CheckoutComboboxOption = { id: string; nombre: string };

const autofillStyle = { color: '#000000' as const, backgroundColor: '#ffffff' as const };

function normalizeSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export interface CheckoutComboboxProps {
  options: CheckoutComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  loading?: boolean;
  id?: string;
}

export function CheckoutCombobox({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  error,
  touched,
  loading,
  id: idProp,
}: CheckoutComboboxProps) {
  const reactId = useId();
  const listId = `${reactId}-listbox`;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = normalizeSearch(value.trim());
    if (!q) return options;
    return options.filter((o) => normalizeSearch(o.nombre).includes(q));
  }, [options, value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selectOption = useCallback(
    (nombre: string) => {
      onChange(nombre);
      setOpen(false);
      setHighlighted(-1);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && open && highlighted >= 0 && filtered[highlighted]) {
      e.preventDefault();
      selectOption(filtered[highlighted].nombre);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Input
          id={idProp}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          variant={error && touched ? 'error' : 'default'}
          size="sm"
          disabled={disabled}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => {
            if (!disabled && !loading) setOpen(true);
          }}
          onBlur={() => {
            setOpen(false);
            setHighlighted(-1);
            onBlur();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(checkoutControlClass, loading || disabled ? 'pr-9' : undefined)}
          style={autofillStyle}
        />
        {loading ? (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          </span>
        ) : null}
      </div>

      {open && !disabled && !loading && filtered.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-0.5 max-h-52 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 text-xs shadow-md sm:text-sm"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.id}
              role="option"
              aria-selected={highlighted === i}
              className={cn(
                'cursor-pointer px-2 py-1.5 text-black sm:px-3',
                highlighted === i ? 'bg-gray-100' : 'hover:bg-gray-50'
              )}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => selectOption(opt.nombre)}
            >
              {opt.nombre}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
