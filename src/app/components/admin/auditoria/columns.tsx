'use client';

import React from 'react';
import { TableColumn } from '@/components/ui/Table';
import type { AuditLogItem } from '@/app/types/audit.types';

const ENTITY_LABELS: Record<string, string> = {
  producto_padre: 'Producto padre',
  producto_web: 'Producto web',
  producto_precio: 'Precio',
  producto_imagen: 'Imagen',
  cliente: 'Cliente',
  pedido: 'Pedido',
  pedido_item: 'Item pedido',
  usuario: 'Usuario',
  sesion: 'Sesión',
  rubro: 'Rubro',
  subrubro: 'Subrubro',
  empresa: 'Empresa',
  regla_parseo: 'Regla parseo',
  campo_personalizado: 'Campo personalizado',
  sync: 'Sync',
  otro: 'Otro',
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  DELETE: 'Eliminar',
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export function getAuditoriaColumns(): TableColumn<AuditLogItem>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600 whitespace-nowrap">
          {formatDate(row.original.createdAt)}
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
        const summary = row.original.summary;
        if (summary) {
          return (
            <span className="text-sm text-neutral-700 max-w-[280px] block" title={summary}>
              {summary}
            </span>
          );
        }
        const oldV = row.original.oldValues;
        const newV = row.original.newValues;
        if (row.original.action === 'DELETE' && oldV) return <span className="text-sm text-neutral-500">Registro eliminado</span>;
        if (newV && typeof newV === 'object' && !Array.isArray(newV)) {
          const parts = Object.entries(newV as Record<string, unknown>)
            .filter(([k]) => !['createdAt', 'updatedAt', 'empresaId'].includes(k))
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${String(v)}`);
          return <span className="text-sm text-neutral-500">{parts.join('; ') || '—'}</span>;
        }
        return <span className="text-sm text-neutral-400">—</span>;
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
