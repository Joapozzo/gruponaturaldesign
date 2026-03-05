import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/app/services/audit.service';
import { auditKeys } from '@/app/utils/auditKeys';
import type { AuditLogItem, AuditLogQueryParams } from '@/app/types/audit.types';

interface UseAuditoriaTableParams {
  empresaId: number;
  page: number;
  limit: number;
  filters?: Partial<AuditLogQueryParams>;
}

export function useAuditoriaTable({ empresaId, page, limit, filters }: UseAuditoriaTableParams) {
  const queryKey = auditKeys.list(
    empresaId,
    page,
    limit,
    filters?.entity,
    filters?.userId,
    filters?.userEmail,
    filters?.dateFrom,
    filters?.dateTo,
    filters?.action,
    filters?.method
  );

  const query = useQuery({
    queryKey,
    queryFn: () =>
      auditService.getAll({
        page,
        limit,
        entity: filters?.entity,
        userId: filters?.userId,
        userEmail: filters?.userEmail,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
        action: filters?.action,
        method: filters?.method,
        empresaId,
      }),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const auditLogs: AuditLogItem[] = Array.isArray(query.data?.data) ? query.data.data : [];
  const pagination = query.data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  return {
    data: query.data,
    auditLogs,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
