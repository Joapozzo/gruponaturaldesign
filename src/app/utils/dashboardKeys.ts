import type {
  DashboardFullQueryInput,
  DashboardKpisQueryInput,
  DashboardSerieQueryInput,
  DashboardAlertasQueryInput,
  DashboardRecientesQueryInput,
  DashboardStockCriticoQueryInput,
} from '@/app/types/dashboard.types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  full: (input?: DashboardFullQueryInput) =>
    [...dashboardKeys.all, 'full', input ?? null] as const,
  kpis: (input?: DashboardKpisQueryInput) =>
    [...dashboardKeys.all, 'kpis', input ?? null] as const,
  serie: (input?: DashboardSerieQueryInput) =>
    [...dashboardKeys.all, 'serie', input ?? null] as const,
  alertas: (input?: DashboardAlertasQueryInput) =>
    [...dashboardKeys.all, 'alertas', input ?? null] as const,
  recientes: (input?: DashboardRecientesQueryInput) =>
    [...dashboardKeys.all, 'recientes', input ?? null] as const,
  stock: (input?: DashboardStockCriticoQueryInput) =>
    [...dashboardKeys.all, 'stock', input ?? null] as const,
};
