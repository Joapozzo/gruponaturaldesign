import { useRouter } from 'next/navigation';
import { useConfirmModal } from '@/app/components/hooks/useModal';

/**
 * Hook para manejar el modal de confirmación mayorista
 * Se muestra cuando se alcanza el límite de compra minorista (20 artículos)
 */
export function useWholesaleModal() {
  const router = useRouter();
  const { 
    isOpen, 
    loading, 
    modalOptions, 
    showModal, 
    closeModal, 
    handleConfirm 
  } = useConfirmModal();

  const handleWholesaleLimitReached = () => {
    showModal({
      title: 'Límite minorista alcanzado',
      message: 'Has alcanzado el límite de compra minorista (20 artículos). ¿Deseas continuar con tu compra en nuestro sistema mayorista?',
      type: 'warning',
      confirmText: 'Sí, ir a mayorista',
      cancelText: 'No, cancelar',
      onConfirm: async () => {
        router.push('/mayorista');
      }
    });
  };

  return {
    isWholesaleModalOpen: isOpen,
    isWholesaleModalLoading: loading,
    wholesaleModalOptions: modalOptions,
    showWholesaleModal: handleWholesaleLimitReached,
    closeWholesaleModal: closeModal,
    handleWholesaleConfirm: handleConfirm,
  };
}

