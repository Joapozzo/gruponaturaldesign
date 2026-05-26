'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Eye, RefreshCw, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, type TableColumn } from '@/components/ui/Table';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { useTableSearchParams } from '@/app/hooks/useTableSearchParams';
import { pedidoService } from '@/app/services/pedido.service';
import { pedidosKeys } from '@/app/utils/pedidosKeys';
import type { AdminPedidoRow, PedidoOrigenFilter } from '@/app/types/adminPedido.types';
import type { EstadoPedido } from '@/app/types/pedido.types';
import {
  applyAdminPedidosFilters,
  filterMergedRowsBySearch,
  filterRowsByFechaRange,
  mergePedidosLists,
  normalizeDateRange,
  paginateAdminPedidos,
  parseEstadoUrlParam,
  parseSyncStatusUrlParam,
} from '@/app/utils/adminPedidos.utils';
import { PedidoOrigenBadge } from './PedidoOrigenBadge';
import { PedidoDetailModal } from './PedidoDetailModal';
import {
  mapEstadoPedidoBadgeVariant,
  mapSfactoryEstadoBadgeVariant,
} from '@/app/utils/pedidoEstadoDisplay';

const estadosSFactory: Array<{ value: string; label: string }> = [
  { value: '', label: 'Todos' },
  { value: '1', label: 'Pendiente' },
  { value: '2', label: 'Confirmado' },
  { value: '3', label: 'Despachado' },
  { value: '4', label: 'Cancelado' },
  { value: '5', label: 'En Curso' },
];

const estadosWeb: Array<{ value: string; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'pendiente_confirmacion', label: 'Pend. confirmación' },
  { value: 'pendiente_pago', label: 'Falta el pago' },
  { value: 'procesando', label: 'Procesando' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'despachado', label: 'Despachado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'fallido', label: 'Fallido' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'vencido', label: 'Vencido' },
];

const origenOptions: Array<{ value: PedidoOrigenFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'ecommerce', label: 'Solo ecommerce' },
  { value: 'sfactory_erp', label: 'Solo SFactory ERP' },
];

function money(value: string | number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value));
}

function estadoSFactoryBadge(estado: string, estadoDesc: string | null) {
  return (
    <Badge variant={mapSfactoryEstadoBadgeVariant(estado)}>
      {estadoDesc || `Estado ${estado}`}
    </Badge>
  );
}

function estadoWebBadge(estadoInterno: EstadoPedido, label: string) {
  return <Badge variant={mapEstadoPedidoBadgeVariant(estadoInterno)}>{label}</Badge>;
}

function parseOrigenParam(value: string | null): PedidoOrigenFilter {
  if (value === 'ecommerce' || value === 'sfactory_erp') return value;
  return 'all';
}

