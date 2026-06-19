export const cuponesAdminKeys = {
  all: ['cupones-admin'] as const,
  lists: () => [...cuponesAdminKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...cuponesAdminKeys.lists(), filters ?? {}] as const,
  details: () => [...cuponesAdminKeys.all, 'detail'] as const,
  detail: (id: number) => [...cuponesAdminKeys.details(), id] as const,
};