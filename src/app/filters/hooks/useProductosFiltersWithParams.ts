import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProductosFilters, type ProductosFilters } from './useProductosFilters';

/**
 * Hook que sincroniza filtros con search params de URL
 * Extiende useProductosFilters con sincronización URL ↔ estado
 */
export function useProductosFiltersWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useProductosFilters();
  const isInitialMount = useRef(true);
  const isUpdatingFromUrl = useRef(false);

  // Leer filtros de URL al montar
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const urlFilters: Partial<ProductosFilters> = {};

    const rubroId = searchParams.get('rubroId');
    if (rubroId) urlFilters.rubroId = parseInt(rubroId, 10);

    const subrubroId = searchParams.get('subrubroId');
    if (subrubroId) urlFilters.subrubroId = parseInt(subrubroId, 10);

    const sexo = searchParams.get('sexo');
    if (sexo) urlFilters.sexo = sexo;

    const color = searchParams.get('color');
    if (color) urlFilters.color = color;

    const talle = searchParams.get('talle');
    if (talle) urlFilters.talle = talle;

    const stockMin = searchParams.get('stockMin');
    if (stockMin) urlFilters.stockMin = parseInt(stockMin, 10);

    const stockMax = searchParams.get('stockMax');
    if (stockMax) urlFilters.stockMax = parseInt(stockMax, 10);

    const orderBy = searchParams.get('orderBy');
    if (orderBy && (orderBy === 'name' || orderBy === 'price')) {
      urlFilters.orderBy = orderBy;
    }

    const orderDirection = searchParams.get('orderDirection');
    if (orderDirection && (orderDirection === 'asc' || orderDirection === 'desc')) {
      urlFilters.orderDirection = orderDirection;
    }

    // Aplicar filtros iniciales desde URL
    isUpdatingFromUrl.current = true;
    if (urlFilters.rubroId !== undefined) filters.setRubroId(urlFilters.rubroId);
    if (urlFilters.subrubroId !== undefined) filters.setSubrubroId(urlFilters.subrubroId);
    if (urlFilters.sexo) filters.setSexo(urlFilters.sexo);
    if (urlFilters.color) filters.setColor(urlFilters.color);
    if (urlFilters.talle) filters.setTalle(urlFilters.talle);
    if (urlFilters.stockMin !== undefined || urlFilters.stockMax !== undefined) {
      filters.setStockRange(urlFilters.stockMin, urlFilters.stockMax);
    }
    if (urlFilters.orderBy) filters.setOrderBy(urlFilters.orderBy);
    if (urlFilters.orderDirection) filters.setOrderDirection(urlFilters.orderDirection);
    isUpdatingFromUrl.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar

  // Sincronizar cambios de filtros con URL (solo cuando cambian desde el componente, no desde URL)
  useEffect(() => {
    if (isInitialMount.current || isUpdatingFromUrl.current) return;

    const params = new URLSearchParams(searchParams.toString());

    // Actualizar params según filtros
    if (filters.filters.rubroId !== undefined) {
      params.set('rubroId', String(filters.filters.rubroId));
    } else {
      params.delete('rubroId');
    }

    if (filters.filters.subrubroId !== undefined) {
      params.set('subrubroId', String(filters.filters.subrubroId));
    } else {
      params.delete('subrubroId');
    }

    if (filters.filters.sexo) {
      params.set('sexo', filters.filters.sexo);
    } else {
      params.delete('sexo');
    }

    if (filters.filters.color) {
      params.set('color', filters.filters.color);
    } else {
      params.delete('color');
    }

    if (filters.filters.talle) {
      params.set('talle', filters.filters.talle);
    } else {
      params.delete('talle');
    }

    if (filters.filters.stockMin !== undefined) {
      params.set('stockMin', String(filters.filters.stockMin));
    } else {
      params.delete('stockMin');
    }

    if (filters.filters.stockMax !== undefined) {
      params.set('stockMax', String(filters.filters.stockMax));
    } else {
      params.delete('stockMax');
    }

    if (filters.filters.orderBy) {
      params.set('orderBy', filters.filters.orderBy);
    } else {
      params.delete('orderBy');
    }

    if (filters.filters.orderDirection) {
      params.set('orderDirection', filters.filters.orderDirection);
    } else {
      params.delete('orderDirection');
    }

    // Resetear página cuando cambian los filtros
    params.set('page', '1');

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters.filters, router, searchParams]);

  return filters;
}

