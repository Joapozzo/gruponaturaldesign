'use client';

import React, { Suspense, useMemo } from 'react';
import { Table } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';
import { useProductosTable } from '@/app/hooks/useProductosTable';
import { useBulkSelection } from '@/app/hooks/useBulkSelection';
import { useProductosMutations } from '@/app/hooks/useProductosMutations';
import { useProductosModals } from '@/app/hooks/useProductosModals';
import { useProductosActions } from '@/app/hooks/useProductosActions';
import { useTableSearchParams } from '@/app/hooks/useTableSearchParams';
import { useOpenCreateProductoEvent } from '@/app/hooks/useOpenCreateProductoEvent';
import { useProductosFiltersWithParams } from '@/app/filters/hooks/useProductosFiltersWithParams';
import { ProductosFilters } from '@/app/filters/components/ProductosFilters';
import { getProductosColumns } from '@/app/components/admin/productos/columns';
import { BulkActions } from '@/app/components/admin/productos/BulkActions';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import type { ProductoPadreBusqueda } from '@/app/services/producto.service';
import { Search } from 'lucide-react';

// Lazy load modales
const ProductoSeleccionModal = React.lazy(() => import('@/app/components/producto/ProductoSeleccionModal'));
const ProductoFormModal = React.lazy(() => import('@/app/components/modal/ProductoFormModal'));
const ConfirmModal = React.lazy(() => import('@/app/components/modal/ConfirmModal'));
const AlertModal = React.lazy(() => import('@/app/components/modal/AlertModal'));
const VariantesManagementModal = React.lazy(() => import('@/app/components/admin/productos/VariantesManagementModal'));

interface ProductosTableClientProps {
  empresaId: number;
}

/**
 * Componente orquestador para la tabla de productos
 * Delega toda la lógica compleja a hooks especializados
 */
