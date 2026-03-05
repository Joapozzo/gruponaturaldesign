import type { AuditEntity, AuditAction } from '../types/audit.types';

export const auditKeys = {
  all: ['audit'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (
    empresaId: number,
    page?: number,
    limit?: number,
    entity?: AuditEntity,
    userId?: number,
    userEmail?: string,
    dateFrom?: string,
    dateTo?: string,
    action?: AuditAction,
    method?: string
  ) =>
    [
      ...auditKeys.lists(),
      empresaId,
      page,
      limit,
      entity,
      userId,
      userEmail,
      dateFrom,
      dateTo,
      action,
      method,
    ] as const,
};
