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

    const publicado = searchParams.get('publicado');
    if (publicado === 'true') urlFilters.publicado = true;
    if (publicado === 'false') urlFilters.publicado = false;

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
    if (urlFilters.publicado !== undefined) filters.setPublicado(urlFilters.publicado);
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

    if (filters.filters.publicado !== undefined) {
      params.set('publicado', String(filters.filters.publicado));
    } else {
      params.delete('publicado');
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
    // No pisar limit: preservar el de la URL o dejar default para no borrarlo (evita race con useTableSearchParams)
    if (!params.has('limit')) {
      params.set('limit', searchParams.get('limit') || '20');
    }

    router.replace(`?${params.toString()}`, { scroll: false });
    // No incluir searchParams: si no, al cambiar page o limit se dispara este efecto y se resetea page a 1
  }, [filters.filters, router]);

  return filters;
}

