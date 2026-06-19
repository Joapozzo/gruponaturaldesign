import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardKpisQueryInput,
  DashboardKpisResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardKpisOptions = UseQueryOptions<
  DashboardKpisResponse,
  Error,
  DashboardKpisResponse,
  ReturnType<typeof dashboardKeys.kpis>
>;

export function useDashboardKpis(
  input?: DashboardKpisQueryInput,
  options?: Partial<Pick<UseDashboardKpisOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.kpis(input),
    queryFn: () => dashboardService.getKpis(input),
    staleTime: options?.staleTime ?? 1000 * 60,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
