import React from 'react';
import { Card } from '@/components/ui/Card';
import { RubroFilter } from './RubroFilter';
import { SubrubroFilter } from './SubrubroFilter';
import { SexoFilter } from './SexoFilter';
import { ColorFilter } from './ColorFilter';
import { TalleFilter } from './TalleFilter';
import { EstadoFilter } from './EstadoFilter';
import { StockRangeFilter } from './StockRangeFilter';
import { OrderByFilter } from './OrderByFilter';
import { useProductosFilters } from '../hooks/useProductosFilters';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProductosFiltersProps {
  filters: ReturnType<typeof useProductosFilters>;
  disabled?: boolean;
}

/**
 * Componente contenedor de todos los filtros de productos
 * Orquesta los filtros individuales sin conocer su lógica interna
 */
export function ProductosFilters({ filters, disabled = false }: ProductosFiltersProps) {
  return (
    <Card variant="elevated" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
          {filters.hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={filters.clearFilters}
              disabled={disabled}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1 inline" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rubro */}
          <div>
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
          <div>
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

          {/* Sexo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sexo
            </label>
            <SexoFilter
              value={filters.filters.sexo}
              onChange={filters.setSexo}
              disabled={disabled}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Color
            </label>
            <ColorFilter
              value={filters.filters.color}
              onChange={filters.setColor}
              disabled={disabled}
            />
          </div>

          {/* Talle */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Talle
            </label>
            <TalleFilter
              value={filters.filters.talle}
              onChange={filters.setTalle}
              disabled={disabled}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Estado
            </label>
            <EstadoFilter
              value={filters.filters.publicado}
              onChange={filters.setPublicado}
              disabled={disabled}
            />
          </div>

          {/* Stock Range */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Stock
            </label>
            <StockRangeFilter
              stockMin={filters.filters.stockMin}
              stockMax={filters.filters.stockMax}
              onChange={filters.setStockRange}
              disabled={disabled}
            />
          </div>

          {/* Ordenamiento */}
          <div className="sm:col-span-2">
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

