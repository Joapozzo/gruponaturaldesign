import { apiClient } from '@/lib/apiClient';
import type { AdminSearchResponse } from '@/app/types/admin-search.types';

export async function searchAdmin(q: string, limit = 12) {
  const params = new URLSearchParams({
    q: q.trim(),
    limit: String(limit),
  });
  const response = await apiClient.get<AdminSearchResponse>(`/admin/search?${params.toString()}`);
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Error al buscar');
  }
  return response.data.results;
}
