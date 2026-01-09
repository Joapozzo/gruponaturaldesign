import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '@/app/services/cliente.service';
import { clientesKeys } from '@/app/utils/clientesKeys';
import type { ClienteCreateParams, ClienteResponse } from '@/app/types/cliente.types';

interface UseClientesMutationsParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Hook para manejar todas las mutaciones de clientes
 */
export function useClientesMutations({ onSuccess, onError }: UseClientesMutationsParams) {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
  };

  // Crear cliente
  const createMutation = useMutation({
    mutationFn: (data: ClienteCreateParams) => clienteService.create(data),
    onSuccess: () => {
      invalidateQueries();
      onSuccess?.('Cliente creado correctamente');
    },
    onError: (error: Error) => {
      onError?.(error.message || 'Error al crear el cliente');
    },
  });

  return {
    createCliente: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