export function PedidosTableClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [detailRow, setDetailRow] = useState<AdminPedidoRow | null>(null);

  const {
    page,
    limit: rawLimit,
    searchInput,
    debouncedSearch,
    setSearchInput,
    setPage,
    setLimit,
    clearSearch,
  } = useTableSearchParams({ defaultLimit: 10 });
  const limit = Math.min(100, Math.max(1, rawLimit));

  const origen = parseOrigenParam(searchParams.get('origen'));
  const estadoParam = searchParams.get('estado');
  const { estadoWeb, estadoSfactory } = parseEstadoUrlParam(estadoParam);
  const syncStatuses = parseSyncStatusUrlParam(searchParams.get('syncStatus'));

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const desde = searchParams.get('desde') || thirtyDaysAgo;
  const hasta = searchParams.get('hasta') || today;

  const mergeQueryBase = {
    desde,
    hasta,
    estado: estadoWeb,
    syncStatus: syncStatuses.length === 1 ? syncStatuses[0] : undefined,
    empresa_id: searchParams.get('empresa_id')
      ? parseInt(searchParams.get('empresa_id')!, 10)
      : undefined,
    comercial_id: searchParams.get('comercial_id')
      ? parseInt(searchParams.get('comercial_id')!, 10)
      : undefined,
  };

  const sfactoryMergeBase = {
    desde,
    hasta,
    empresa_id: mergeQueryBase.empresa_id,
    comercial_id: mergeQueryBase.comercial_id,
  };

  const webQuery = useQuery({
    queryKey: [...pedidosKeys.lists(), 'merge', mergeQueryBase],
    queryFn: () => pedidoService.getAllForMerge(mergeQueryBase),
    staleTime: 1000 * 60,
  });

  const sfactoryQuery = useQuery({
    queryKey: ['pedidos-sfactory', 'merge', sfactoryMergeBase],
    queryFn: () => pedidoService.getAllSFactoryForMerge(sfactoryMergeBase),
    staleTime: 1000 * 30,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['pedidos-sfactory'] });
    await queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
  };

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'aprobar' | 'cancelar' }) => {
      if (action === 'aprobar') return pedidoService.aprobarSFactory(id);
      return pedidoService.cancelarSFactory(id);
    },
    onSuccess: async (result) => {
      toast.success(result?.message || 'Pedido actualizado');
      await invalidate();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar el pedido');
    },
  });

  const pushParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      router.push(`?${next.toString()}`);
    },
    [router, searchParams]
  );

  const setFilterParam = useCallback(
    (key: string, value: string) => {
      pushParams((next) => {
        if (value) next.set(key, value);
        else next.delete(key);
        next.set('page', '1');
      });
    },
    [pushParams]
  );

  const setDesde = useCallback(
    (value: string) => {
      pushParams((next) => {
        const currentHasta = next.get('hasta') || today;
        const { desde: desdeVal, hasta: hastaVal } = normalizeDateRange(
          value,
          currentHasta,
          'desde'
        );
        next.set('desde', desdeVal);
        next.set('hasta', hastaVal);
        next.set('page', '1');
      });
    },
    [pushParams, today]
  );

  const setHasta = useCallback(
    (value: string) => {
      pushParams((next) => {
        const currentDesde = next.get('desde') || thirtyDaysAgo;
        const { desde: desdeVal, hasta: hastaVal } = normalizeDateRange(
          currentDesde,
          value,
          'hasta'
        );
        next.set('desde', desdeVal);
        next.set('hasta', hastaVal);
        next.set('page', '1');
      });
    },
    [pushParams, thirtyDaysAgo]
  );

  const mergedPage = useMemo(() => {
    const webRows = webQuery.data ?? [];
    const sfactoryRows = sfactoryQuery.data ?? [];

    const merged = mergePedidosLists(webRows, sfactoryRows);
    const byDate = filterRowsByFechaRange(merged, desde, hasta);
    const estadoSf = searchParams.get('estado_sf') || estadoSfactory || undefined;
    const filtered = applyAdminPedidosFilters(byDate, {
      origen,
      estadoSfactory: estadoSf || undefined,
      syncStatuses,
    });
    const bySearch = filterMergedRowsBySearch(filtered, debouncedSearch);
    return paginateAdminPedidos(bySearch, page, limit);
  }, [
    webQuery.data,
    sfactoryQuery.data,
    debouncedSearch,
    origen,
    estadoSfactory,
    syncStatuses,
    page,
    limit,
    desde,
    hasta,
    searchParams,
  ]);

  const columns: TableColumn<AdminPedidoRow>[] = useMemo(
    () => [
      {
        accessorKey: 'numero',
        header: 'Pedido',
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="min-w-[120px] space-y-1">
              <div className="font-semibold">{r.numero}</div>
              <div className="text-xs text-neutral-500">#{r.id}</div>
              <PedidoOrigenBadge row={r} />
            </div>
          );
        },
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <div className="font-medium">{row.original.cliente}</div>
            {row.original.clienteSub ? (
              <div className="text-xs text-neutral-500">{row.original.clienteSub}</div>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'estadoLabel',
        header: 'Estado',
        cell: ({ row }) => {
          const r = row.original;
          if (r.source === 'sfactory' && r.sfactory) {
            return estadoSFactoryBadge(r.sfactory.estado, r.sfactory.estado_d);
          }
          if (r.web) {
            return estadoWebBadge(r.web.estadoInterno, r.estadoLabel);
          }
          return <Badge variant="default">{r.estadoLabel}</Badge>;
        },
      },
      {
        accessorKey: 'titulo',
        header: 'Título',
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate text-sm text-neutral-700">
            {row.original.titulo || '—'}
          </div>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => <span className="font-medium">{money(row.original.total)}</span>,
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => new Date(row.original.fecha).toLocaleDateString('es-AR'),
      },
      {
        id: 'ver',
        header: 'Detalle',
        cell: ({ row }) => (
          <Button size="xs" variant="ghost" onClick={() => setDetailRow(row.original)} className="gap-1">
            <Eye className="w-3.5 h-3.5" />
            Ver pedido
          </Button>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const p = row.original.sfactory;
          if (!p) return null;
          const busy = actionMutation.isPending;
          return (
            <div className="flex items-center justify-end gap-2">
              {p.estado === '1' && (
                <Button
                  size="xs"
                  variant="black"
                  disabled={busy}
                  onClick={() => actionMutation.mutate({ id: p.id, action: 'aprobar' })}
                >
                  <Check className="w-3.5 h-3.5" />
                  Aprobar
                </Button>
              )}
              {(p.estado === '1' || p.estado === '5') && (
                <Button
                  size="xs"
                  variant="redOutline"
                  disabled={busy}
                  onClick={() => actionMutation.mutate({ id: p.id, action: 'cancelar' })}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [actionMutation]
  );

  const isLoading = webQuery.isLoading || sfactoryQuery.isLoading;
  const isError = webQuery.isError || sfactoryQuery.isError;
  const error = webQuery.error ?? sfactoryQuery.error;

  const refetch = () => {
    void webQuery.refetch();
    void sfactoryQuery.refetch();
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="none">
        <TableSkeleton rows={limit} columns={8} showPagination />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card variant="elevated" padding="md">
        <div className="py-10 text-center text-sm text-red-700">
          {error instanceof Error ? error.message : 'Error al cargar pedidos'}
        </div>
        <div className="flex justify-center">
          <Button onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="elevated" padding="md">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-md">
            <span className="text-xs font-medium text-neutral-600">Buscar</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                placeholder="ID, cliente, email, WEB-, PE-..."
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 w-full pl-9 pr-9 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-600">Origen</span>
            <select
              value={origen}
              onChange={(e) => setFilterParam('origen', e.target.value === 'all' ? '' : e.target.value)}
              className="h-9 w-40 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md bg-white"
            >
              {origenOptions.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-600">Desde</span>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="h-9 w-36 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-600">Hasta</span>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="h-9 w-36 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-600">Estado ecommerce</span>
            <select
              value={estadoWeb ?? ''}
              onChange={(e) => setFilterParam('estado', e.target.value)}
              className="h-9 w-44 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md bg-white"
            >
              {estadosWeb.map((x) => (
                <option key={x.value || 'all'} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral-600">Estado SFactory</span>
            <select
              value={estadoSfactory ?? searchParams.get('estado_sf') ?? ''}
              onChange={(e) => setFilterParam('estado_sf', e.target.value)}
              className="h-9 w-32 border border-neutral-300 px-2 text-sm outline-none focus:border-black rounded-md bg-white"
            >
              {estadosSFactory.map((x) => (
                <option key={x.value || 'all'} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mt-3">
          Listado unificado: pedidos del ecommerce (incluidos sin sincronizar a SFactory) y pedidos
          creados solo en SFactory. Total visible: {mergedPage.pagination.total}.
        </p>
      </Card>

      <Card variant="elevated" padding="none">
        <Table
          data={mergedPage.data}
          columns={columns}
          emptyMessage="No hay pedidos que coincidan con los filtros"
          pagination={mergedPage.pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Card>
      <PedidoDetailModal
        row={detailRow}
        isOpen={detailRow != null}
        onClose={() => setDetailRow(null)}
      />
    </div>
  );
}
