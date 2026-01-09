import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/utils/productosKeys';
import type { ProductoPadreConVariantes, ProductoQueryParams, ProductoWebResponse } from '@/app/types/producto.types';
import type { ProductosFilters } from '@/app/filters/hooks/useProductosFilters';

interface UseProductosTableParams {
  empresaId: number;
  page: number;
  limit: number;
  search?: string;
  filters?: ProductosFilters;
}

/**
 * Hook para manejar el fetch y estado de la tabla de productos
 */
export function useProductosTable({ empresaId, page, limit, search, filters }: UseProductosTableParams) {
  const queryParams: ProductoQueryParams = {
    empresaId,
    includeVariantes: true,
    page,
    limit,
    search: search || undefined,
    rubroId: filters?.rubroId,
    subrubroId: filters?.subrubroId,
    sortBy: filters?.orderBy,
    sortOrder: filters?.orderDirection,
  };

  // Query key incluye filtros para cache correcto
  const queryKey = productosKeys.list(
    empresaId,
    page,
    limit,
    search,
    filters?.rubroId,
    filters?.subrubroId,
    filters?.sexo,
    filters?.color,
    filters?.talle,
    filters?.stockMin,
    filters?.stockMax,
    filters?.orderBy,
    filters?.orderDirection
  );

  const query = useQuery({
    queryKey,
    queryFn: () => productoService.getAll(queryParams),
    staleTime: 1000 * 60 * 30, // 30 minutos - usar cache si los datos son frescos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas - mantener en cache
    refetchOnMount: false, // No refetch si hay datos en cache
    refetchOnWindowFocus: false, // No refetch al cambiar de ventana
    refetchOnReconnect: false, // No refetch al reconectar
  });

  // Aplanar productos con sus variantes y aplicar filtros frontend (temporal)
  const productosConVariantes = React.useMemo(() => {
    if (!query.data?.data) return [];
    
    type ProductoConVariante = ProductoPadreConVariantes & { 
      variante?: ProductoWebResponse;
    };
    
    const flattened: ProductoConVariante[] = [];
    
    query.data.data.forEach((producto) => {
      if (producto.productosWeb && producto.productosWeb.length > 0) {
        // Si tiene variantes, crear una fila por cada variante
        producto.productosWeb.forEach((variante) => {
          flattened.push({
            ...producto,
            variante,
          });
        });
      } else {
        // Si no tiene variantes, mostrar solo el producto padre
        flattened.push(producto);
      }
    });
    
    // Aplicar filtros frontend (temporal - hasta que backend soporte filtros)
    let filtered = flattened;
    
    if (filters?.sexo) {
      filtered = filtered.filter((item) => {
        const variante = item.variante;
        if (!variante) return false;
        return variante.sexo === filters.sexo || variante.sexo === 'unisex';
      });
    }
    
    if (filters?.color) {
      filtered = filtered.filter((item) => {
        const variante = item.variante;
        if (!variante) return false;
        return variante.color?.toLowerCase() === filters.color?.toLowerCase();
      });
    }
    
    if (filters?.talle) {
      filtered = filtered.filter((item) => {
        const variante = item.variante;
        if (!variante) return false;
        return variante.talle === filters.talle;
      });
    }
    
    if (filters?.stockMin !== undefined || filters?.stockMax !== undefined) {
      filtered = filtered.filter((item) => {
        const variante = item.variante;
        if (!variante) return false;
        const stock = variante.stockCache ?? 0;
        if (filters.stockMin !== undefined && stock < filters.stockMin) return false;
        if (filters.stockMax !== undefined && stock > filters.stockMax) return false;
        return true;
      });
    }
    
    // Ordenamiento frontend (temporal)
    if (filters?.orderBy) {
      filtered.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';
        
        if (filters.orderBy === 'name') {
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
        } else if (filters.orderBy === 'price') {
          const aVariante = a.variante || a.productosWeb?.[0];
          const bVariante = b.variante || b.productosWeb?.[0];
          aValue = aVariante?.precioCache ?? 0;
          bValue = bVariante?.precioCache ?? 0;
        }
        
        if (aValue < bValue) return filters.orderDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return filters.orderDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [query.data?.data, filters]);

  return {
    ...query,
    productosConVariantes,
  };
}

