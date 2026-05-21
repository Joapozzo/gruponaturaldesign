export function DashboardSnapshotBarSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-1">
        <div className="w-8 h-8 rounded-full bg-yellow-200 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-yellow-200 rounded animate-pulse w-8" />
          <div className="h-3 bg-yellow-100 rounded animate-pulse w-32" />
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex-1">
        <div className="w-8 h-8 rounded-full bg-red-200 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-red-200 rounded animate-pulse w-8" />
          <div className="h-3 bg-red-100 rounded animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}
