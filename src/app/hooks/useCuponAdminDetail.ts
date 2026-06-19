import { useQuery } from '@tanstack/react-query';
import { getCuponAdminById } from '@/app/services/cuponesAdmin.service';
import { cuponesAdminKeys } from './cuponesQueryKeys';

export function useCuponAdminDetail(id: number) {
  return useQuery({
    queryKey: cuponesAdminKeys.detail(id),
    queryFn: () => getCuponAdminById(id),
    enabled: id > 0,
  });
}