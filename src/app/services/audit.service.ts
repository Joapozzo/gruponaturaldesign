import { apiClient } from '@/lib/apiClient';
import type {
  AuditLogItem,
  AuditLogQueryParams,
  PaginatedResponse,
} from '../types/audit.types';

class AuditService {
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

  async getAll(params: AuditLogQueryParams & { empresaId?: number }): Promise<PaginatedResponse<AuditLogItem>> {
    const { empresaId: _empresaId, ...queryParams } = params;
    const queryString = this.buildQueryString(queryParams as Record<string, unknown>);
    const endpoint = `/audit-logs${queryString}`;
    const response = await apiClient.getPaginated<AuditLogItem>(endpoint);
    return {
      data: response.data ?? [],
      pagination:
        response.pagination ?? {
          page: 1,
          limit: 20,
          total: response.data?.length ?? 0,
          totalPages: 1,
        },
    };
  }
}

export const auditService = new AuditService();
