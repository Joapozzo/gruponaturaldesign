import React from 'react';

interface EstadoFilterProps {
  value?: boolean;
  onChange: (estado: boolean | undefined) => void;
  disabled?: boolean;
}

/**
 * Filtro de estado (publicado/no publicado)
 */
export function EstadoFilter({ value, onChange, disabled = false }: EstadoFilterProps) {
  return (
    <select
      value={value === undefined ? '' : value ? 'true' : 'false'}
      onChange={(e) => {
        if (e.target.value === '') {
          onChange(undefined);
        } else {
          onChange(e.target.value === 'true');
        }
      }}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Todos</option>
      <option value="true">Publicado</option>
      <option value="false">No publicado</option>
    </select>
  );
}

