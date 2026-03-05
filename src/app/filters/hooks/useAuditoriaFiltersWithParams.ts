import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuditoriaFilters, type AuditoriaFilters } from './useAuditoriaFilters';
import type { AuditEntity, AuditAction } from '@/app/types/audit.types';

export function useAuditoriaFiltersWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useAuditoriaFilters();
  const isInitialMount = useRef(true);
  const isUpdatingFromUrl = useRef(false);

  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const entity = searchParams.get('entity') as AuditEntity | null;
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const action = searchParams.get('action') as AuditAction | null;
    const method = searchParams.get('method');

    isUpdatingFromUrl.current = true;
    if (entity) filters.setEntity(entity);
    if (userId) filters.setUserId(parseInt(userId, 10));
    if (userEmail) filters.setUserEmail(userEmail);
    if (dateFrom || dateTo) filters.setDateRange(dateFrom ?? undefined, dateTo ?? undefined);
    if (action) filters.setAction(action);
    if (method) filters.setMethod(method);
    isUpdatingFromUrl.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialMount.current || isUpdatingFromUrl.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (filters.filters.entity) params.set('entity', filters.filters.entity);
    else params.delete('entity');

    if (filters.filters.userId !== undefined) params.set('userId', String(filters.filters.userId));
    else params.delete('userId');

    if (filters.filters.userEmail) params.set('userEmail', filters.filters.userEmail);
    else params.delete('userEmail');

    if (filters.filters.dateFrom) params.set('dateFrom', filters.filters.dateFrom);
    else params.delete('dateFrom');

    if (filters.filters.dateTo) params.set('dateTo', filters.filters.dateTo);
    else params.delete('dateTo');

    if (filters.filters.action) params.set('action', filters.filters.action);
    else params.delete('action');

    if (filters.filters.method) params.set('method', filters.filters.method);
    else params.delete('method');

    params.set('page', '1');
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters.filters, router, searchParams]);

  return filters;
}
