'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableColumn } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/Card';
import { productoService } from '@/app/services/producto.service';
import type { ProductoPadreConVariantes } from '@/app/types/producto.types';
import { 
  Download, 
  Plus, 
  Edit, 
  Eye,
  EyeOff,
  Star,
  StarOff,
  Loader2,
  Search,
  CheckSquare,
  Square,
  RefreshCw
} from 'lucide-react';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import AlertModal from '@/app/components/modal/AlertModal';
import ProductoFormModal from '@/app/components/modal/ProductoFormModal';
import { useConfirmModal } from '@/app/components/hooks/useModal';

const AdminProductosPage = () => {
  const queryClient = useQueryClient();
  const empresaId = 1; // TODO: Obtener del contexto de autenticación
  
  // Estado de paginación
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  
  // Estado de filtros y búsqueda
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  // Estados para modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoPadreConVariantes | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ title: '', message: '', type: 'info' });

  // Hook para confirm modal
  const confirmModal = useConfirmModal();

  // Query para obtener productos con variantes
  const {
    data: productosData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['productos', empresaId, page, limit, search],
    queryFn: () => productoService.getAll({ 
      empresaId, 
      includeVariantes: true, // Incluir variantes para mostrar detalles individuales
      page,
      limit,
      search: search || undefined,
    }),
  });

  // Mutation para actualizar destacado
  const updateDestacadoMutation = useMutation({
    mutationFn: ({ id, destacado }: { id: number; destacado: boolean }) =>
      productoService.updateDestacado(id, destacado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
    },
  });

  // Mutation para dar de baja (actualizar publicado)
  const darDeBajaMutation = useMutation({
    mutationFn: ({ id, publicado }: { id: number; publicado: boolean }) =>
      productoService.updatePublicado(id, publicado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
    },
  });

  // Mutations para operaciones bulk
  const bulkPublicarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdatePublicado(ids, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      setSelectedIds(new Set());
      showAlert('Éxito', 'Productos publicados correctamente', 'success');
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al publicar productos', 'error');
    },
  });

  const bulkDespublicarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdatePublicado(ids, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      setSelectedIds(new Set());
      showAlert('Éxito', 'Productos despublicados correctamente', 'success');
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al despublicar productos', 'error');
    },
  });

  const bulkDestacarMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdateDestacado(ids, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      setSelectedIds(new Set());
      showAlert('Éxito', 'Productos destacados correctamente', 'success');
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al destacar productos', 'error');
    },
  });

  const bulkQuitarDestacadoMutation = useMutation({
    mutationFn: (ids: number[]) => productoService.bulkUpdateDestacado(ids, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      setSelectedIds(new Set());
      showAlert('Éxito', 'Productos desmarcados como destacados', 'success');
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al quitar destacado', 'error');
    },
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      showAlert('Éxito', 'Producto eliminado correctamente', 'success');
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al eliminar el producto', 'error');
    },
  });

  // Mutation para crear/actualizar producto
  const saveProductoMutation = useMutation({
    mutationFn: async (data: Partial<ProductoPadreConVariantes>) => {
      // TODO: Implementar servicio de creación/actualización
      // Por ahora solo simulamos
      if (selectedProducto) {
        // Actualizar
        // return await productoService.update(selectedProducto.id, data);
        throw new Error('Actualización no implementada aún');
      } else {
        // Crear
        // return await productoService.create(data);
        throw new Error('Creación no implementada aún');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos', empresaId] });
      setIsFormModalOpen(false);
      setSelectedProducto(null);
      showAlert(
        'Éxito',
        selectedProducto ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
        'success'
      );
    },
    onError: (error: Error) => {
      showAlert('Error', error.message || 'Error al guardar el producto', 'error');
    },
  });

  // Función helper para mostrar alertas
  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ title, message, type });
    setIsAlertModalOpen(true);
  };

  // Aplanar productos con sus variantes para mostrar cada variante como una fila
  const productosConVariantes = React.useMemo(() => {
    if (!productosData?.data) return [];
    
    const flattened: Array<ProductoPadreConVariantes & { variante?: import('@/app/types/producto.types').ProductoWebResponse }> = [];
    
    productosData.data.forEach((producto) => {
      if (producto.productosWeb && producto.productosWeb.length > 0) {
        // Si tiene variantes, crear una fila por cada variante
        producto.productosWeb.forEach((variante) => {
          flattened.push({
            ...producto,
            variante,
          });
        });
      } else {
        // Si no tiene variantes, mostrar solo el producto padre
        flattened.push(producto);
      }
    });
    
    return flattened;
  }, [productosData?.data]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    await refetch();
  };

  // Función para exportar a CSV
  const handleExport = async () => {
    try {
      const blob = await productoService.exportToCSV({ empresaId });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showAlert('Éxito', 'Productos exportados correctamente', 'success');
    } catch (error) {
      console.error('Error al exportar:', error);
      showAlert('Error', 'Error al exportar productos. Por favor, intente nuevamente.', 'error');
    }
  };

  // Función para crear producto
  const handleCreate = () => {
    setSelectedProducto(null);
    setIsFormModalOpen(true);
  };

  // Función para editar producto
  const handleEdit = (producto: ProductoPadreConVariantes) => {
    setSelectedProducto(producto);
    setIsFormModalOpen(true);
  };

  // Función para publicar/despublicar
  const handleDarDeBaja = (producto: ProductoPadreConVariantes) => {
    const action = producto.publicado ? 'despublicar' : 'publicar';
    confirmModal.showModal({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Producto`,
      message: `¿Estás seguro de que quieres ${action} "${producto.nombre}"?`,
      type: producto.publicado ? 'warning' : 'info',
      confirmText: producto.publicado ? 'Despublicar' : 'Publicar',
      onConfirm: async () => {
        darDeBajaMutation.mutate({ id: producto.id, publicado: !producto.publicado });
      },
    });
  };

  // Función para eliminar
  const handleDelete = (producto: ProductoPadreConVariantes) => {
    confirmModal.showModal({
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      type: 'error',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        deleteMutation.mutate(producto.id);
      },
    });
  };

  // Función para guardar producto (crear/editar)
  const handleSaveProducto = async (data: Partial<ProductoPadreConVariantes>) => {
    await saveProductoMutation.mutateAsync(data);
  };

  // Funciones para selección
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (!productosConVariantes) return;
    const allIds = new Set(productosConVariantes.map((p) => p.id));
    if (selectedIds.size === allIds.size) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(allIds);
    }
  };

  // Funciones para operaciones bulk
  const handleBulkPublicar = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    confirmModal.showModal({
      title: 'Publicar Productos',
      message: `¿Estás seguro de que quieres publicar ${ids.length} producto(s)?`,
      type: 'info',
      confirmText: 'Publicar',
      onConfirm: async () => {
        bulkPublicarMutation.mutate(ids);
      },
    });
  };

  const handleBulkDespublicar = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    confirmModal.showModal({
      title: 'Despublicar Productos',
      message: `¿Estás seguro de que quieres despublicar ${ids.length} producto(s)?`,
      type: 'warning',
      confirmText: 'Despublicar',
      onConfirm: async () => {
        bulkDespublicarMutation.mutate(ids);
      },
    });
  };

  const handleBulkDestacar = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    confirmModal.showModal({
      title: 'Destacar Productos',
      message: `¿Estás seguro de que quieres destacar ${ids.length} producto(s)?`,
      type: 'info',
      confirmText: 'Destacar',
      onConfirm: async () => {
        bulkDestacarMutation.mutate(ids);
      },
    });
  };

  const handleBulkQuitarDestacado = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    confirmModal.showModal({
      title: 'Quitar Destacado',
      message: `¿Estás seguro de que quieres quitar el destacado de ${ids.length} producto(s)?`,
      type: 'warning',
      confirmText: 'Quitar',
      onConfirm: async () => {
        bulkQuitarDestacadoMutation.mutate(ids);
      },
    });
  };

  // Función para toggle destacado
  const handleToggleDestacado = (producto: ProductoPadreConVariantes) => {
    updateDestacadoMutation.mutate({ id: producto.id, destacado: !producto.destacado });
  };

  // Definición de columnas de la tabla
  const columns: TableColumn<any>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <button
            onClick={toggleSelectAll}
            className="flex items-center justify-center"
            title="Seleccionar todos"
          >
            {selectedIds.size === productosConVariantes.length && productosConVariantes.length > 0 ? (
              <CheckSquare className="w-5 h-5 text-black" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const productoPadre = row.original as ProductoPadreConVariantes;
          const isSelected = selectedIds.has(productoPadre.id);
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelect(productoPadre.id);
              }}
              className="flex items-center justify-center"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-black" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'sfactoryCodigo',
        header: 'Código SKU',
        cell: ({ row }) => (
          <div>
            <span className="font-mono text-sm font-semibold">
              {row.original.variante?.sfactoryCodigo || row.original.codigoAgrupacion}
            </span>
            {row.original.variante && (
              <div className="text-xs text-neutral-500 mt-0.5">
                Agrupación: {row.original.codigoAgrupacion}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.nombre}</div>
            {row.original.descripcionCorta && (
              <div className="text-xs text-neutral-500 mt-1">
                {row.original.descripcionCorta}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'rubro',
        header: 'Rubro',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.rubro?.nombre || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'subrubro',
        header: 'Subrubro',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.subrubro?.nombre || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'sexo',
        header: 'Sexo',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.variante?.sexo || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.variante?.color || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'talle',
        header: 'Talle',
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.variante?.talle || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
          const stock = row.original.variante?.stockCache;
          return (
            <span
              className={`text-sm font-medium ${
                stock === null || stock === undefined
                  ? 'text-neutral-400'
                  : stock > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stock !== null && stock !== undefined ? stock : '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'publicado',
        header: 'Estado',
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.publicado
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {row.original.publicado ? 'Publicado' : 'No publicado'}
          </span>
        ),
      },
      {
        accessorKey: 'destacado',
        header: 'Destacado',
        cell: ({ row }) => {
          // Usar el producto padre para las acciones
          const productoPadre = row.original as ProductoPadreConVariantes;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDestacado(productoPadre);
              }}
              disabled={updateDestacadoMutation.isPending}
              className="flex items-center justify-center"
            >
              {updateDestacadoMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              ) : productoPadre.destacado ? (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="w-5 h-5 text-neutral-400" />
              )}
            </button>
          );
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          // Usar el producto padre para las acciones
          const productoPadre = row.original as ProductoPadreConVariantes;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(productoPadre);
                }}
                className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDarDeBaja(productoPadre);
                }}
                disabled={darDeBajaMutation.isPending}
                className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                  productoPadre.publicado
                    ? 'text-neutral-600 hover:text-orange-600 hover:bg-orange-50'
                    : 'text-neutral-600 hover:text-green-600 hover:bg-green-50'
                }`}
                title={productoPadre.publicado ? 'Despublicar' : 'Publicar'}
              >
                {darDeBajaMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : productoPadre.publicado ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [updateDestacadoMutation, darDeBajaMutation, selectedIds, productosConVariantes, toggleSelectAll, toggleSelect]
  );

    return (
        <>
            <PageHeader
                title="Productos"
        description="Gestiona tus productos y sus variantes"
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
              onClick={handleRefresh}
                            disabled={isLoading || isFetching}
                        >
              <RefreshCw className={`w-4 h-4 mr-2 inline ${isLoading || isFetching ? 'animate-spin' : ''}`} />
              Refrescar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
              onClick={handleExport}
                        >
              <Download className="w-4 h-4 mr-2 inline" />
              Exportar
                        </Button>
                            <Button
              variant="primary"
                                size="sm"
              onClick={handleCreate}
                            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Crear Producto
                            </Button>
                    </div>
                }
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
          { label: 'Productos' },
        ]}
      />

      <div className="mt-8 space-y-4">
        {/* Filtros y Búsqueda */}
        <Card variant="elevated" padding="md">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Búsqueda */}
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Resetear a primera página al buscar
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Operaciones Bulk */}
            {selectedIds.size > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkPublicar}
                  disabled={bulkPublicarMutation.isPending}
                >
                  {bulkPublicarMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2 inline" />
                  )}
                  Publicar ({selectedIds.size})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDespublicar}
                  disabled={bulkDespublicarMutation.isPending}
                >
                  {bulkDespublicarMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2 inline" />
                  )}
                  Despublicar ({selectedIds.size})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDestacar}
                  disabled={bulkDestacarMutation.isPending}
                >
                  {bulkDestacarMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  ) : (
                    <Star className="w-4 h-4 mr-2 inline" />
                  )}
                  Destacar ({selectedIds.size})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkQuitarDestacado}
                  disabled={bulkQuitarDestacadoMutation.isPending}
                >
                  {bulkQuitarDestacadoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                  ) : (
                    <StarOff className="w-4 h-4 mr-2 inline" />
                  )}
                  Quitar Destacado ({selectedIds.size})
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card variant="elevated" padding="none">
          {isLoading || isFetching ? (
            <TableSkeleton 
              rows={limit} 
              columns={12}
              showPagination={true}
            />
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

            {/* Modales */}
            <ProductoFormModal
              isOpen={isFormModalOpen}
              onClose={() => {
                setIsFormModalOpen(false);
                setSelectedProducto(null);
              }}
              onSubmit={handleSaveProducto}
              producto={selectedProducto}
              loading={saveProductoMutation.isPending}
            />

            <ConfirmModal
              isOpen={confirmModal.isOpen}
              onClose={confirmModal.closeModal}
              onConfirm={confirmModal.handleConfirm}
              title={confirmModal.modalOptions.title}
              message={confirmModal.modalOptions.message}
              type={confirmModal.modalOptions.type}
              confirmText={confirmModal.modalOptions.confirmText}
              cancelText={confirmModal.modalOptions.cancelText}
              showCancel={confirmModal.modalOptions.showCancel}
              loading={confirmModal.loading}
            />

            <AlertModal
              isOpen={isAlertModalOpen}
              onClose={() => setIsAlertModalOpen(false)}
              title={alertConfig.title}
              message={alertConfig.message}
              type={alertConfig.type}
            />
        </>
    );
};

export default AdminProductosPage;
