import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '@/app/utils/dashboardKeys';

export function useDashboardInvalidate() {
  const qc = useQueryClient();

  return {
    invalidateAll: () => qc.invalidateQueries({ queryKey: dashboardKeys.all }),
    invalidateFull: () => qc.invalidateQueries({ queryKey: dashboardKeys.all.slice(0, 2) as unknown as string[] }),
    invalidateKpis: () => qc.invalidateQueries({ queryKey: dashboardKeys.kpis() }),
    invalidateSerie: () => qc.invalidateQueries({ queryKey: dashboardKeys.serie() }),
    invalidateAlertas: () => qc.invalidateQueries({ queryKey: dashboardKeys.alertas() }),
    invalidateRecientes: () => qc.invalidateQueries({ queryKey: dashboardKeys.recientes() }),
    invalidateStock: () => qc.invalidateQueries({ queryKey: dashboardKeys.stock() }),
  };
}
