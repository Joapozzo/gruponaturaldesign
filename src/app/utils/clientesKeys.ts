import type { ClienteQueryParams } from '@/app/types/cliente.types';

/**
 * React Query keys para clientes
 */
export const clientesKeys = {
  all: ['clientes'] as const,
  lists: () => [...clientesKeys.all, 'list'] as const,
  list: (params?: ClienteQueryParams) => [...clientesKeys.lists(), params] as const,
  details: () => [...clientesKeys.all, 'detail'] as const,
  detail: (id: number) => [...clientesKeys.details(), id] as const,
};

