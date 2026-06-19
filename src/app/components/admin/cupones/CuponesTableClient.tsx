'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Pause, Play, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table, type TableColumn } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import { useCuponesAdminList } from '@/app/hooks/useCuponesAdminList';
import { useCuponAdminMutations } from '@/app/hooks/useCuponAdminMutations';
import { cuponColumns } from './columns';
import { CuponCodigoCell } from './CuponCodigoCell';
import type { CuponEstado, CuponListItem } from '@/app/types/cupones';

interface CuponesTableClientProps {
  onEdit: (id: number) => void;
}

export function CuponesTableClient({ onEdit }: CuponesTableClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = searchParams.get('search') || undefined;
  const estadoParam = searchParams.get('estado');
  const estado = estadoParam ? (estadoParam as CuponEstado) : undefined;

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; nombre: string } | null>(null);

  const { data, isLoading, isFetching, isError, error } = useCuponesAdminList({
    page,
    limit,
    estado,
    search,
  });

  const { pausar, activar, remove } = useCuponAdminMutations();

  const pushParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(`?${next.toString()}`);
  };

  const handlePausar = (id: number) => {
    pausar.mutate(id, {
      onSuccess: () => toast.success('Cupón pausado'),
      onError: (e: Error) => toast.error(e.message || 'Error al pausar'),
    });
  };

  const handleActivar = (id: number) => {
    activar.mutate(id, {
      onSuccess: () => toast.success('Cupón activado'),
      onError: (e: Error) => toast.error(e.message || 'Error al activar'),
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Cupón eliminado');
        setDeleteTarget(null);
      },
      onError: (e: Error) => toast.error(e.message || 'Error al eliminar'),
    });
  };

  const baseColumns: TableColumn<CuponListItem>[] = useMemo(
    () =>
      cuponColumns.map((col) => ({
        accessorKey: col.key,
        header: col.header,
        cell: ({ row }) =>
          col.key === 'codigo' ? (
            <CuponCodigoCell codigo={row.original.codigo} />
          ) : (
            col.render(row.original)
          ),
      })),
    []
  );

  const columns: TableColumn<CuponListItem>[] = useMemo(
    () => [
      ...baseColumns,
      {
        accessorKey: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const cupon = row.original;
          return (
            <RowActions
              cupon={cupon}
              onPausar={() => handlePausar(cupon.id)}
              onActivar={() => handleActivar(cupon.id)}
              onEdit={() => onEdit(cupon.id)}
              onDelete={() => setDeleteTarget({ id: cupon.id, nombre: cupon.nombre })}
            />
          );
        },
      },
    ],
    [baseColumns, onEdit]
  );

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filters = (
    <CuponesFilters
      search={searchParams.get('search') || ''}
      estado={estadoParam || ''}
      onSearch={(value) => pushParams({ search: value || null, page: '1' })}
      onEstadoChange={(value) => pushParams({ estado: value || null, page: '1' })}
    />
  );

  if (isLoading || isFetching) {
    return (
      <>
        {filters}
        <Card variant="elevated" padding="none" className="mt-4">
          <TableSkeleton rows={limit} columns={cuponColumns.length + 1} showPagination />
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {filters}
        <Card variant="elevated" padding="md" className="mt-4">
          <div className="flex items-center justify-center py-12">
            <span className="text-red-600">
              Error al cargar cupones: {error instanceof Error ? error.message : 'Error desconocido'}
            </span>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      {filters}

      <Card variant="elevated" padding="none" className="mt-4">
        <Table
          data={data?.cupones || []}
          columns={columns}
          emptyMessage="No hay cupones que coincidan con los filtros"
          pagination={{
            page,
            limit,
            total,
            totalPages,
          }}
          onPageChange={(newPage) => pushParams({ page: String(newPage) })}
          onLimitChange={(newLimit) => pushParams({ limit: String(newLimit), page: '1' })}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Card>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar cupón?"
        message={`¿Estás seguro de eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        type="error"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={remove.isPending}
      />
    </>
  );
}

function CuponesFilters({
  search,
  estado,
  onSearch,
  onEstadoChange,
}: {
  search: string;
  estado: string;
  onSearch: (value: string) => void;
  onEstadoChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Buscar por código o nombre..."
        defaultValue={search}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch(e.currentTarget.value);
        }}
        className="px-3 py-2 border border-neutral-300 rounded-lg w-64 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm"
      />
      <select
        value={estado}
        onChange={(e) => onEstadoChange(e.target.value)}
        className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900 text-sm"
      >
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="pausado">Pausado</option>
        <option value="archivado">Archivado</option>
      </select>
    </div>
  );
}

function RowActions({
  cupon,
  onPausar,
  onActivar,
  onEdit,
  onDelete,
}: {
  cupon: CuponListItem;
  onPausar: () => void;
  onActivar: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {cupon.estado === 'activo' ? (
        <Button variant="ghost" size="sm" onClick={onPausar} title="Pausar" className="text-yellow-600 hover:text-yellow-700">
          <Pause className="w-4 h-4" />
        </Button>
      ) : cupon.estado === 'pausado' ? (
        <Button variant="ghost" size="sm" onClick={onActivar} title="Activar" className="text-green-600 hover:text-green-700">
          <Play className="w-4 h-4" />
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" onClick={onEdit} title="Editar" className="text-blue-600 hover:text-blue-700">
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} title="Eliminar" className="text-red-600 hover:text-red-700">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
