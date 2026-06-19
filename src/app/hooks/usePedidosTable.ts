import { useQuery } from '@tanstack/react-query';
import { pedidoService } from '@/app/services/pedido.service';
import { pedidosKeys } from '@/app/utils/pedidosKeys';
import type { PedidoQueryParams } from '@/app/types/pedido.types';

export function usePedidosTable(params?: PedidoQueryParams) {
  return useQuery({
    queryKey: pedidosKeys.list(params),
    queryFn: () => pedidoService.getAll(params),
    staleTime: 1000 * 60,
  });
}

export function usePedidosSFactoryTable(params?: PedidoQueryParams) {
  return useQuery({
    queryKey: ['pedidos-sfactory', params],
    queryFn: () => pedidoService.getAllSFactory(params),
    staleTime: 1000 * 30,
  });
}
