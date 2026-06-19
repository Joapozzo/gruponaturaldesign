import { apiClient } from '@/lib/apiClient';
import type {
  DashboardKpisQueryInput,
  DashboardSerieQueryInput,
  DashboardAlertasQueryInput,
  DashboardRecientesQueryInput,
  DashboardStockCriticoQueryInput,
  DashboardFullQueryInput,
  DashboardKpisResponse,
  DashboardSerieResponse,
  DashboardAlertasResponse,
  DashboardRecientesResponse,
  DashboardStockCriticoResponse,
  DashboardFullResponse,
} from '@/app/types/dashboard.types';

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        query.append(key, value ? 'true' : 'false');
      } else {
        query.append(key, String(value));
      }
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

class DashboardService {
  async getFull(input: DashboardFullQueryInput = {}): Promise<DashboardFullResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardFullResponse>(`/admin/dashboard${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener dashboard completo');
    if (!res.data) throw new Error('Sin datos del dashboard');
    return res.data;
  }

  async getKpis(input: DashboardKpisQueryInput = {}): Promise<DashboardKpisResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardKpisResponse>(`/admin/dashboard/kpis${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener KPIs');
    if (!res.data) throw new Error('Sin datos de KPIs');
    return res.data;
  }

  async getSerieVentas(input: DashboardSerieQueryInput = {}): Promise<DashboardSerieResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardSerieResponse>(`/admin/dashboard/serie-ventas${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener serie de ventas');
    if (!res.data) throw new Error('Sin datos de serie de ventas');
    return res.data;
  }

  async getAlertas(input: DashboardAlertasQueryInput = {}): Promise<DashboardAlertasResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardAlertasResponse>(`/admin/dashboard/alertas${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener alertas');
    if (!res.data) throw new Error('Sin datos de alertas');
    return res.data;
  }

  async getPedidosRecientes(input: DashboardRecientesQueryInput = {}): Promise<DashboardRecientesResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardRecientesResponse>(`/admin/dashboard/pedidos-recientes${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener pedidos recientes');
    if (!res.data) throw new Error('Sin datos de pedidos recientes');
    return res.data;
  }

  async getStockCritico(input: DashboardStockCriticoQueryInput = {}): Promise<DashboardStockCriticoResponse> {
    const params = buildQueryString(input as Record<string, unknown>);
    const res = await apiClient.get<DashboardStockCriticoResponse>(`/admin/dashboard/stock-critico${params}`);
    if (!res.success) throw new Error(res.message || 'Error al obtener stock crítico');
    if (!res.data) throw new Error('Sin datos de stock crítico');
    return res.data;
  }
}

export const dashboardService = new DashboardService();
