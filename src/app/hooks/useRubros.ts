import { useQuery } from '@tanstack/react-query';
import { rubroService } from '../services/rubro.service';
import { rubrosKeys } from '../utils/rubrosKeys';
import type { RubroQueryParams } from '../types/rubro.types';

export const useRubros = (params?: RubroQueryParams) => {
  return useQuery({
    queryKey: rubrosKeys.list(params),
    queryFn: () => rubroService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

