import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import type {
  DashboardAlertasQueryInput,
  DashboardAlertasResponse,
} from '@/app/types/dashboard.types';
import type { UseQueryOptions } from '@tanstack/react-query';

export type UseDashboardAlertasOptions = UseQueryOptions<
  DashboardAlertasResponse,
  Error,
  DashboardAlertasResponse,
  ReturnType<typeof dashboardKeys.alertas>
>;

export function useDashboardAlertas(
  input?: DashboardAlertasQueryInput,
  options?: Partial<Pick<UseDashboardAlertasOptions, 'enabled' | 'staleTime' | 'gcTime'>>
) {
  return useQuery({
    queryKey: dashboardKeys.alertas(input),
    queryFn: () => dashboardService.getAlertas(input),
    staleTime: options?.staleTime ?? 1000 * 30,
    gcTime: options?.gcTime ?? 1000 * 60 * 5,
    enabled: options?.enabled,
    placeholderData: keepPreviousData,
  });
}
