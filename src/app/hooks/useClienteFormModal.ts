import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientesKeys } from '@/app/utils/clientesKeys';
import type { ClienteResponse } from '@/app/types/cliente.types';

interface UseClienteFormModalParams {
  /**
   * Callback que se ejecuta cuando el cliente se crea exitosamente
   */
  onSuccess?: (cliente: ClienteResponse) => void;
  /**
   * Callback que se ejecuta cuando se cierra el modal
   */
  onClose?: () => void;
  /**
   * Si es true, no invalida las queries ni refresca la página
   * Útil cuando se usa en contextos como checkout donde no necesitas refrescar la lista
   */
  skipRefresh?: boolean;
}

/**
 * Hook reutilizable para manejar el modal de creación/edición de clientes
 * 
 * @example
 * // Uso básico en página de clientes
 * const { isOpen, openModal, closeModal, handleSuccess } = useClienteFormModal({
 *   onSuccess: (cliente) => {
 *     console.log('Cliente creado:', cliente);
 *   }
 * });
 * 
 * @example
 * // Uso en checkout (sin refrescar la lista)
 * const { isOpen, openModal, closeModal, handleSuccess } = useClienteFormModal({
 *   onSuccess: (cliente) => {
 *     // Usar el cliente creado en el checkout
 *     setSelectedCliente(cliente);
 *   },
 *   skipRefresh: true
 * });
 */
export function useClienteFormModal({
  onSuccess,
  onClose,
  skipRefresh = false,
}: UseClienteFormModalParams = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleSuccess = useCallback(
    (cliente: ClienteResponse) => {
      setIsOpen(false);

      // Ejecutar callback personalizado
      onSuccess?.(cliente);

      // Refrescar datos si no se especifica skipRefresh
      if (!skipRefresh) {
        queryClient.invalidateQueries({ queryKey: clientesKeys.all });
        router.refresh();
      }
    },
    [onSuccess, skipRefresh, queryClient, router]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    handleSuccess,
  };
}

