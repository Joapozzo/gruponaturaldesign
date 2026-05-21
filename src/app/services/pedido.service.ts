import { apiClient } from '@/lib/apiClient';
import { MERGE_FETCH_LIMIT } from '@/app/utils/adminPedidos.utils';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type {
  Pedido,
  PedidoListResponse,
  PedidoQueryParams,
  SFactoryPedido,
  SFactoryPedidoListResponse,
} from '@/app/types/pedido.types';

const MERGE_MAX_PAGES = 20;

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<{ data: T[]; pagination: { totalPages: number } }>
): Promise<T[]> {
  const limit = MERGE_FETCH_LIMIT;
  const first = await fetchPage(1, limit);
  const all = [...first.data];
  const pages = Math.min(first.pagination.totalPages, MERGE_MAX_PAGES);
  for (let page = 2; page <= pages; page++) {
    const next = await fetchPage(page, limit);
    all.push(...next.data);
  }
  return all;
}

class PedidoService {
  /** Todas las páginas permitidas por API, para merge en admin. */
  async getAllForMerge(params?: Omit<PedidoQueryParams, 'page' | 'limit'>): Promise<Pedido[]> {
    return fetchAllPages((page, limit) =>
      this.getAll({ ...params, page, limit }).then((r) => ({
        data: r.data,
        pagination: r.pagination,
      }))
    );
  }

  async getAllSFactoryForMerge(
    params?: Omit<PedidoQueryParams, 'page' | 'limit'>
  ): Promise<SFactoryPedido[]> {
    return fetchAllPages((page, limit) =>
      this.getAllSFactory({ ...params, page, limit }).then((r) => ({
        data: r.data,
        pagination: r.pagination,
      }))
    );
  }

  async getDetalle(id: number): Promise<AdminPedidoDetalle> {
    const response = await apiClient.get<AdminPedidoDetalle>(`/admin/pedidos/${id}`);
    if (!response.success || response.data === undefined) {
      throw new Error((response as { message?: string }).message || 'Error al obtener el pedido');
    }
    return response.data;
  }

  async getAll(params?: PedidoQueryParams): Promise<PedidoListResponse> {
    const response = await apiClient.get<PedidoListResponse>(
      `/admin/pedidos${buildQueryString(params as Record<string, unknown>)}`
    );
    if (!response.data) {
      throw new Error('Error al listar pedidos');
    }
    return response.data;
  }

  async getAllSFactory(params?: PedidoQueryParams): Promise<SFactoryPedidoListResponse> {
    const response = await apiClient.get<SFactoryPedidoListResponse>(
      `/admin/pedidos/sfactory${buildQueryString(params as Record<string, unknown>)}`
    );
    if (!response.data) {
      throw new Error('Error al listar pedidos desde SFactory');
    }
    return response.data;
  }

  async crearSFactory(body: {
    source: string;
    ext_order_id: string;
    fecha?: string;
    fecha_entrega?: string;
    titulo?: string;
    observaciones?: string;
    ref_cliente?: string;
    num_orden_compra?: string;
    condiciones_venta?: string;
    cliente: {
      nombre?: string;
      cuit?: string;
      email?: string;
      razon_social?: string;
      telefono?: string;
      movil?: string;
    };
    items: Array<{
      sku: string;
      cantidad: number;
      precio?: number;
      descuento?: number;
      iva?: number;
      descripcion?: string;
      fecha_entrega?: string;
      especificaciones?: string;
      notas?: string;
    }>;
    entrega?: {
      provincia: string;
      localidad: string;
      direccion: string;
      cp: string;
      localidad_id?: number;
      notas?: string;
    };
  }) {
    const response = await apiClient.post<{ success: boolean; data: { id: number }; message: string }>(
      `/admin/pedidos/crear-sfactory`,
      body
    );
    return response.data;
  }

  async getSFactoryById(id: number): Promise<{ success: boolean; data: SFactoryPedido }> {
    const response = await apiClient.get<{ success: boolean; data: SFactoryPedido }>(
      `/admin/pedidos/sfactory/${id}`
    );
    if (response.data == null) throw new Error(response.message || 'Error al obtener pedido SFactory');
    return response.data;
  }

  async buscarClientes(search: string) {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `/admin/pedidos/sfactory/buscar-clientes?search=${encodeURIComponent(search)}`
    );
    return response.data;
  }

  async buscarProductos(search: string) {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `/admin/pedidos/sfactory/buscar-productos?search=${encodeURIComponent(search)}`
    );
    return response.data;
  }

  async aprobarSFactory(id: number) {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/admin/pedidos/sfactory/${id}/aprobar`,
      {}
    );
    return response.data;
  }

  async cancelarSFactory(id: number) {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `/admin/pedidos/sfactory/${id}/cancelar`,
      {}
    );
    return response.data;
  }

  async aprobar(id: number) {
    return apiClient.post(`/admin/pedidos/${id}/aprobar`, {});
  }

  async rechazar(id: number, motivo?: string) {
    return apiClient.post(`/admin/pedidos/${id}/rechazar`, motivo ? { motivo } : {});
  }

  async sync(id: number) {
    return apiClient.post(`/admin/pedidos/${id}/sync`, {});
  }

  async reintentarSfactory(id: number) {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      `/admin/pedidos/${id}/reintentar-sfactory`,
      {}
    );
    if (!response.success) {
      throw new Error(response.message || response.error || 'Error al reintentar SFactory');
    }
    return response;
  }

  async resolverFallido(id: number, accion: 'reintentar' | 'cancelar', motivo?: string) {
    return apiClient.post(`/admin/pedidos/${id}/resolver-fallido`, { accion, motivo });
  }

  async syncActivos() {
    return apiClient.post(`/admin/pedidos/sync-activos`, {});
  }

  async syncStock() {
    return apiClient.post(`/admin/pedidos/sync-stock`, {});
  }
}

export const pedidoService = new PedidoService();
