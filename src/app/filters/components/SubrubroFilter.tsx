import React from 'react';
import { MOCK_SUBRUBROS } from '../mocks/productosFilters.mock';

interface SubrubroFilterProps {
  value?: number;
  rubroId?: number;
  onChange: (subrubroId: number | undefined) => void;
}

/**
 * Filtro de subrubro
 * Depende del rubro seleccionado
 */
export function SubrubroFilter({ value, rubroId, onChange }: SubrubroFilterProps) {
  const subrubros = rubroId
    ? MOCK_SUBRUBROS.filter((sub) => sub.rubroId === rubroId)
    : [];

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
      disabled={!rubroId || subrubros.length === 0}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">
        {rubroId ? (subrubros.length === 0 ? 'Sin subrubros' : 'Todos los subrubros') : 'Selecciona un rubro primero'}
      </option>
      {subrubros.map((subrubro) => (
        <option key={subrubro.id} value={subrubro.id}>
          {subrubro.nombre}
        </option>
      ))}
    </select>
  );
}

