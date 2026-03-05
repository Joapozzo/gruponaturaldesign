import { QueryClient } from '@tanstack/react-query';
import { auditService } from '@/app/services/audit.service';
import { auditKeys } from './auditKeys';
import type { AuditLogQueryParams } from '@/app/types/audit.types';

interface PrefetchAuditoriaTableParams {
  empresaId: number;
  page: number;
  limit: number;
  filters?: Partial<AuditLogQueryParams>;
}

export async function prefetchAuditoriaTable(
  queryClient: QueryClient,
  params: PrefetchAuditoriaTableParams
) {
  await queryClient.prefetchQuery({
    queryKey: auditKeys.list(
      params.empresaId,
      params.page,
      params.limit,
      params.filters?.entity,
      params.filters?.userId,
      params.filters?.userEmail,
      params.filters?.dateFrom,
      params.filters?.dateTo,
      params.filters?.action,
      params.filters?.method
    ),
    queryFn: () =>
      auditService.getAll({
        page: params.page,
        limit: params.limit,
        entity: params.filters?.entity,
        userId: params.filters?.userId,
        userEmail: params.filters?.userEmail,
        dateFrom: params.filters?.dateFrom,
        dateTo: params.filters?.dateTo,
        action: params.filters?.action,
        method: params.filters?.method,
        empresaId: params.empresaId,
      }),
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10,
  });
}
