export function ProductInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Precio */}
      <div className="h-8 bg-gray-200 rounded w-32" />
      
      {/* Descripción */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Especificaciones */}
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

