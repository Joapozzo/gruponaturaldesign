export function ProductImageGallerySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Imagen principal */}
      <div className="aspect-square bg-gray-200 rounded-lg" />
      
      {/* Miniaturas */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

