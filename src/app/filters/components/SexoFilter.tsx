import React from 'react';
import { SEXO_OPTIONS } from '../mocks/productosFilters.mock';

interface SexoFilterProps {
  value?: string;
  onChange: (sexo: string | undefined) => void;
}

/**
 * Filtro de sexo
 */
export function SexoFilter({ value, onChange }: SexoFilterProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
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

