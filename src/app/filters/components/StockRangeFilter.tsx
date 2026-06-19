import React from 'react';

interface StockRangeFilterProps {
  stockMin?: number;
  stockMax?: number;
  onChange: (stockMin?: number, stockMax?: number) => void;
  disabled?: boolean;
}

/**
 * Filtro de rango de stock
 */
export function StockRangeFilter({ stockMin, stockMax, onChange, disabled = false }: StockRangeFilterProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange(value, stockMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange(stockMin, value);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Mín"
        value={stockMin || ''}
        onChange={handleMinChange}
        min="0"
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <span className="text-gray-500">-</span>
      <input
        type="number"
        placeholder="Máx"
        value={stockMax || ''}
        onChange={handleMaxChange}
        min="0"
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

