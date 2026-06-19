import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardRecientesQueryInput,
  DashboardRecientesResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardPedidosRecientesOptions = UseQueryOptions<
  DashboardRecientesResponse,
  Error,
  DashboardRecientesResponse,
  ReturnType<typeof dashboardKeys.recientes>
>;

export function useDashboardPedidosRecientes(
  input?: DashboardRecientesQueryInput,
  options?: Partial<Pick<UseDashboardPedidosRecientesOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.recientes(input),
    queryFn: () => dashboardService.getPedidosRecientes(input),
    staleTime: options?.staleTime ?? 1000 * 60,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
