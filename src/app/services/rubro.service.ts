import type {
  RubroConSubrubros,
  RubroQueryParams,
  SubrubroConRubro,
  SubrubroQueryParams,
  PaginatedResponse,
} from '../types/rubro.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class RubroService {
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
    params?: RubroQueryParams
  ): Promise<PaginatedResponse<RubroConSubrubros>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/rubros${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      success: boolean;
      data: RubroConSubrubros[];
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
}

class SubrubroService {
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
    params?: SubrubroQueryParams
  ): Promise<PaginatedResponse<SubrubroConRubro>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/subrubros${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      success: boolean;
      data: SubrubroConRubro[];
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
}

export const rubroService = new RubroService();
export const subrubroService = new SubrubroService();

