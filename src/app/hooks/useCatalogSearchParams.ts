/**
 * Hook para sincronizar filtros de catálogo con search params de URL
 * Maneja la sincronización bidireccional entre filtros y URL
 */

'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { CatalogFilters } from './useCatalogFiltersPublicados';

interface UseCatalogSearchParamsOptions {
  filters: CatalogFilters;
  updateFilter: <K extends keyof CatalogFilters>(
    key: K,
    value: CatalogFilters[K]
  ) => void;
  clearFilters: () => void;
  debouncedSearchTerm?: string;
}

/**
 * Hook para sincronizar filtros con search params
 * Evita loops infinitos usando refs
 */
export function useCatalogSearchParams({
  filters,
  updateFilter,
  clearFilters,
  debouncedSearchTerm,
}: UseCatalogSearchParamsOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Refs para evitar loops infinitos
  const isInitialized = useRef(false);
  const isUpdatingFromURL = useRef(false);
  const isUpdatingFromFilters = useRef(false);

  // Sincronizar filtros con URL (Filtros -> URL)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (isUpdatingFromURL.current) return;
    if (isUpdatingFromFilters.current) return;

    isUpdatingFromFilters.current = true;

    const params = new URLSearchParams();

    // Solo agregar parámetros si no son valores por defecto
    if (filters.searchTerm && debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    }

    if (filters.rubroId) {
      params.set('rubroId', String(filters.rubroId));
    }

    if (filters.subrubroId) {
      params.set('subrubroId', String(filters.subrubroId));
    }

    if (filters.genero && filters.genero !== 'TODOS') {
      params.set('genero', filters.genero.toLowerCase());
    }

    if (filters.colores.length > 0) {
      params.set('colores', filters.colores.join(','));
    }

    if (filters.talles.length > 0) {
      params.set('talles', filters.talles.join(','));
    }

    if (filters.destacado) {
      params.set('destacado', 'true');
    }

    if (filters.tieneStock) {
      params.set('tieneStock', 'true');
    }

    if (filters.sortBy !== 'orden') {
      params.set('sortBy', filters.sortBy);
    }

    if (filters.sortOrder !== 'asc') {
      params.set('sortOrder', filters.sortOrder);
    }

    const newURL = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newURL, { scroll: false });

    setTimeout(() => {
      isUpdatingFromFilters.current = false;
    }, 100);
  }, [
    filters,
    debouncedSearchTerm,
    pathname,
    router,
  ]);

  // Aplicar filtros desde URL params (URL -> Filtros)
  useEffect(() => {
    if (isUpdatingFromFilters.current) return;

    const search = searchParams.get('search');
    const rubroId = searchParams.get('rubroId');
    const subrubroId = searchParams.get('subrubroId');
    const genero = searchParams.get('genero');
    const colores = searchParams.get('colores');
    const talles = searchParams.get('talles');
    const destacado = searchParams.get('destacado');
    const tieneStock = searchParams.get('tieneStock');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    isUpdatingFromURL.current = true;

    // Actualizar búsqueda
    if (search !== null) {
      if (filters.searchTerm !== search) {
        updateFilter('searchTerm', search);
      }
    } else if (filters.searchTerm !== '') {
      updateFilter('searchTerm', '');
    }

    // Actualizar rubro
    if (rubroId) {
      const rubroIdNum = parseInt(rubroId, 10);
      if (!isNaN(rubroIdNum) && filters.rubroId !== rubroIdNum) {
        updateFilter('rubroId', rubroIdNum);
      }
    } else if (filters.rubroId !== null) {
      updateFilter('rubroId', null);
    }

    // Actualizar subrubro
    if (subrubroId) {
      const subrubroIdNum = parseInt(subrubroId, 10);
      if (!isNaN(subrubroIdNum) && filters.subrubroId !== subrubroIdNum) {
        updateFilter('subrubroId', subrubroIdNum);
      }
    } else if (filters.subrubroId !== null) {
      updateFilter('subrubroId', null);
    }

    // Actualizar género
    if (genero) {
      const validGenero = ['dama', 'hombre', 'unisex'].includes(
        genero.toLowerCase()
      )
        ? (genero.toLowerCase() as 'dama' | 'hombre' | 'unisex')
        : 'TODOS';
      if (filters.genero !== validGenero) {
        updateFilter('genero', validGenero);
      }
    } else if (filters.genero !== 'TODOS') {
      updateFilter('genero', 'TODOS');
    }

    // Actualizar colores
    if (colores) {
      const coloresArray = colores.split(',').filter(Boolean);
      if (JSON.stringify(filters.colores) !== JSON.stringify(coloresArray)) {
        updateFilter('colores', coloresArray);
      }
    } else if (filters.colores.length > 0) {
      updateFilter('colores', []);
    }

    // Actualizar talles
    if (talles) {
      const tallesArray = talles.split(',').filter(Boolean);
      if (JSON.stringify(filters.talles) !== JSON.stringify(tallesArray)) {
        updateFilter('talles', tallesArray);
      }
    } else if (filters.talles.length > 0) {
      updateFilter('talles', []);
    }

    // Actualizar destacado
    if (destacado === 'true' && !filters.destacado) {
      updateFilter('destacado', true);
    } else if (destacado !== 'true' && filters.destacado) {
      updateFilter('destacado', false);
    }

    // Actualizar tieneStock
    if (tieneStock === 'true' && !filters.tieneStock) {
      updateFilter('tieneStock', true);
    } else if (tieneStock !== 'true' && filters.tieneStock) {
      updateFilter('tieneStock', false);
    }

    // Actualizar sortBy
    if (sortBy) {
      const validSortBy: CatalogFilters['sortBy'] = ['destacado', 'nombre', 'precio', 'orden'].includes(sortBy)
        ? (sortBy as CatalogFilters['sortBy'])
        : 'orden';
      if (filters.sortBy !== validSortBy) {
        updateFilter('sortBy', validSortBy);
      }
    } else if (filters.sortBy !== 'orden') {
      updateFilter('sortBy', 'orden');
    }

    // Actualizar sortOrder
    if (sortOrder === 'desc' && filters.sortOrder !== 'desc') {
      updateFilter('sortOrder', 'desc');
    } else if (sortOrder !== 'desc' && filters.sortOrder !== 'asc') {
      updateFilter('sortOrder', 'asc');
    }

    setTimeout(() => {
      isUpdatingFromURL.current = false;
    }, 100);

    if (!isInitialized.current) {
      isInitialized.current = true;
    }
  }, [searchParams.toString()]);

  // Wrapper para clearFilters que también limpia la URL y el input de búsqueda
  const clearFiltersAndURL = () => {
    clearFilters();
    updateFilter('searchTerm', '');
    router.replace(pathname, { scroll: false });
  };

  return {
    clearFiltersAndURL,
  };
}

