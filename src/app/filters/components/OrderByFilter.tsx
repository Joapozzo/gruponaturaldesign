import React from 'react';
import { ORDER_BY_OPTIONS, ORDER_DIRECTION_OPTIONS } from '../mocks/productosFilters.mock';

interface OrderByFilterProps {
  orderBy?: 'name' | 'price';
  orderDirection?: 'asc' | 'desc';
  onOrderByChange: (orderBy: 'name' | 'price' | undefined) => void;
  onOrderDirectionChange: (orderDirection: 'asc' | 'desc' | undefined) => void;
}

/**
 * Filtro de ordenamiento
 */
export function OrderByFilter({
  orderBy,
  orderDirection,
  onOrderByChange,
  onOrderDirectionChange,
}: OrderByFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={orderBy || ''}
        onChange={(e) => onOrderByChange((e.target.value as 'name' | 'price') || undefined)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
      >
        <option value="">Sin ordenar</option>
        {ORDER_BY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {orderBy && (
        <select
          value={orderDirection || 'asc'}
          onChange={(e) => onOrderDirectionChange((e.target.value as 'asc' | 'desc') || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          {ORDER_DIRECTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

