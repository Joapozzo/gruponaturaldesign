export function ProductInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-3 sm:space-y-4">
      <div className="h-7 sm:h-8 bg-gray-200 rounded w-28" />
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3.5 bg-gray-200 rounded w-5/6" />
        <div className="h-3.5 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
