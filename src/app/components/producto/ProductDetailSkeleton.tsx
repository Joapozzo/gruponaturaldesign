import { ProductHeaderSkeleton } from '../skeleton/ProductHeaderSkeleton';
import { ProductImageGallerySkeleton } from '../skeleton/ProductImageGallerySkeleton';
import { ProductInfoSkeleton } from '../skeleton/ProductInfoSkeleton';
import { ProductVariantsSkeleton } from '../skeleton/ProductVariantsSkeleton';
import { RelatedProductsSkeleton } from '../skeleton/RelatedProductsSkeleton';
import Section from '@/app/components/Section';

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <ProductHeaderSkeleton />
      <Section padding="none" className="pt-2 sm:pt-3 pb-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ProductImageGallerySkeleton />
          <div className="space-y-6">
            <ProductInfoSkeleton />
            <ProductVariantsSkeleton />
            <div className="animate-pulse rounded-xl border border-neutral-200/80 divide-y divide-neutral-100">
              <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
            {/* Controles de cantidad */}
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
        <RelatedProductsSkeleton />
      </Section>
    </div>
  );
}