export function ProductosTableClient({ empresaId }: ProductosTableClientProps) {
  // Search params (page, limit, search con debounce)
  const { page, limit, searchInput, debouncedSearch, setSearchInput, setPage, setLimit, clearSearch } = useTableSearchParams();

  // Filtros (sincronizados con URL)
  const filters = useProductosFiltersWithParams();

  // Data fetching
  const { data: productosData, isLoading, isFetching, isError, error, productosConVariantes } = useProductosTable({
    empresaId,
    page,
    limit,
    search: debouncedSearch,
    filters: filters.filters,
  });

  // Bulk selection
  const bulkSelection = useBulkSelection(productosConVariantes);

  // Modales
  const modals = useProductosModals();

  // Mutations
  const mutations = useProductosMutations({
    empresaId,
    onSuccess: (message) => {
      modals.showAlert('Éxito', message, 'success');
      bulkSelection.clearSelection();
    },
    onError: (message) => {
      modals.showAlert('Error', message, 'error');
    },
  });

  // Acciones
  const actions = useProductosActions({
    bulkSelection,
    mutations: {
      ...mutations,
      // Agregar saveProducto como stub ya que el guardado se maneja en el wizard del modal
      saveProducto: async () => {
        // El guardado se maneja dentro del ProductoFormModal wizard
        // Esta función es requerida por la interfaz pero no se usa
      },
    },
    confirmModal: modals.confirmModal,
    showAlert: modals.showAlert,
    openEdit: modals.openEdit,
    closeFormModal: modals.closeFormModal,
  });

  // Evento global para abrir modal de creación
  useOpenCreateProductoEvent(() => setIsSeleccionModalOpen(true));
  
  // Handlers para modal de selección
  const handleSeleccionarCrearProducto = () => {
    setIsSeleccionModalOpen(false);
    setWizardMode('crear-producto');
    setProductoPadreSeleccionado(undefined);
    modals.openCreate();
  };
  
  const handleSeleccionarCrearVariante = (productoPadre: ProductoPadreBusqueda) => {
    setIsSeleccionModalOpen(false);
    setWizardMode('crear-variante');
    setProductoPadreSeleccionado(productoPadre);
    modals.openCreate();
  };
  
  // Cuando se abre edición, establecer modo
  React.useEffect(() => {
    if (modals.isFormModalOpen && modals.selectedProducto) {
      setWizardMode('editar');
      setProductoPadreSeleccionado(undefined);
    }
  }, [modals.isFormModalOpen, modals.selectedProducto]);

  // Estado para modal de gestión de variantes
  const [selectedProductoForVariantes, setSelectedProductoForVariantes] = React.useState<ProductoPadreConVariantes | null>(null);

  // Sincronizar producto del modal con la lista cuando refetch (ej. tras subir tabla de talles / ficha).
  // Solo actualizar estado si el item de la lista es distinto (evita setState innecesarios en cada render).
  React.useEffect(() => {
    if (!selectedProductoForVariantes?.id || !productosConVariantes?.length) return;
    const updated = productosConVariantes.find((p) => p.id === selectedProductoForVariantes.id);
    if (updated && updated !== selectedProductoForVariantes) {
      setSelectedProductoForVariantes(updated);
    }
  }, [productosConVariantes, selectedProductoForVariantes]);

  // Estado para modal de selección y modo del wizard
  const [isSeleccionModalOpen, setIsSeleccionModalOpen] = React.useState(false);
  const [wizardMode, setWizardMode] = React.useState<'crear-producto' | 'crear-variante' | 'editar'>('crear-producto');
  const [productoPadreSeleccionado, setProductoPadreSeleccionado] = React.useState<ProductoPadreBusqueda | undefined>(undefined);

  // Columnas
  const columns = useMemo(
    () =>
      getProductosColumns({
        selectedIds: bulkSelection.selectedIds,
        onToggleSelect: bulkSelection.toggleSelect,
        onToggleSelectAll: bulkSelection.toggleSelectAll,
        onEdit: actions.handleEdit,
        onTogglePublicado: actions.handleTogglePublicado,
        onToggleDestacado: actions.handleToggleDestacado,
        onManageVariantes: (producto) => setSelectedProductoForVariantes(producto),
        updatingProductoId: mutations.updatingProductoId,
        productosCount: productosConVariantes.length,
      }),
    [
      bulkSelection.selectedIds,
      bulkSelection.toggleSelect,
      bulkSelection.toggleSelectAll,
      actions.handleEdit,
      actions.handleTogglePublicado,
      actions.handleToggleDestacado,
      mutations.updatingProductoId,
      productosConVariantes.length,
    ]
  );

  const disabled =
  productosConVariantes.length === 0 && !filters.hasActiveFilters;

  return (
    <>
      <div className="mt-8 space-y-4">
        {/* Filtros Avanzados */}
        <ProductosFilters filters={filters} disabled={disabled} onClearFilters={clearSearch} />

        {/* Búsqueda y Acciones Bulk */}
        <Card variant="elevated" padding="md">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Búsqueda */}
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Operaciones Bulk */}
            <BulkActions
              selectedCount={bulkSelection.selectedCount}
              onBulkPublicar={actions.handleBulkPublicar}
              onBulkDespublicar={actions.handleBulkDespublicar}
              onBulkDestacar={actions.handleBulkDestacar}
              onBulkQuitarDestacado={actions.handleBulkQuitarDestacado}
              isBulkPublicando={mutations.isBulkPublicando}
              isBulkDespublicando={mutations.isBulkDespublicando}
              isBulkDestacando={mutations.isBulkDestacando}
              isBulkQuitandoDestacado={mutations.isBulkQuitandoDestacado}
            />
          </div>
        </Card>

        {/* Tabla */}
        <Card variant="elevated" padding="none">
          {isLoading ? (
            <TableSkeleton rows={limit} columns={12} showPagination={true} />
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-red-600">
                Error al cargar productos: {error instanceof Error ? error.message : 'Error desconocido'}
              </span>
            </div>
          ) : (
            <Table
              data={productosConVariantes}
              columns={columns}
              emptyMessage="No hay productos disponibles"
              pagination={productosData?.pagination}
              onPageChange={setPage}
              onLimitChange={setLimit}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          )}
        </Card>
      </div>

      {/* Modales con Suspense */}
      <Suspense fallback={null}>
        <ProductoSeleccionModal
          isOpen={isSeleccionModalOpen}
          onClose={() => setIsSeleccionModalOpen(false)}
          onSeleccionarCrearProducto={handleSeleccionarCrearProducto}
          onSeleccionarCrearVariante={handleSeleccionarCrearVariante}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ProductoFormModal
          isOpen={modals.isFormModalOpen}
          onClose={modals.closeFormModal}
          onSubmit={async () => {
            // El producto ya fue guardado en el wizard
            modals.closeFormModal();
            modals.showAlert('Éxito', 'Producto guardado correctamente', 'success');
          }}
          producto={modals.selectedProducto}
          modo={wizardMode}
          productoPadreSeleccionado={productoPadreSeleccionado}
          loading={mutations.isCreandoProducto || mutations.isActualizandoSFactory || mutations.isActualizandoLocales}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ConfirmModal
          isOpen={modals.confirmModal.isOpen}
          onClose={modals.confirmModal.closeModal}
          onConfirm={modals.confirmModal.handleConfirm}
          title={modals.confirmModal.modalOptions.title}
          message={modals.confirmModal.modalOptions.message}
          type={modals.confirmModal.modalOptions.type}
          confirmText={modals.confirmModal.modalOptions.confirmText}
          cancelText={modals.confirmModal.modalOptions.cancelText}
          showCancel={modals.confirmModal.modalOptions.showCancel}
          loading={modals.confirmModal.loading}
        />
      </Suspense>

      <Suspense fallback={null}>
        <AlertModal
          isOpen={modals.isAlertModalOpen}
          onClose={modals.closeAlertModal}
          title={modals.alertConfig.title}
          message={modals.alertConfig.message}
          type={modals.alertConfig.type}
        />
      </Suspense>

      <Suspense fallback={null}>
        <VariantesManagementModal
          isOpen={selectedProductoForVariantes !== null}
          onClose={() => setSelectedProductoForVariantes(null)}
          producto={selectedProductoForVariantes}
          onSuccess={() => {
            setSelectedProductoForVariantes(null);
            // Refetch productos
          }}
        />
      </Suspense>
    </>
  );
}

