export function DashboardKpiCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
      <div className="h-3 bg-neutral-200 rounded animate-pulse w-24" />
      <div className="h-8 bg-neutral-200 rounded animate-pulse w-36" />
      <div className="h-5 bg-neutral-100 rounded animate-pulse w-20" />
    </div>
  );
}

export function DashboardKpisGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardKpiCardSkeleton />
      <DashboardKpiCardSkeleton />
      <DashboardKpiCardSkeleton />
      <DashboardKpiCardSkeleton />
    </div>
  );
}
