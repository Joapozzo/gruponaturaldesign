import { apiClient } from '@/lib/apiClient';
import type {
  CuponDetalle,
  CuponCreatePayload,
  CuponUpdatePayload,
  CuponesAdminListResponse,
} from '@/app/types/cupones';

export interface CuponesAdminFilters {
  page?: number;
  limit?: number;
  estado?: string;
  search?: string;
}

export async function getCuponesAdmin(filters: CuponesAdminFilters = {}): Promise<CuponesAdminListResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.estado) params.set('estado', filters.estado);
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  const res = await apiClient.get<any>(`/admin/cupones${query ? `?${query}` : ''}`);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al obtener cupones');
  }
  const raw = res.data;
  const cupones = Array.isArray(raw) ? raw : (raw.cupones ?? raw.data ?? []);
  const pagination = raw.pagination ?? { page: 1, limit: 20, total: cupones.length, totalPages: 1 };
  return {
    cupones: cupones.map((c: any) => ({
      ...c,
      usoActual: c._count?.usages ?? c.usages?.length ?? 0,
    })),
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
  };
}

export async function getCuponAdminById(id: number): Promise<CuponDetalle> {
  const res = await apiClient.get<CuponDetalle>(`/admin/cupones/${id}`);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al obtener cupón');
  }
  return res.data;
}

export async function createCupon(data: CuponCreatePayload): Promise<CuponDetalle> {
  const res = await apiClient.post<CuponDetalle>('/admin/cupones', data);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al crear cupón');
  }
  return res.data;
}

export async function updateCupon(id: number, data: CuponUpdatePayload): Promise<CuponDetalle> {
  const res = await apiClient.patch<CuponDetalle>(`/admin/cupones/${id}`, data);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al actualizar cupón');
  }
  return res.data;
}

export async function pausarCupon(id: number): Promise<void> {
  const res = await apiClient.post<any>(`/admin/cupones/${id}/pausar`, {});
  if (!res.success) {
    throw new Error(res.message || 'Error al pausar cupón');
  }
}

export async function activarCupon(id: number): Promise<void> {
  const res = await apiClient.post<any>(`/admin/cupones/${id}/activar`, {});
  if (!res.success) {
    throw new Error(res.message || 'Error al activar cupón');
  }
}

export async function deleteCupon(id: number): Promise<void> {
  const res = await apiClient.delete(`/admin/cupones/${id}`);
  if (!res.success) {
    throw new Error(res.message || 'Error al eliminar cupón');
  }
}