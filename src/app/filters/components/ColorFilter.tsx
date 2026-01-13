import React from 'react';
import { COLOR_OPTIONS } from '../mocks/productosFilters.mock';

interface ColorFilterProps {
  value?: string;
  onChange: (color: string | undefined) => void;
}

/**
 * Filtro de color
 */
export function ColorFilter({ value, onChange }: ColorFilterProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
    >
      <option value="">Todos los colores</option>
      {COLOR_OPTIONS.map((color) => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
  );
}

