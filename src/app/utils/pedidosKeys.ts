import type { PedidoQueryParams } from '@/app/types/pedido.types';

export const pedidosKeys = {
  all: ['pedidos'] as const,
  lists: () => [...pedidosKeys.all, 'list'] as const,
  list: (params?: PedidoQueryParams) => [...pedidosKeys.lists(), params] as const,
  detail: (id: number) => [...pedidosKeys.all, 'detail', id] as const,
};
