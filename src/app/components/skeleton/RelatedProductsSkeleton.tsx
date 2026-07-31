import ProductCardSkeleton from '../ProductCardSkeleton';

export function RelatedProductsSkeleton() {
  return (
    <div className="mt-12 sm:mt-16 pt-4 sm:pt-6">
      <div className="h-7 sm:h-8 bg-gray-200 rounded w-48 mx-auto mb-6 sm:mb-8 animate-pulse" />
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
