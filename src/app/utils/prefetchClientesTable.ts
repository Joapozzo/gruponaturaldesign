import { QueryClient } from '@tanstack/react-query';
import { clienteService } from '@/app/services/cliente.service';
import { clientesKeys } from './clientesKeys';
import type { ClienteQueryParams } from '@/app/types/cliente.types';

/**
 * Prefetch de datos de clientes para SSR
 */
export async function prefetchClientesTable(
  queryClient: QueryClient,
  params?: ClienteQueryParams
) {
  const queryKey = clientesKeys.list(params);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => clienteService.getAll(params),
  });
}

