import { useQuery } from '@tanstack/react-query';
import { getCuponesAdmin, type CuponesAdminFilters } from '@/app/services/cuponesAdmin.service';
import { cuponesAdminKeys } from './cuponesQueryKeys';

export function useCuponesAdminList(filters: CuponesAdminFilters = {}) {
  return useQuery({
    queryKey: cuponesAdminKeys.list(filters as Record<string, unknown>),
    queryFn: () => getCuponesAdmin(filters),
  });
}