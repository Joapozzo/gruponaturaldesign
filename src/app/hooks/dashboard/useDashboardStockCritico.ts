import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardStockCriticoQueryInput,
  DashboardStockCriticoResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardStockCriticoOptions = UseQueryOptions<
  DashboardStockCriticoResponse,
  Error,
  DashboardStockCriticoResponse,
  ReturnType<typeof dashboardKeys.stock>
>;

export function useDashboardStockCritico(
  input?: DashboardStockCriticoQueryInput,
  options?: Partial<Pick<UseDashboardStockCriticoOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.stock(input),
    queryFn: () => dashboardService.getStockCritico(input),
    staleTime: options?.staleTime ?? 1000 * 60,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
