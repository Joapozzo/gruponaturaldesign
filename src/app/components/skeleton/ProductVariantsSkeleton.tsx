export function ProductVariantsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Colores */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Talles */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-12 h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

