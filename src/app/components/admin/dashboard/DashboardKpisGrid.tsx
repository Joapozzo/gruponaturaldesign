'use client';

import { motion } from 'framer-motion';
import { useDashboardKpis } from '@/app/hooks/dashboard';
import { DashboardKpiCard } from './DashboardKpiCard';
import { DashboardErrorState } from './DashboardErrorState';
import { DashboardEmptyState } from './DashboardEmptyState';
import {
  formatMoneyArs,
  formatInteger,
  pctDelta,
  decimalStringToNumber,
} from '@/app/utils/dashboard.utils';

const KPI_CONFIGS = [
  { key: 'pedidosNuevos', label: 'Pedidos nuevos', format: formatInteger, unit: '' },
  { key: 'ventasTotales', label: 'Ventas totales', format: formatMoneyArs, unit: '' },
  { key: 'cantidadPedidosVentas', label: 'Pedidos vendidos', format: formatInteger, unit: '' },
  { key: 'ticketPromedio', label: 'Ticket promedio', format: formatMoneyArs, unit: '' },
] as const;

export function DashboardKpisGrid() {
  const { data, isLoading, isError, refetch } = useDashboardKpis();

  if (isError) return <DashboardErrorState message="Error al cargar KPIs" onRetry={refetch} />;
  if (!data) return <DashboardEmptyState message="Sin datos de KPIs" />;

  const actual = data.metricas.actual;
  const anterior = data.metricas.anterior;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Indicadores clave de rendimiento"
    >
      {KPI_CONFIGS.map((cfg, i) => {
        const raw = actual[cfg.key as keyof typeof actual];
        const prevRaw = anterior?.[cfg.key as keyof typeof anterior];
        const value = typeof raw === 'number' ? raw : decimalStringToNumber(String(raw ?? '0'));
        const prev = typeof prevRaw === 'number' ? prevRaw : decimalStringToNumber(String(prevRaw ?? '0'));
        const delta = pctDelta(value, prev);

        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
          >
            <DashboardKpiCard
              label={cfg.label}
              value={cfg.format(value)}
              delta={delta}
              hasComparison={!!anterior}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
