import { useQuery } from '@tanstack/react-query';
import { subrubroService } from '../services/rubro.service';
import type { SubrubroQueryParams } from '../types/rubro.types';

export const useSubrubros = (params?: SubrubroQueryParams) => {
  return useQuery({
    queryKey: ['subrubros', params],
    queryFn: () => subrubroService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: params?.rubroId !== undefined || params?.empresaId !== undefined, // Solo cargar si hay rubroId o empresaId
  });
};

