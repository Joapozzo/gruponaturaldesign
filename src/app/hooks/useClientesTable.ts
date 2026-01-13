import { useQuery } from '@tanstack/react-query';
import { clienteService } from '@/app/services/cliente.service';
import { clientesKeys } from '@/app/utils/clientesKeys';
import type { ClienteQueryParams } from '@/app/types/cliente.types';

interface UseClientesTableParams {
  params?: ClienteQueryParams;
  enabled?: boolean;
}

/**
 * Hook para obtener la lista de clientes con paginación
 */
export function useClientesTable({ params, enabled = true }: UseClientesTableParams = {}) {
  return useQuery({
    queryKey: clientesKeys.list(params),
    queryFn: () => clienteService.getAll(params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

