import { apiClient } from '@/lib/apiClient';
import type {
  ClienteResponse,
  ClienteQueryParams,
  ClienteCreateParams,
  PaginatedResponse,
} from '../types/cliente.types';

class ClienteService {
  /**
   * Construye query string desde un objeto de parámetros
   */
  private buildQueryString(params?: Record<string, unknown>): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getAll(
    params?: ClienteQueryParams
  ): Promise<PaginatedResponse<ClienteResponse>> {
    const queryString = this.buildQueryString(params as Record<string, unknown>);
    const endpoint = `/clientes${queryString}`;

    const response = await apiClient.getPaginated<ClienteResponse>(endpoint);

    return {
      data: response.data || [],
      pagination: response.pagination || {
        page: 1,
        limit: 20,
        total: response.data?.length || 0,
        totalPages: 1,
      },
    };
  }

  async getById(id: number): Promise<ClienteResponse> {
    const endpoint = `/clientes/${id}`;
    const response = await apiClient.get<ClienteResponse>(endpoint);
    if (!response.data) {
      throw new Error('Cliente no encontrado');
    }
    return response.data;
  }

  async create(data: ClienteCreateParams): Promise<ClienteResponse> {
    const endpoint = `/clientes`;
    const response = await apiClient.post<ClienteResponse>(endpoint, data);
    if (!response.data) {
      throw new Error('Error al crear cliente');
    }
    return response.data;
  }

  async sync(): Promise<{
    exitosos: number;
    actualizados: number;
    insertados: number;
    omitidos: number;
    fallidos: number;
    errores: string[];
  }> {
    const endpoint = `/clientes/sync`;
    const response = await apiClient.post<{
      exitosos: number;
      actualizados: number;
      insertados: number;
      omitidos: number;
      fallidos: number;
      errores: string[];
    }>(endpoint);
    if (!response.data) {
      throw new Error('Error al sincronizar clientes');
    }
    return response.data;
  }
}

export const clienteService = new ClienteService();

