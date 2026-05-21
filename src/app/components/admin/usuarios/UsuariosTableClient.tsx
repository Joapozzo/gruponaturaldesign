'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, UserX, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table, type TableColumn } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import { usuarioService } from '@/app/services/usuario.service';
import type { Usuario } from '@/app/types/usuario.types';
import { useUsuarioModal } from './useUsuarioModal';

const rolLabels: Record<string, string> = {
  admin: 'Admin',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
};

const rolBadgeVariant: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  admin: 'success',
  vendedor: 'warning',
  cliente: 'info',
};

export function UsuariosTableClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openEdit } = useUsuarioModal();
  const [desactivateTarget, setDesactivateTarget] = useState<{ id: number; nombre: string } | null>(null);
  const [activateTarget, setActivateTarget] = useState<{ id: number; nombre: string } | null>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const q = searchParams.get('q') || undefined;
  const rol = searchParams.get('rol') as 'admin' | 'vendedor' | 'cliente' | undefined;
  const activo = searchParams.get('activo');

  const params = { page, limit, q, rol, activo: activo === 'true' ? true : activo === 'false' ? false : undefined };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuarioService.listar(params),
  });

  const desactivateMutation = useMutation({
    mutationFn: (id: number) => usuarioService.desactivar(id),
    onSuccess: () => {
      toast.success('Usuario desactivado');
      refetch();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo desactivar');
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => usuarioService.habilitar(id),
    onSuccess: () => {
      toast.success('Usuario habilitado');
      refetch();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo habilitar');
    },
  });

  type LocalCol = {
    key: string;
    header: string;
    cell: (ctx: { row: { original: Usuario } }) => ReactNode;
  };
  const columns: LocalCol[] = [
    {
      key: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="font-medium text-neutral-900">{row.original.email}</span>,
    },
    {
      key: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="text-neutral-900">
          {row.original.nombre} {row.original.apellido ?? ''}
        </span>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      cell: ({ row }) => <span className="text-neutral-900">{row.original.telefono || '-'}</span>,
    },
    {
      key: 'rol',
      header: 'Rol',
      cell: ({ row }) => {
        const u = row.original;
        return (
          <Badge variant={rolBadgeVariant[u.rol] || 'default'}>
            {rolLabels[u.rol] || u.role?.name || u.rol}
          </Badge>
        );
      },
    },
    {
      key: 'activo',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.activo ? 'success' : 'danger'}>
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const isActive = row.original.activo;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEdit(row.original)}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            {isActive ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700"
                onClick={() => {
                  setDesactivateTarget({ id: row.original.id, nombre: `${row.original.nombre} ${row.original.apellido || ''}`.trim() });
                }}
                title="Desactivar"
              >
                <UserX className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => {
                  setActivateTarget({ id: row.original.id, nombre: `${row.original.nombre} ${row.original.apellido || ''}`.trim() });
                }}
                title="Habilitar"
              >
                <UserCheck className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card variant="elevated" padding="none">
        <TableSkeleton rows={limit} columns={6} showPagination />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-center py-12">
          <span className="text-red-600">Error al cargar usuarios</span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const next = new URLSearchParams(searchParams.toString());
              next.set('page', '1');
              next.set('q', e.currentTarget.value);
              router.push(`?${next.toString()}`);
            }
          }}
          className="px-3 py-2 border border-neutral-300 rounded-lg w-64 bg-white text-neutral-900 placeholder:text-neutral-400"
        />
        <select
          defaultValue={rol || ''}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams.toString());
            next.set('page', '1');
            if (e.target.value) next.set('rol', e.target.value);
            else next.delete('rol');
            router.push(`?${next.toString()}`);
          }}
          className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="vendedor">Vendedor</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>

      <Card variant="elevated" padding="none">
        <Table
          data={data?.data || []}
          columns={columns as unknown as TableColumn<Usuario>[]}
          emptyMessage="No hay usuarios disponibles"
          pagination={{
            page,
            limit,
            total: data?.pagination?.total || 0,
            totalPages: data?.pagination?.totalPages || 0,
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={(newPage) => {
            const next = new URLSearchParams(searchParams.toString());
            next.set('page', String(newPage));
            router.push(`?${next.toString()}`);
          }}
          onLimitChange={(newLimit) => {
            const next = new URLSearchParams(searchParams.toString());
            next.set('page', '1');
            next.set('limit', String(newLimit));
            router.push(`?${next.toString()}`);
          }}
        />
      </Card>

      <ConfirmModal
        isOpen={!!desactivateTarget}
        onClose={() => setDesactivateTarget(null)}
        onConfirm={() => {
          if (desactivateTarget) {
            desactivateMutation.mutate(desactivateTarget.id, {
              onSettled: () => setDesactivateTarget(null),
            });
          }
        }}
        title="¿Desactivar usuario?"
        message={`¿Estás seguro de desactivar "${desactivateTarget?.nombre}"? El usuario no podrá volver a iniciar sesión.`}
        type="warning"
        confirmText="Desactivar"
        cancelText="Cancelar"
        loading={desactivateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!activateTarget}
        onClose={() => setActivateTarget(null)}
        onConfirm={() => {
          if (activateTarget) {
            activateMutation.mutate(activateTarget.id, {
              onSettled: () => setActivateTarget(null),
            });
          }
        }}
        title="¿Habilitar usuario?"
        message={`¿Estás seguro de habilitar "${activateTarget?.nombre}"? El usuario podrá volver a iniciar sesión.`}
        type="success"
        confirmText="Habilitar"
        cancelText="Cancelar"
        loading={activateMutation.isPending}
      />
    </>
  );
}