export function DashboardSerieVentasSkeleton() {
  const bars = [40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 65, 90, 55, 70, 60, 80, 45, 75, 65, 90, 55, 70, 60, 80, 45, 75, 65, 90, 55, 70];
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded animate-pulse w-40" />
          <div className="h-3 bg-neutral-100 rounded animate-pulse w-28" />
        </div>
        <div className="h-5 bg-neutral-100 rounded animate-pulse w-24" />
      </div>
      <div className="flex items-end gap-1 h-48">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-neutral-200 rounded-sm animate-pulse"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
