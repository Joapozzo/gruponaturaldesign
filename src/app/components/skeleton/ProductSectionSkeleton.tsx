import ProductCardSkeleton from "../ProductCardSkeleton";


export default function ProductosDestacadosSkeleton() {
    return (
      <section id="productos" className="bg-gray-50 pb-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12">
          <h2 className="text-3xl font-bold text-center mb-4">Productos destacados</h2>
          <p className="text-center text-gray-600 mb-8">
            Lo mejor de nuestro shop online en diseño, calidad y funcionalidad.
          </p>
          <div className="w-full max-w-8xl mx-auto overflow-hidden">
            {/* Grid que simula el layout del Swiper: 4 columnas en desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }