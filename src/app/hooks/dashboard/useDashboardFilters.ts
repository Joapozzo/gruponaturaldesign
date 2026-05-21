'use client';

import { useState, useCallback } from 'react';
import type { DashboardFullQueryInput } from '@/app/types/dashboard.types';
import { toYmd, defaultDashboardRange } from '@/app/utils/dashboard.utils';

export function useDashboardFilters() {
  const defaults = defaultDashboardRange();

  const [fechaDesde, setFechaDesde] = useState<string>(defaults.desde);
  const [fechaHasta, setFechaHasta] = useState<string>(defaults.hasta);
  const [compare, setCompare] = useState(true);
  const [segmentarTipoCliente, setSegmentarTipoCliente] = useState(true);

  const input: DashboardFullQueryInput = {
    fechaDesde,
    fechaHasta,
    compare,
    segmentarTipoCliente,
  };

  const setRange = useCallback((desde: string, hasta: string) => {
    setFechaDesde(desde);
    setFechaHasta(hasta);
  }, []);

  const setLastDays = useCallback((days: number) => {
    const hasta = toYmd(new Date());
    const desde = toYmd(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
    setFechaDesde(desde);
    setFechaHasta(hasta);
  }, []);

  return {
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    compare,
    setCompare,
    segmentarTipoCliente,
    setSegmentarTipoCliente,
    input,
    setRange,
    setLastDays,
  };
}
