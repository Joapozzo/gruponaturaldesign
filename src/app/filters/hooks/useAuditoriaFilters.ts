import { useState, useCallback, useMemo } from 'react';
import type { AuditEntity, AuditAction } from '@/app/types/audit.types';

export interface AuditoriaFilters {
  entity?: AuditEntity;
  userId?: number;
  userEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  action?: AuditAction;
  method?: string;
}

interface UseAuditoriaFiltersOptions {
  initialFilters?: Partial<AuditoriaFilters>;
}

export function useAuditoriaFilters(options: UseAuditoriaFiltersOptions = {}) {
  const [filters, setFilters] = useState<AuditoriaFilters>({
    ...options.initialFilters,
  });

  const setEntity = useCallback((entity: AuditEntity | undefined) => {
    setFilters((prev) => ({ ...prev, entity }));
  }, []);

  const setUserId = useCallback((userId: number | undefined) => {
    setFilters((prev) => ({ ...prev, userId }));
  }, []);

  const setUserEmail = useCallback((userEmail: string | undefined) => {
    setFilters((prev) => ({ ...prev, userEmail }));
  }, []);

  const setDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }));
  }, []);

  const setAction = useCallback((action: AuditAction | undefined) => {
    setFilters((prev) => ({ ...prev, action }));
  }, []);

  const setMethod = useCallback((method: string | undefined) => {
    setFilters((prev) => ({ ...prev, method }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilters = useMemo(() => {
    const active: Record<string, string | number | undefined> = {};
    if (filters.entity) active.entity = filters.entity;
    if (filters.userId !== undefined) active.userId = filters.userId;
    if (filters.userEmail) active.userEmail = filters.userEmail;
    if (filters.dateFrom) active.dateFrom = filters.dateFrom;
    if (filters.dateTo) active.dateTo = filters.dateTo;
    if (filters.action) active.action = filters.action;
    if (filters.method) active.method = filters.method;
    return active;
  }, [filters]);

  const hasActiveFilters = useMemo(() => Object.keys(activeFilters).length > 0, [activeFilters]);

  return {
    filters,
    activeFilters,
    hasActiveFilters,
    setEntity,
    setUserId,
    setUserEmail,
    setDateRange,
    setAction,
    setMethod,
    clearFilters,
  };
}
