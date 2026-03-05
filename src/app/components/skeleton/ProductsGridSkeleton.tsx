import ProductCardSkeleton from "../ProductCardSkeleton"

const ProductsGridSkeleton = () => {
    return (
        <div className="w-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <ProductCardSkeleton key={i} index={i} />
                ))}
            </div>
        </div>
    )
}

export default ProductsGridSkeleton