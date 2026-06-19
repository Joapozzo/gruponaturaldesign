import ProductDetailSkeleton from '@/app/components/producto/ProductDetailSkeleton';

/**
 * Loading UI mientras se resuelve la página del producto (SSR o navegación).
 * Evita pantalla en blanco en el primer render / navegación client-side.
 */
export default function ProductDetailLoading() {
  return <ProductDetailSkeleton />;
}
