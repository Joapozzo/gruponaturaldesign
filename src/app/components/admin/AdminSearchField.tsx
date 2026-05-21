'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminSearchDropdown } from './AdminSearchDropdown';

interface AdminSearchFieldProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function AdminSearchField({
  className,
  inputClassName,
  placeholder = 'Buscar productos, pedidos...',
  autoFocus = false,
}: AdminSearchFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm',
          inputClassName
        )}
        aria-label="Búsqueda admin"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      <AdminSearchDropdown
        query={query}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={() => setQuery('')}
      />
    </div>
  );
}
