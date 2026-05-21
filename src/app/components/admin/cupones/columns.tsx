'use client';

import type { CuponListItem } from '@/app/types/cupones';
import { AdminCuponEstadoBadge } from '@/components/cupon/AdminCuponEstadoBadge';
import { AdminCuponTipoLabel } from '@/components/cupon/AdminCuponTipoLabel';

function formatDate(date: string | null) {
  if (!date) return 'Sin límite';
  return new Date(date).toLocaleDateString('es-AR');
}

function formatAlcance(alcance: string) {
  return alcance.replace(/_/g, ' ');
}

export const cuponColumns = [
  {
    key: 'codigo',
    header: 'Código',
    render: (cupon: CuponListItem) => (
      <span className="font-mono text-sm font-medium">{cupon.codigo}</span>
    ),
  },
  {
    key: 'nombre',
    header: 'Nombre',
    render: (cupon: CuponListItem) => <span>{cupon.nombre}</span>,
  },
  {
    key: 'alcance',
    header: 'Alcance',
    render: (cupon: CuponListItem) => (
      <span className="capitalize text-sm">{formatAlcance(cupon.alcance)}</span>
    ),
  },
  {
    key: 'descuento',
    header: 'Descuento',
    render: (cupon: CuponListItem) => (
      <AdminCuponTipoLabel tipo={cupon.tipoDescuento} valor={cupon.valorDescuento} />
    ),
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (cupon: CuponListItem) => <AdminCuponEstadoBadge estado={cupon.estado} />,
  },
  {
    key: 'uso',
    header: 'Uso',
    render: (cupon: CuponListItem) => (
      <span className="text-sm text-neutral-600">
        {cupon.usoActual}
        {cupon.usoMaximo ? `/${cupon.usoMaximo}` : ''}
      </span>
    ),
  },
  {
    key: 'fechaFin',
    header: 'Válido hasta',
    render: (cupon: CuponListItem) => (
      <span className="text-sm text-neutral-600">{formatDate(cupon.fechaFin)}</span>
    ),
  },
];
