import React from 'react';
import { useRubros } from '@/app/hooks/useRubros';
import { getEmpresaId } from '@/app/utils/getEmpresaId';

interface RubroFilterProps {
  value?: number;
  onChange: (rubroId: number | undefined) => void;
  disabled?: boolean;
}

/**
 * Filtro de rubro
 * Componente independiente con responsabilidad única
 * Obtiene los rubros dinámicamente desde SFactory vía API
 */
export function RubroFilter({ value, onChange, disabled = false }: RubroFilterProps) {
  const empresaId = getEmpresaId();
  const { data: rubrosResponse, isLoading } = useRubros({ 
    empresaId, 
    visibleWeb: true,
    includeSubrubros: false 
  });

  const rubros = rubrosResponse?.data || [];

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
      disabled={disabled || isLoading}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">
        {isLoading ? 'Cargando rubros...' : 'Todos los rubros'}
      </option>
      {rubros.map((rubro) => (
        <option key={rubro.id} value={rubro.id}>
          {rubro.nombre}
        </option>
      ))}
    </select>
  );
}

