import { useQuery } from '@tanstack/react-query';
import { rubroService } from '../services/rubro.service';
import type { RubroQueryParams } from '../types/rubro.types';

export const useRubros = (params?: RubroQueryParams) => {
  return useQuery({
    queryKey: ['rubros', params],
    queryFn: () => rubroService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

