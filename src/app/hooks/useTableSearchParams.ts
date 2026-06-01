import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';

interface UseTableSearchParamsOptions {
  defaultPage?: number;
  defaultLimit?: number;
}

/**
 * Hook para manejar search params de tablas (page, limit, search)
 * La búsqueda se commitea a URL vía commitSearch (debounce en TableSearchInput)
 */
export function useTableSearchParams(options: UseTableSearchParamsOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const DEFAULT_PAGE = options.defaultPage ?? 1;
  const DEFAULT_LIMIT = options.defaultLimit ?? 20;

  const page = parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10);
  const limit = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
  const searchParam = searchParams.get('search') || '';

  const lastSyncedSearch = useRef(searchParam);

  useEffect(() => {
    lastSyncedSearch.current = searchParam;
  }, [searchParam]);

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

  const commitSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const currentSearch = searchParams.get('search') || '';

      if (trimmed === currentSearch) return;

      lastSyncedSearch.current = trimmed;
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(DEFAULT_PAGE));
      params.set('limit', String(limit));

      if (trimmed) {
        params.set('search', trimmed);
      } else {
        params.delete('search');
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, limit, DEFAULT_PAGE]
  );

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));
      params.set('limit', String(limit));
      const currentSearch = searchParams.get('search');
      if (currentSearch) {
        params.set('search', currentSearch);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, limit]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(DEFAULT_PAGE));
      params.set('limit', String(newLimit));
      const currentSearch = searchParams.get('search');
      if (currentSearch) {
        params.set('search', currentSearch);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, DEFAULT_PAGE]
  );

  const clearSearch = useCallback(() => {
    lastSyncedSearch.current = '';
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', String(DEFAULT_PAGE));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, DEFAULT_PAGE]);

  return {
    page,
    limit,
    searchParam,
    /** Valor de búsqueda activo en URL (para queries). */
    debouncedSearch: searchParam,
    commitSearch,
    setPage,
    setLimit,
    clearSearch,
  };
}
