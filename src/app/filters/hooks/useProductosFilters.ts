import { useState, useCallback, useMemo } from 'react';

export interface ProductosFilters {
  rubroId?: number;
  subrubroId?: number;
  sexo?: string;
  color?: string;
  talle?: string;
  stockMin?: number;
  stockMax?: number;
  publicado?: boolean;
  orderBy?: 'name' | 'price';
  orderDirection?: 'asc' | 'desc';
}

interface UseProductosFiltersOptions {
  initialFilters?: Partial<ProductosFilters>;
}

/**
 * Hook centralizado para manejar todos los filtros de productos
 * No conoce la tabla ni React Query, solo maneja estado
 */
export function useProductosFilters(options: UseProductosFiltersOptions = {}) {
  const [filters, setFilters] = useState<ProductosFilters>({
    orderBy: 'name',
    orderDirection: 'asc',
    ...options.initialFilters,
  });

  // Setters individuales
  const setRubroId = useCallback((rubroId: number | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, rubroId };
      // Si cambia el rubro, limpiar subrubro
      if (rubroId !== prev.rubroId) {
        newFilters.subrubroId = undefined;
      }
      return newFilters;
    });
  }, []);

  const setSubrubroId = useCallback((subrubroId: number | undefined) => {
    setFilters((prev) => ({ ...prev, subrubroId }));
  }, []);

  const setSexo = useCallback((sexo: string | undefined) => {
    setFilters((prev) => ({ ...prev, sexo }));
  }, []);

  const setColor = useCallback((color: string | undefined) => {
    setFilters((prev) => ({ ...prev, color }));
  }, []);

  const setTalle = useCallback((talle: string | undefined) => {
    setFilters((prev) => ({ ...prev, talle }));
  }, []);

  const setPublicado = useCallback((publicado: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, publicado }));
  }, []);

  const setStockRange = useCallback((stockMin?: number, stockMax?: number) => {
    setFilters((prev) => ({
      ...prev,
      stockMin,
      stockMax,
    }));
  }, []);

  const setOrderBy = useCallback((orderBy: 'name' | 'price' | undefined) => {
    setFilters((prev) => ({ ...prev, orderBy }));
  }, []);

  const setOrderDirection = useCallback((orderDirection: 'asc' | 'desc' | undefined) => {
    setFilters((prev) => ({ ...prev, orderDirection }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      orderBy: 'name',
      orderDirection: 'asc',
    });
  }, []);

  // Filtros activos (sin valores undefined)
  const activeFilters = useMemo(() => {
    const active: Record<string, string | number | boolean> = {};
    if (filters.rubroId !== undefined) active.rubroId = filters.rubroId;
    if (filters.subrubroId !== undefined) active.subrubroId = filters.subrubroId;
    if (filters.sexo) active.sexo = filters.sexo;
    if (filters.color) active.color = filters.color;
    if (filters.talle) active.talle = filters.talle;
    if (filters.publicado !== undefined) active.publicado = filters.publicado;
    if (filters.stockMin !== undefined) active.stockMin = filters.stockMin;
    if (filters.stockMax !== undefined) active.stockMax = filters.stockMax;
    if (filters.orderBy) active.orderBy = filters.orderBy;
    if (filters.orderDirection) active.orderDirection = filters.orderDirection;
    return active;
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 2; // Más que orderBy y orderDirection
  }, [activeFilters]);

  return {
    filters,
    activeFilters,
    hasActiveFilters,
    setRubroId,
    setSubrubroId,
    setSexo,
    setColor,
    setTalle,
    setPublicado,
    setStockRange,
    setOrderBy,
    setOrderDirection,
    clearFilters,
  };
}

