'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMisPedidos } from '@/app/services/cuentaPedidos.service';
import type { CuentaPedidoListItem } from '@/app/validation/cuentaPedidos.schema';

const PAGE_SIZE = 10;

export const misPedidosQueryKey = ['cuenta', 'pedidos'] as const;

export function useMisPedidosList(enabled: boolean) {
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<CuentaPedidoListItem[]>([]);

  const query = useQuery({
    queryKey: [...misPedidosQueryKey, page],
    queryFn: () => getMisPedidos({ page, limit: PAGE_SIZE }),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!query.data?.data) return;
    setOrders((prev) => {
      if (page === 1) return query.data.data;
      const ids = new Set(prev.map((o) => o.id));
      const next = query.data.data.filter((o) => !ids.has(o.id));
      return [...prev, ...next];
    });
  }, [query.data, page]);

  useEffect(() => {
    if (!enabled) {
      setPage(1);
      setOrders([]);
    }
  }, [enabled]);

  const loadMore = useCallback(() => {
    if (query.data?.pagination && page < query.data.pagination.totalPages) {
      setPage((p) => p + 1);
    }
  }, [page, query.data?.pagination]);

  const retry = useCallback(() => {
    setPage(1);
    setOrders([]);
    void query.refetch();
  }, [query]);

  const hasMore =
    query.data?.pagination != null && page < query.data.pagination.totalPages;

  const isInitialLoading = enabled && query.isPending && orders.length === 0;
  const isLoadingMore = query.isFetching && page > 1;

  return {
    orders,
    pagination: query.data?.pagination,
    isInitialLoading,
    isLoadingMore,
    isFetching: query.isFetching,
    error: query.error,
    hasMore,
    loadMore,
    retry,
  };
}
