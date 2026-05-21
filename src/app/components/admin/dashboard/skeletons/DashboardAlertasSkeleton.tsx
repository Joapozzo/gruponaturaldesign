export function DashboardAlertasSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-3 bg-neutral-200 rounded animate-pulse w-32" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-28" />
                <div className="h-2.5 bg-neutral-100 rounded animate-pulse w-20" />
              </div>
            </div>
          ))}
          {i < 3 && <div className="border-t border-neutral-100" />}
        </div>
      ))}
    </div>
  );
}
