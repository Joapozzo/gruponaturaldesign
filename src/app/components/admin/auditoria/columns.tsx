'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { TableColumn } from '@/components/ui/Table';
import type { AuditLogItem } from '@/app/types/audit.types';
import {
  ENTITY_LABELS,
  ACTION_LABELS,
  formatAuditDate,
  getAuditSummaryPreview,
  hasAuditDetail,
} from './auditDisplayUtils';

interface AuditoriaColumnsOptions {
  onViewDetail?: (item: AuditLogItem) => void;
}

export function getAuditoriaColumns(
  options?: AuditoriaColumnsOptions
): TableColumn<AuditLogItem>[] {
  const { onViewDetail } = options ?? {};

  return [
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600 whitespace-nowrap">
          {formatAuditDate(row.original.createdAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'entity',
      header: 'Entidad',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-neutral-800">
          {ENTITY_LABELS[row.original.entity] ?? row.original.entity}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'entityId',
      header: 'ID entidad',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600 font-mono">
          {row.original.entityId ?? '—'}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'action',
      header: 'Acción',
      cell: ({ row }) => (
        <span className="text-sm">
          {ACTION_LABELS[row.original.action] ?? row.original.action}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'summary',
      header: 'Qué cambió',
      cell: ({ row }) => {
        const item = row.original;
        const preview = getAuditSummaryPreview(item);
        const showDetail = hasAuditDetail(item);

        return (
          <div className="flex items-start gap-1.5 max-w-[300px]">
            <span
              className="text-sm text-neutral-700 flex-1 line-clamp-2"
              title={preview !== '—' ? preview : undefined}
            >
              {preview}
            </span>
            {showDetail && onViewDetail && (
              <button
                type="button"
                onClick={() => onViewDetail(item)}
                className="shrink-0 p-1 rounded text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                aria-label="Ver detalle completo"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'userEmail',
      header: 'Usuario',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">{row.original.userEmail ?? '—'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'method',
      header: 'Método',
      cell: ({ row }) => (
        <span className="text-sm font-mono text-neutral-600">{row.original.method ?? '—'}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'path',
      header: 'Path',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-500 truncate max-w-[200px] block" title={row.original.path ?? ''}>
          {row.original.path ?? '—'}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-500">{row.original.ipAddress ?? '—'}</span>
      ),
      enableSorting: false,
    },
  ];
}
