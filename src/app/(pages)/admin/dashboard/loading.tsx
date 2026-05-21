import {
  DashboardFiltersSkeleton,
  DashboardSnapshotBarSkeleton,
  DashboardKpisGridSkeleton,
  DashboardSerieVentasSkeleton,
  DashboardAlertasSkeleton,
  DashboardPedidosRecientesSkeleton,
  DashboardStockCriticoSkeleton,
} from '@/app/components/admin/dashboard/skeletons';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <DashboardFiltersSkeleton />
        <DashboardSnapshotBarSkeleton />
        <DashboardKpisGridSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardSerieVentasSkeleton />
        </div>
        <DashboardAlertasSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardPedidosRecientesSkeleton />
        <DashboardStockCriticoSkeleton />
      </div>
    </div>
  );
}
