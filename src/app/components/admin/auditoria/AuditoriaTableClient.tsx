'use client';

import React, { useMemo } from 'react';
import { Table } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';
import { useAuditoriaTable } from '@/app/hooks/useAuditoriaTable';
import { useTableSearchParams } from '@/app/hooks/useTableSearchParams';
import { useAuditoriaFiltersWithParams } from '@/app/filters/hooks/useAuditoriaFiltersWithParams';
import { AuditoriaFilters } from './AuditoriaFilters';
import { getAuditoriaColumns } from './columns';

interface AuditoriaTableClientProps {
  empresaId: number;
}

export function AuditoriaTableClient({ empresaId }: AuditoriaTableClientProps) {
  const { page, limit, setPage, setLimit } = useTableSearchParams({ defaultLimit: 20 });
  const filters = useAuditoriaFiltersWithParams();

  const { auditLogs, pagination, isLoading, isError, error } = useAuditoriaTable({
    empresaId,
    page,
    limit,
    filters: filters.filters,
  });

  const columns = useMemo(() => getAuditoriaColumns(), []);

  return (
    <div className="mt-8 space-y-4">
      <AuditoriaFilters filters={filters} disabled={isLoading} />

      <Card variant="elevated" padding="none">
        {isLoading ? (
          <TableSkeleton rows={limit} columns={8} showPagination />
        ) : isError ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-red-600">
              Error al cargar auditoría: {error instanceof Error ? error.message : 'Error desconocido'}
            </span>
          </div>
        ) : (
          <Table<typeof auditLogs[0]>
            data={auditLogs}
            columns={columns}
            emptyMessage="No hay registros de auditoría"
            enableSorting={false}
            pagination={{
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.totalPages,
            }}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </Card>
    </div>
  );
}
