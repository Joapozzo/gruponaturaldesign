import React from 'react';
import { MOCK_RUBROS } from '../mocks/productosFilters.mock';

interface RubroFilterProps {
  value?: number;
  onChange: (rubroId: number | undefined) => void;
}

/**
 * Filtro de rubro
 * Componente independiente con responsabilidad única
 */
export function RubroFilter({ value, onChange }: RubroFilterProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
    >
      <option value="">Todos los rubros</option>
      {MOCK_RUBROS.map((rubro) => (
        <option key={rubro.id} value={rubro.id}>
          {rubro.nombre}
        </option>
      ))}
    </select>
  );
}

