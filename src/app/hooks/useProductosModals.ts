import { useState } from 'react';
import { useConfirmModal } from '@/app/components/hooks/useModal';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

/**
 * Hook para manejar todos los modales de productos
 */
export function useProductosModals() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoPadreConVariantes | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ title: '', message: '', type: 'info' });

  const confirmModal = useConfirmModal();

  const openCreate = () => {
    setSelectedProducto(null);
    setIsFormModalOpen(true);
  };

  const openEdit = (producto: ProductoPadreConVariantes) => {
    setSelectedProducto(producto);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedProducto(null);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ title, message, type });
    setIsAlertModalOpen(true);
  };

  return {
    isFormModalOpen,
    isAlertModalOpen,
    selectedProducto,
    alertConfig,
    confirmModal,
    openCreate,
    openEdit,
    closeFormModal,
    closeAlertModal,
    showAlert,
  };
}

