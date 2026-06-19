/**
 * Hook auxiliar para obtener IDs de rubros y subrubros desde la API
 * Usado por el Navbar para navegar con search params correctos (rubroId, subrubroId)
 */

'use client';

import { useMemo } from 'react';
import { useRubros } from './useRubros';
import { useSubrubros } from './useSubrubros';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { getRubroDisplayName } from '@/app/utils/rubroDisplay';

export interface CategoryIdsMap {
  rubros: Map<string, number>; // nombre display o nombre API -> id
  subrubros: Map<string, number>; // nombre -> id
}

/**
 * Hook para obtener mapeos de nombres a IDs de categorías desde la API de rubros/subrubros.
 * Así los links del menú Shop filtran correctamente aunque se abra desde cualquier página.
 */
export function useNavbarCategoryIds(): CategoryIdsMap {
  const empresaId = getEmpresaId();
  const { data: rubrosData } = useRubros({
    empresaId,
    visibleWeb: true,
    includeSubrubros: false,
  });
  const { data: subrubrosData } = useSubrubros({
    empresaId,
    visibleWeb: true,
  });

  return useMemo<CategoryIdsMap>(() => {
    const rubrosMap = new Map<string, number>();
    const subrubrosMap = new Map<string, number>();

    rubrosData?.data?.forEach((r) => {
      if (r.id && r.nombre) {
        const displayName = getRubroDisplayName(r.nombre);
        rubrosMap.set(displayName.toUpperCase(), r.id);
        rubrosMap.set(r.nombre.toUpperCase(), r.id);
      }
    });

    subrubrosData?.data?.forEach((s) => {
      if (s.id && s.nombre) {
        subrubrosMap.set(s.nombre.toUpperCase(), s.id);
      }
    });

    return {
      rubros: rubrosMap,
      subrubros: subrubrosMap,
    };
  }, [rubrosData?.data, subrubrosData?.data]);
}

