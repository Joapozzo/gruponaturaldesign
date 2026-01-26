/**
 * Hook auxiliar para obtener IDs de rubros y subrubros desde productos publicados
 * Usado por el Navbar para navegar con search params correctos
 */

'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useProductosPublicadosAll } from './useProductosPublicadosAll';

export interface CategoryIdsMap {
  rubros: Map<string, number>; // nombre -> id
  subrubros: Map<string, number>; // nombre -> id
}

/**
 * Hook para obtener mapeos de nombres a IDs de categorías
 * Útil para convertir nombres de categorías a IDs para search params
 * Solo carga los productos cuando es necesario (lazy loading)
 */
export function useNavbarCategoryIds() {
  const pathname = usePathname();
  // Solo cargar productos cuando estamos en la página de shoponline o cerca
  const shouldLoad = pathname === '/shoponline' || pathname?.startsWith('/producto') || false;
  
  const { productos } = useProductosPublicadosAll({
    searchTerm: '',
    rubroId: undefined,
    subrubroId: undefined,
    genero: 'TODOS',
    destacado: false,
    tieneStock: false,
    sortBy: 'orden',
    sortOrder: 'asc',
    enabled: shouldLoad, // Solo cargar cuando sea necesario
  });

  const categoryIds = useMemo<CategoryIdsMap>(() => {
    const rubrosMap = new Map<string, number>();
    const subrubrosMap = new Map<string, number>();

    if (Array.isArray(productos)) {
      productos.forEach((product) => {
        // Rubros
        if (product.rubro?.id && product.rubro?.nombre) {
          const nombreUpper = product.rubro.nombre.toUpperCase();
          // Normalizar nombres: WORKWEAR, BASIC, etc.
          if (nombreUpper.includes('WORKWEAR') || nombreUpper.includes('WORK') || nombreUpper.includes('WEAR')) {
            rubrosMap.set('WORKWEAR', product.rubro.id);
          } else if (nombreUpper.includes('OFFICE') || nombreUpper.includes('BASIC')) {
            rubrosMap.set('BASIC', product.rubro.id);
          }
          // También guardar el nombre original
          rubrosMap.set(product.rubro.nombre.toUpperCase(), product.rubro.id);
        }

        // Subrubros
        if (product.subrubro?.id && product.subrubro?.nombre) {
          subrubrosMap.set(product.subrubro.nombre.toUpperCase(), product.subrubro.id);
        }
      });
    }

    return {
      rubros: rubrosMap,
      subrubros: subrubrosMap,
    };
  }, [productos]);

  return categoryIds;
}

