import type {
  ClienteResponse,
  ClienteQueryParams,
  ClienteCreateParams,
  PaginatedResponse,
} from '../types/cliente.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ClienteService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || error.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  async getAll(
    params?: ClienteQueryParams
  ): Promise<PaginatedResponse<ClienteResponse>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/clientes${queryString ? `?${queryString}` : ''}`;

    const response = await this.request<{
      success: boolean;
      data: ClienteResponse[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint);

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
    const response = await this.request<{
      success: boolean;
      data: ClienteResponse;
    }>(endpoint);
    return response.data;
  }

  async create(data: ClienteCreateParams): Promise<ClienteResponse> {
    const endpoint = `/clientes`;
    const response = await this.request<{
      success: boolean;
      data: ClienteResponse;
    }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async sync(): Promise<{ exitosos: number; fallidos: number; errores: string[] }> {
    const endpoint = `/clientes/sync`;
    const response = await this.request<{
      success: boolean;
      data: { exitosos: number; fallidos: number; errores: string[] };
    }>(endpoint, {
      method: 'POST',
    });
    return response.data;
  }
}

export const clienteService = new ClienteService();

