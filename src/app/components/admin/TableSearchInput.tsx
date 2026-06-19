'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface TableSearchInputProps {
  /** Valor sincronizado con la URL (fuente externa). */
  value: string;
  /** Se invoca tras el debounce cuando el usuario deja de tipear. */
  onDebouncedChange: (value: string) => void;
  /** Limpia input + URL de forma inmediata. */
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  inputClassName?: string;
}

/**
 * Input de búsqueda con estado local para tipeo fluido.
 * El debounce ocurre aquí para no re-renderizar la tabla en cada tecla.
 */
export function TableSearchInput({
  value,
  onDebouncedChange,
  onClear,
  placeholder = 'Buscar...',
  debounceMs = 400,
  showClearButton = false,
  inputClassName = 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black',
}: TableSearchInputProps) {
  const [local, setLocal] = useState(value);
  const lastCommittedRef = useRef(value);

  // Sincronizar desde URL solo cuando cambió externamente (clear, navegación)
  useEffect(() => {
    if (value !== lastCommittedRef.current) {
      setLocal(value);
      lastCommittedRef.current = value;
    }
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== lastCommittedRef.current) {
        lastCommittedRef.current = local;
        onDebouncedChange(local);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [local, debounceMs, onDebouncedChange]);

  const handleClear = () => {
    setLocal('');
    lastCommittedRef.current = '';
    onClear?.();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className={showClearButton && local ? `${inputClassName} pr-9` : inputClassName}
      />
      {showClearButton && local ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}
