import { apiClient } from '@/lib/apiClient';
import type {
  RubroConSubrubros,
  RubroQueryParams,
  SubrubroConRubro,
  SubrubroQueryParams,
  PaginatedResponse,
} from '../types/rubro.types';

class RubroService {
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
    params?: RubroQueryParams
  ): Promise<PaginatedResponse<RubroConSubrubros>> {
    const queryString = this.buildQueryString(params as Record<string, unknown>);
    const endpoint = `/rubros${queryString}`;

    const response = await apiClient.getPaginated<RubroConSubrubros>(endpoint);

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
    params?: SubrubroQueryParams
  ): Promise<PaginatedResponse<SubrubroConRubro>> {
    const queryString = this.buildQueryString(params as Record<string, unknown>);
    const endpoint = `/subrubros${queryString}`;

    const response = await apiClient.getPaginated<SubrubroConRubro>(endpoint);

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

