import React from 'react';
import { SEXO_OPTIONS } from '../mocks/productosFilters.mock';

interface SexoFilterProps {
  value?: string;
  onChange: (sexo: string | undefined) => void;
  disabled?: boolean;
}

/**
 * Filtro de sexo
 */
export function SexoFilter({ value, onChange, disabled = false }: SexoFilterProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Todos</option>
      {SEXO_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

