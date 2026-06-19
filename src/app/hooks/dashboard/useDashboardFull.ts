import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardFullQueryInput,
  DashboardFullResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardFullOptions = UseQueryOptions<
  DashboardFullResponse,
  Error,
  DashboardFullResponse,
  ReturnType<typeof dashboardKeys.full>
>;

export function useDashboardFull(
  input?: DashboardFullQueryInput,
  options?: Partial<Pick<UseDashboardFullOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.full(input),
    queryFn: () => dashboardService.getFull(input),
    staleTime: options?.staleTime ?? 1000 * 60,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
