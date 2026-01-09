import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseTableSearchParamsOptions {
  defaultPage?: number;
  defaultLimit?: number;
}

/**
 * Hook para manejar search params de tablas (page, limit, search)
 * Incluye debounce para search y sincronización con URL
 */
export function useTableSearchParams(options: UseTableSearchParamsOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const DEFAULT_PAGE = options.defaultPage ?? 1;
  const DEFAULT_LIMIT = options.defaultLimit ?? 20;

  // Obtener parámetros de URL
  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
  const searchParam = searchParams.get('search') || '';

  // Estado local para el input de búsqueda
  const [searchInput, setSearchInput] = useState(searchParam);
  
  // Ref para rastrear el último valor sincronizado (evitar loops)
  const lastSyncedSearch = useRef(searchParam);

  // Debounce del search input (500ms)
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sincronizar debouncedSearch con URL cuando cambia
  useEffect(() => {
    if (debouncedSearch !== lastSyncedSearch.current && debouncedSearch !== searchParam) {
      lastSyncedSearch.current = debouncedSearch;
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(DEFAULT_PAGE)); // Resetear a página 1 al buscar
      params.set('limit', String(limit));
      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim());
      } else {
        params.delete('search');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, searchParam, limit, router, searchParams, DEFAULT_PAGE]);

  // Sincronizar searchParam con searchInput solo cuando cambia desde fuera
  useEffect(() => {
    if (searchParam !== lastSyncedSearch.current && searchParam !== searchInput) {
      setSearchInput(searchParam);
      lastSyncedSearch.current = searchParam;
    }
  }, [searchParam, searchInput]);

  // Inicializar URL con page y limit por defecto si no existen
  useEffect(() => {
    const hasPage = searchParams.has('page');
    const hasLimit = searchParams.has('limit');
    
    if (!hasPage || !hasLimit) {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasPage) params.set('page', String(DEFAULT_PAGE));
      if (!hasLimit) params.set('limit', String(DEFAULT_LIMIT));
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar page
  const setPage = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    params.set('limit', String(limit));
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, limit]);

  // Actualizar limit
  const setLimit = useCallback((newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(DEFAULT_PAGE)); // Resetear a página 1
    params.set('limit', String(newLimit));
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, DEFAULT_PAGE]);

  return {
    page,
    limit,
    searchInput,
    debouncedSearch,
    setSearchInput,
    setPage,
    setLimit,
  };
}

