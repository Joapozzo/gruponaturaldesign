import { useCallback } from 'react';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';

interface UseProductosActionsParams {
  bulkSelection: {
    selectedIds: Set<number>;
    selectedCount: number;
    clearSelection: () => void;
  };
  mutations: {
    updatePublicado: (params: { id: number; publicado: boolean }) => void;
    updateDestacado: (params: { id: number; destacado: boolean }) => void;
    delete: (id: number) => void;
    bulkPublicar: (ids: number[]) => void;
    bulkDespublicar: (ids: number[]) => void;
    bulkDestacar: (ids: number[]) => void;
    bulkQuitarDestacado: (ids: number[]) => void;
    saveProducto: (data: Partial<ProductoPadreConVariantes>) => Promise<void>;
  };
  confirmModal: {
    showModal: (options: {
      title: string;
      message: string;
      type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
      confirmText?: string;
      onConfirm?: () => void | Promise<void>;
    }) => void;
  };
  showAlert: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  openEdit: (producto: ProductoPadreConVariantes) => void;
  closeFormModal: () => void;
}

/**
 * Hook para manejar todas las acciones de productos
 */
export function useProductosActions({
  bulkSelection,
  mutations,
  confirmModal,
  showAlert,
  openEdit,
  closeFormModal,
}: UseProductosActionsParams) {
  const handleEdit = useCallback((producto: ProductoPadreConVariantes) => {
    openEdit(producto);
  }, [openEdit]);

  const handleTogglePublicado = useCallback((producto: ProductoPadreConVariantes) => {
    const action = producto.publicado ? 'despublicar' : 'publicar';
    confirmModal.showModal({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Producto`,
      message: `¿Estás seguro de que quieres ${action} "${producto.nombre}"?`,
      type: producto.publicado ? 'warning' : 'info',
      confirmText: producto.publicado ? 'Despublicar' : 'Publicar',
      onConfirm: async () => {
        mutations.updatePublicado({ id: producto.id, publicado: !producto.publicado });
      },
    });
  }, [confirmModal, mutations]);

  const handleToggleDestacado = useCallback((producto: ProductoPadreConVariantes) => {
    mutations.updateDestacado({ id: producto.id, destacado: !producto.destacado });
  }, [mutations]);

  const handleDelete = useCallback((producto: ProductoPadreConVariantes) => {
    confirmModal.showModal({
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      type: 'error',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        mutations.delete(producto.id);
      },
    });
  }, [confirmModal, mutations]);

  const handleSaveProducto = useCallback(async (data: Partial<ProductoPadreConVariantes>) => {
    await mutations.saveProducto(data);
    closeFormModal();
  }, [mutations, closeFormModal]);

  const handleBulkPublicar = useCallback(() => {
    if (bulkSelection.selectedCount === 0) return;
    const ids = Array.from(bulkSelection.selectedIds);
    confirmModal.showModal({
      title: 'Publicar Productos',
      message: `¿Estás seguro de que quieres publicar ${ids.length} producto(s)?`,
      type: 'info',
      confirmText: 'Publicar',
      onConfirm: async () => {
        mutations.bulkPublicar(ids);
      },
    });
  }, [bulkSelection, confirmModal, mutations]);

  const handleBulkDespublicar = useCallback(() => {
    if (bulkSelection.selectedCount === 0) return;
    const ids = Array.from(bulkSelection.selectedIds);
    confirmModal.showModal({
      title: 'Despublicar Productos',
      message: `¿Estás seguro de que quieres despublicar ${ids.length} producto(s)?`,
      type: 'warning',
      confirmText: 'Despublicar',
      onConfirm: async () => {
        mutations.bulkDespublicar(ids);
      },
    });
  }, [bulkSelection, confirmModal, mutations]);

  const handleBulkDestacar = useCallback(() => {
    if (bulkSelection.selectedCount === 0) return;
    const ids = Array.from(bulkSelection.selectedIds);
    confirmModal.showModal({
      title: 'Destacar Productos',
      message: `¿Estás seguro de que quieres destacar ${ids.length} producto(s)?`,
      type: 'info',
      confirmText: 'Destacar',
      onConfirm: async () => {
        mutations.bulkDestacar(ids);
      },
    });
  }, [bulkSelection, confirmModal, mutations]);

  const handleBulkQuitarDestacado = useCallback(() => {
    if (bulkSelection.selectedCount === 0) return;
    const ids = Array.from(bulkSelection.selectedIds);
    confirmModal.showModal({
      title: 'Quitar Destacado',
      message: `¿Estás seguro de que quieres quitar el destacado de ${ids.length} producto(s)?`,
      type: 'warning',
      confirmText: 'Quitar',
      onConfirm: async () => {
        mutations.bulkQuitarDestacado(ids);
      },
    });
  }, [bulkSelection, confirmModal, mutations]);

  return {
    handleEdit,
    handleTogglePublicado,
    handleToggleDestacado,
    handleDelete,
    handleSaveProducto,
    handleBulkPublicar,
    handleBulkDespublicar,
    handleBulkDestacar,
    handleBulkQuitarDestacado,
  };
}

