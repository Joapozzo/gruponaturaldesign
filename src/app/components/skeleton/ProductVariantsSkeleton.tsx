export function ProductVariantsSkeleton() {
  return (
    <div className="animate-pulse space-y-4 w-full">
      <div className="space-y-2">
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-24" />
        <div className="flex flex-wrap gap-2 sm:gap-2.5 p-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-9 w-9 sm:h-10 sm:w-10 bg-gray-200 rounded-full shrink-0"
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3.5 sm:h-4 bg-gray-200 rounded w-20" />
        <div className="flex flex-nowrap gap-2 sm:gap-2.5 p-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 sm:h-10 min-w-9 shrink-0 px-3 bg-gray-200 rounded flex-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
