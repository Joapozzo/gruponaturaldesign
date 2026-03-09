import React from 'react';
import { Card } from '@/components/ui/Card';
import { RubroFilter } from './RubroFilter';
import { SubrubroFilter } from './SubrubroFilter';
import { SexoFilter } from './SexoFilter';
import { EstadoFilter } from './EstadoFilter';
import { OrderByFilter } from './OrderByFilter';
import { useProductosFilters } from '../hooks/useProductosFilters';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProductosFiltersProps {
  filters: ReturnType<typeof useProductosFilters>;
  disabled?: boolean;
  /** Si hay texto en el input de búsqueda; cuando es true también se muestra "Limpiar filtros". */
  hasSearchTerm?: boolean;
  /** Se llama al hacer clic en "Limpiar filtros" (además de filters.clearFilters). Útil para limpiar también el input de búsqueda. */
  onClearFilters?: () => void;
}

/**
 * Componente contenedor de todos los filtros de productos
 * Orquesta los filtros individuales sin conocer su lógica interna
 */
export function ProductosFilters({ filters, disabled = false, hasSearchTerm = false, onClearFilters }: ProductosFiltersProps) {
  const handleClearFilters = () => {
    filters.clearFilters();
    onClearFilters?.();
  };

  const showClearButton = filters.hasActiveFilters || hasSearchTerm;

  return (
    <Card variant="elevated" padding="md" className="min-w-0 max-w-full overflow-hidden">
      <div className="space-y-4 min-w-0">
        {/* Header: responsive, no overflow */}
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-gray-700 shrink-0">Filtros</h3>
          {showClearButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              disabled={disabled}
              className="text-xs shrink-0"
            >
              <X className="w-3 h-3 mr-1 inline" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Grid responsive: 1 col móvil, 2 sm, 3 md, 5 xl; celdas con min-w-0 para no salirse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 min-w-0">
          {/* Rubro */}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Rubro
            </label>
            <RubroFilter
              value={filters.filters.rubroId}
              onChange={filters.setRubroId}
              disabled={disabled}
            />
          </div>

          {/* Subrubro */}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Subrubro
            </label>
            <SubrubroFilter
              value={filters.filters.subrubroId}
              rubroId={filters.filters.rubroId}
              onChange={filters.setSubrubroId}
              disabled={disabled}
            />
          </div>

          {/* Género */}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Género
            </label>
            <SexoFilter
              value={filters.filters.sexo}
              onChange={filters.setSexo}
              disabled={disabled}
            />
          </div>

          {/* Estado */}
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Estado
            </label>
            <EstadoFilter
              value={filters.filters.publicado}
              onChange={filters.setPublicado}
              disabled={disabled}
            />
          </div>

          {/* Ordenamiento: puede ocupar más de una col en móvil si hace falta */}
          <div className="min-w-0 sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ordenar por
            </label>
            <OrderByFilter
              orderBy={filters.filters.orderBy}
              orderDirection={filters.filters.orderDirection}
              onOrderByChange={filters.setOrderBy}
              onOrderDirectionChange={filters.setOrderDirection}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

