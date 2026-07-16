import { useQuery } from '@tanstack/react-query';
import { subrubroService } from '../services/rubro.service';
import { subrubrosKeys } from '../utils/subrubrosKeys';
import type { SubrubroQueryParams } from '../types/rubro.types';

export const useSubrubros = (params?: SubrubroQueryParams) => {
  return useQuery({
    queryKey: subrubrosKeys.list(params),
    queryFn: () => subrubroService.getAll(params),
    staleTime: 1000 * 60, // 1 min — subrubros cambian con sync S-Factory
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: params?.rubroId !== undefined || params?.empresaId !== undefined, // Solo cargar si hay rubroId o empresaId
  });
};

