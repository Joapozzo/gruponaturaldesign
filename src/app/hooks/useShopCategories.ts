'use client';

import { useMemo } from 'react';
import { useRubros } from './useRubros';
import { useSubrubros } from './useSubrubros';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { getRubroDisplayName } from '@/app/utils/rubroDisplay';
import type { CategoryData } from '@/app/components/navbar/types';

const GENEROS = ['DAMA', 'HOMBRE', 'UNISEX'];

export function useShopCategories(): {
  categories: CategoryData | null;
  isLoading: boolean;
} {
  const empresaId = getEmpresaId();
  const { data: rubrosData, isLoading: rubrosLoading } = useRubros({
    empresaId,
    visibleWeb: true,
    includeSubrubros: false,
  });
  const { data: subrubrosData, isLoading: subrubrosLoading } = useSubrubros({
    empresaId,
    visibleWeb: true,
  });

  const categories = useMemo<CategoryData | null>(() => {
    const rubros = rubrosData?.data?.length
      ? Array.from(
          new Set(
            rubrosData.data.map((r) => getRubroDisplayName(r.nombre)).filter(Boolean)
          )
        ).sort()
      : [];
    const subrubros = subrubrosData?.data?.length
      ? Array.from(
          new Set(subrubrosData.data.map((s) => s.nombre).filter(Boolean))
        ).sort()
      : [];
    return {
      rubros,
      subrubros,
      generos: GENEROS,
    };
  }, [rubrosData?.data, subrubrosData?.data]);

  return {
    categories,
    isLoading: rubrosLoading || subrubrosLoading,
  };
}
