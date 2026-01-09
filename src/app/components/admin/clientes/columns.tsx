'use client';

import type { ClienteResponse } from '@/app/types/cliente.types';
import { Badge } from '@/components/ui/Badge';

export type ClienteColumn = {
  id: string;
  razonSocial: string;
  nombre: string | null;
  sfactoryCodigo: string | null;
  cuit: string | null;
  email: string | null;
  telefono: string | null;
  activo: boolean;
  categoriaFiscal: string | null;
  createdAt: string;
};

export const clienteColumns = [
  {
    key: 'sfactoryCodigo',
    header: 'Código',
    render: (cliente: ClienteResponse) => (
      <span className="font-mono text-sm">{cliente.sfactoryCodigo || '-'}</span>
    ),
  },
  {
    key: 'razonSocial',
    header: 'Razón Social',
    render: (cliente: ClienteResponse) => (
      <span className="font-medium">{cliente.razonSocial}</span>
    ),
  },
  {
    key: 'nombre',
    header: 'Nombre',
    render: (cliente: ClienteResponse) => (
      <span>{cliente.nombre || '-'}</span>
    ),
  },
  {
    key: 'cuit',
    header: 'CUIT',
    render: (cliente: ClienteResponse) => (
      <span className="font-mono text-sm">{cliente.cuit || '-'}</span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (cliente: ClienteResponse) => (
      <span className="text-sm">{cliente.email || '-'}</span>
    ),
  },
  {
    key: 'telefono',
    header: 'Teléfono',
    render: (cliente: ClienteResponse) => (
      <span>{cliente.telefono || '-'}</span>
    ),
  },
  {
    key: 'categoriaFiscal',
    header: 'Categoría Fiscal',
    render: (cliente: ClienteResponse) => (
      <span className="text-sm">{cliente.categoriaFiscal || '-'}</span>
    ),
  },
  {
    key: 'activo',
    header: 'Estado',
    render: (cliente: ClienteResponse) => (
      <Badge variant={cliente.activo ? 'success' : 'danger'}>
        {cliente.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
];

