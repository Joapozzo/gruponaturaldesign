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
      <Section className="pt-4 pb-6">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ProductImageGallerySkeleton />
          <div className="space-y-6">
            <ProductInfoSkeleton />
            <ProductVariantsSkeleton />
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

