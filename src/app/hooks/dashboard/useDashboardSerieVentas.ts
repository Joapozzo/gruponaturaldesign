import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardSerieQueryInput,
  DashboardSerieResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardSerieVentasOptions = UseQueryOptions<
  DashboardSerieResponse,
  Error,
  DashboardSerieResponse,
  ReturnType<typeof dashboardKeys.serie>
>;

export function useDashboardSerieVentas(
  input?: DashboardSerieQueryInput,
  options?: Partial<Pick<UseDashboardSerieVentasOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.serie(input),
    queryFn: () => dashboardService.getSerieVentas(input),
    staleTime: options?.staleTime ?? 1000 * 60,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
