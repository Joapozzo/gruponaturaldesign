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

      <Section
        padding="none"
        className="pt-2 sm:pt-3 pb-6 sm:pb-8"
        contentClassName="w-full px-4 lg:px-15"
        noPadding
      >
        <div
          className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8 gap-4 sm:gap-6 mb-6 sm:mb-8"
          style={{ overflow: 'visible' }}
        >
          <div className="shrink-0 w-full lg:w-auto relative overflow-visible">
            <ProductImageGallerySkeleton />
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="animate-pulse">
                <div className="h-7 sm:h-8 lg:h-9 bg-gray-200 rounded w-3/4" />
              </div>

              <ProductInfoSkeleton />
              <ProductVariantsSkeleton />

              <div className="animate-pulse">
                <div className="h-11 sm:h-12 bg-gray-200 rounded w-full" />
              </div>
            </div>

            <div className="animate-pulse mt-6 sm:mt-8 rounded-xl border border-neutral-200/80 divide-y divide-neutral-100">
              <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>

        <RelatedProductsSkeleton />
      </Section>
    </div>
  );
}
