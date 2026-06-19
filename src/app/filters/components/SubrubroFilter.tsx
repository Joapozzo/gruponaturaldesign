import React from 'react';
import { useSubrubros } from '@/app/hooks/useSubrubros';
import { getEmpresaId } from '@/app/utils/getEmpresaId';

interface SubrubroFilterProps {
  value?: number;
  rubroId?: number;
  onChange: (subrubroId: number | undefined) => void;
  disabled?: boolean;
}

/**
 * Filtro de subrubro
 * Depende del rubro seleccionado
 * Obtiene los subrubros dinámicamente desde SFactory vía API
 */
export function SubrubroFilter({ value, rubroId, onChange, disabled = false }: SubrubroFilterProps) {
  const empresaId = getEmpresaId();
  const { data: subrubrosResponse, isLoading } = useSubrubros({
    empresaId,
    rubroId: rubroId || undefined,
    visibleWeb: true,
  });

  const subrubros = subrubrosResponse?.data || [];

  const isDisabled = disabled || !rubroId || isLoading || subrubros.length === 0;

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
      disabled={isDisabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">
        {isLoading && rubroId
          ? 'Cargando subrubros...'
          : !rubroId
          ? 'Selecciona un rubro primero'
          : subrubros.length === 0
          ? 'Sin subrubros'
          : 'Todos los subrubros'}
      </option>
      {subrubros.map((subrubro) => (
        <option key={subrubro.id} value={subrubro.id}>
          {subrubro.nombre}
        </option>
      ))}
    </select>
  );
}

