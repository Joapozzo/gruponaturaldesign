'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Table as TanstackTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export type TableColumn<T> = ColumnDef<T> & {
  header: string | ((props: any) => React.ReactNode);
  accessorKey?: string;
  cell?: (props: any) => React.ReactNode;
};

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  // Paginación
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
}

export function Table<T>({
  data,
  columns,
  onRowClick,
  className,
  emptyMessage = 'No hay datos disponibles',
  enableSorting = true,
  enableFiltering = false,
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: !!pagination, // Si hay paginación, es manual (del servidor)
  });

  const handlePageChange = (newPage: number) => {
    if (pagination && onPageChange && newPage >= 1 && newPage <= pagination.totalPages) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (onLimitChange) {
      onLimitChange(newLimit);
      // No llamar onPageChange(1) aquí: el hook (ej. useTableSearchParams) ya resetea la página en setLimit.
      // Llamar ambos provocaba que setPage(1) usara un limit obsoleto del closure y pisara el nuevo limit en la URL.
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-neutral-200 bg-neutral-50">
                {headerGroup.headers.map((header) => {
                  const canSort = enableSorting && header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();
                  
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-left text-sm font-semibold text-neutral-700',
                        canSort && 'cursor-pointer select-none hover:bg-neutral-100'
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {typeof header.column.columnDef.header === 'function'
                          ? flexRender(header.column.columnDef.header, header.getContext())
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <span className="flex-shrink-0">
                            {sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : sortDirection === 'desc' ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronsUpDown className="w-4 h-4 text-neutral-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-neutral-100 hover:bg-neutral-50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-neutral-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              Mostrando{' '}
              <span className="font-medium">
                {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              de <span className="font-medium">{pagination.total}</span> resultados
            </span>
            {onLimitChange && (
              <div className="flex items-center gap-2">
                <label htmlFor="page-size" className="text-sm text-neutral-600">
                  Por página:
                </label>
                <select
                  id="page-size"
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                pagination.page <= 1
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-neutral-600 hover:bg-neutral-200'
              )}
              title="Página anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      'px-3 py-1 text-sm rounded-md transition-colors',
                      pagination.page === pageNum
                        ? 'bg-black text-white font-medium'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                pagination.page >= pagination.totalPages
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-neutral-600 hover:bg-neutral-200'
              )}
              title="Página siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { TanstackTable };

