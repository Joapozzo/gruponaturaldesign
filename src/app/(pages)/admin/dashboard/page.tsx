import { Suspense } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { DashboardSnapshotBar } from '@/app/components/admin/dashboard/DashboardSnapshotBar';
import { DashboardKpisGrid } from '@/app/components/admin/dashboard/DashboardKpisGrid';
import { DashboardSerieVentas } from '@/app/components/admin/dashboard/DashboardSerieVentas';
import { DashboardAlertas } from '@/app/components/admin/dashboard/DashboardAlertas';
import { DashboardPedidosRecientes } from '@/app/components/admin/dashboard/DashboardPedidosRecientes';
import { DashboardStockCritico } from '@/app/components/admin/dashboard/DashboardStockCritico';
import { DashboardFilters } from '@/app/components/admin/dashboard/DashboardFilters';
import {
  DashboardSnapshotBarSkeleton,
  DashboardKpisGridSkeleton,
  DashboardSerieVentasSkeleton,
  DashboardAlertasSkeleton,
  DashboardPedidosRecientesSkeleton,
  DashboardStockCriticoSkeleton,
} from '@/app/components/admin/dashboard/skeletons';
import { defaultDashboardRange } from '@/app/utils/dashboard.utils';
import type { DashboardFullQueryInput } from '@/app/types/dashboard.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function pickStr(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const defaults = defaultDashboardRange();

  const initial: DashboardFullQueryInput = {
    fechaDesde: pickStr(sp.fechaDesde) ?? defaults.desde,
    fechaHasta: pickStr(sp.fechaHasta) ?? defaults.hasta,
    compare: pickStr(sp.compare) !== 'false',
    segmentarTipoCliente: pickStr(sp.segmentar) !== 'false',
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen operativo y de ventas"
        action={<DashboardFilters initial={initial} />}
      />

      <div className="mt-6 space-y-6">
        <Suspense fallback={<DashboardSnapshotBarSkeleton />}>
          <DashboardSnapshotBar />
        </Suspense>

        <Suspense fallback={<DashboardKpisGridSkeleton />}>
          <DashboardKpisGrid />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<DashboardSerieVentasSkeleton />}>
              <DashboardSerieVentas />
            </Suspense>
          </div>
          <Suspense fallback={<DashboardAlertasSkeleton />}>
            <DashboardAlertas />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<DashboardPedidosRecientesSkeleton />}>
            <DashboardPedidosRecientes />
          </Suspense>
          <Suspense fallback={<DashboardStockCriticoSkeleton />}>
            <DashboardStockCritico />
          </Suspense>
        </div>
      </div>
    </>
  );
}
