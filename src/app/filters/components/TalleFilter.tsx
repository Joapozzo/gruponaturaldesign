import React from 'react';
import { TALLE_OPTIONS } from '../mocks/productosFilters.mock';

interface TalleFilterProps {
  value?: string;
  onChange: (talle: string | undefined) => void;
}

/**
 * Filtro de talle
 */
export function TalleFilter({ value, onChange }: TalleFilterProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
    >
      <option value="">Todos los talles</option>
      {TALLE_OPTIONS.map((talle) => (
        <option key={talle} value={talle}>
          {talle}
        </option>
      ))}
    </select>
  );
}

