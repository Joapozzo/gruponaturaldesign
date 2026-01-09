import { useEffect } from 'react';

/**
 * Hook para escuchar el evento global de abrir modal de creación de producto
 */
export function useOpenCreateProductoEvent(onOpen: () => void) {
  useEffect(() => {
    const handleOpenCreateModal = () => {
      onOpen();
    };

    window.addEventListener('open-create-producto-modal', handleOpenCreateModal);
    return () => {
      window.removeEventListener('open-create-producto-modal', handleOpenCreateModal);
    };
  }, [onOpen]);
}

