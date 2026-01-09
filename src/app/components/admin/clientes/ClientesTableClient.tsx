'use client';

import React, { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';
import { useClientesTable } from '@/app/hooks/useClientesTable';
import { clienteColumns } from './columns';
import type { ClienteResponse } from '@/app/types/cliente.types';

interface ClientesTableClientProps {}

export function ClientesTableClient({}: ClientesTableClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = searchParams.get('search') || undefined;
  const activo = searchParams.get('activo') ? searchParams.get('activo') === 'true' : undefined;

  const { data, isLoading, isFetching, isError, error } = useClientesTable({
    params: {
      page,
      limit,
      search,
      activo,
    },
  });

  const columns: TableColumn<ClienteResponse>[] = useMemo(
    () =>
      clienteColumns.map((col) => ({
        accessorKey: col.key,
        header: col.header,
        cell: ({ row }: any) => col.render(row.original),
      })),
    []
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  if (isLoading || isFetching) {
    return (
      <Card variant="elevated" padding="none">
        <TableSkeleton rows={limit} columns={clienteColumns.length} showPagination={true} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-center py-12">
          <span className="text-red-600">
            Error al cargar clientes: {error instanceof Error ? error.message : 'Error desconocido'}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none">
      <Table
        data={data?.data || []}
        columns={columns}
        emptyMessage="No hay clientes disponibles"
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Card>
  );
}

