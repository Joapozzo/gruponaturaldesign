'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
import type { AuditEntity, AuditAction } from '@/app/types/audit.types';
import type { useAuditoriaFilters } from '@/app/filters/hooks/useAuditoriaFilters';

const ENTITY_OPTIONS: { value: AuditEntity | ''; label: string }[] = [
  { value: '', label: 'Todas las entidades' },
  { value: 'producto_padre', label: 'Producto padre' },
  { value: 'producto_web', label: 'Producto web' },
  { value: 'producto_precio', label: 'Precio' },
  { value: 'producto_imagen', label: 'Imagen' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'pedido', label: 'Pedido' },
  { value: 'usuario', label: 'Usuario' },
  { value: 'sesion', label: 'Sesión' },
  { value: 'rubro', label: 'Rubro' },
  { value: 'subrubro', label: 'Subrubro' },
  { value: 'sync', label: 'Sync' },
  { value: 'otro', label: 'Otro' },
];

const ACTION_OPTIONS: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'CREATE', label: 'Crear' },
  { value: 'UPDATE', label: 'Actualizar' },
  { value: 'DELETE', label: 'Eliminar' },
];

const METHOD_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
];

interface AuditoriaFiltersProps {
  filters: ReturnType<typeof useAuditoriaFilters>;
  disabled?: boolean;
}

export function AuditoriaFilters({ filters, disabled = false }: AuditoriaFiltersProps) {
  return (
    <Card variant="elevated" padding="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
          {filters.hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={filters.clearFilters} disabled={disabled} className="text-xs">
              <X className="w-3 h-3 mr-1 inline" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Entidad</label>
            <select
              value={filters.filters.entity ?? ''}
              onChange={(e) => filters.setEntity((e.target.value as AuditEntity) || undefined)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {ENTITY_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Acción</label>
            <select
              value={filters.filters.action ?? ''}
              onChange={(e) => filters.setAction((e.target.value as AuditAction) || undefined)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Método HTTP</label>
            <select
              value={filters.filters.method ?? ''}
              onChange={(e) => filters.setMethod(e.target.value || undefined)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {METHOD_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Usuario (email)</label>
            <input
              type="text"
              value={filters.filters.userEmail ?? ''}
              onChange={(e) => filters.setUserEmail(e.target.value || undefined)}
              placeholder="Buscar por email..."
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Desde fecha</label>
            <input
              type="date"
              value={filters.filters.dateFrom ?? ''}
              onChange={(e) => filters.setDateRange(e.target.value || undefined, filters.filters.dateTo)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hasta fecha</label>
            <input
              type="date"
              value={filters.filters.dateTo ?? ''}
              onChange={(e) => filters.setDateRange(filters.filters.dateFrom, e.target.value || undefined)}
              disabled={disabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
