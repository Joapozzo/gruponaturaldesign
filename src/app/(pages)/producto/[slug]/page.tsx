import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import ProductDetailPageContent from '@/app/components/producto/ProductDetailPageContent';
import ProductDetailSkeleton from '@/app/components/producto/ProductDetailSkeleton';
import type { ProductoPadreConVariantes } from '@/app/types/producto-detail.types';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { adaptProductoPadreToGroupedProduct } from '@/app/utils/adaptProductoDetail';
import type { ProductoDetailResponse } from '@/app/services/producto-detail.service';

const META_DESCRIPTION_MAX = 160;

function buildMetaDescription(producto: ProductoPadreConVariantes): string | undefined {
  const raw =
    producto.metaDescription?.trim() ||
    producto.descripcionCorta?.trim() ||
    producto.descripcionMarketing?.trim() ||
    producto.descripcion?.trim();
  if (!raw) return undefined;
  if (raw.length <= META_DESCRIPTION_MAX) return raw;
  return `${raw.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`;
}

// SSR: Fetch inicial del producto
async function getProductData(slug: string): Promise<ProductoDetailResponse | null> {
  try {
    const empresaId = getEmpresaId();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
    
    // El slug ya viene decodificado de Next.js, pero puede tener caracteres especiales
    // Solo codificamos si es necesario (si tiene caracteres que necesitan encoding)
    const encodedSlug = slug.includes('%') ? slug : encodeURIComponent(slug);
    const url = `${apiUrl}/productos/slug/${encodedSlug}?empresaId=${empresaId}&includeVariantes=true`;
    
    // console.log('[ProductDetailPage] Fetching product:', { 
    //   originalSlug: slug, 
    //   encodedSlug, 
    //   empresaId, 
    //   url 
    // });
    
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidar cada 60 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // console.log('[ProductDetailPage] Response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        // console.log('[ProductDetailPage] Product not found (404)');
        return null;
      }
      const errorText = await response.text();
      console.error('[ProductDetailPage] Error response:', errorText);
      throw new Error(`Failed to fetch product: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // console.log('[ProductDetailPage] Response data:', { 
    //   success: data.success, 
    //   hasData: !!data.data,
    //   hasProducto: !!data.data?.producto 
    // });
    
    // Validar estructura de respuesta
    if (data.success && data.data) {
      return data.data as ProductoDetailResponse;
    }
    
    return null;
  } catch (error) {
    console.error('[ProductDetailPage] Error fetching product:', error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productData = await getProductData(slug);

  if (!productData?.producto) {
    return { title: 'Producto no encontrado' };
  }

  const p = productData.producto;
  const title = p.metaTitle?.trim() || p.nombre;
  const description = buildMetaDescription(p);
  const grouped = adaptProductoPadreToGroupedProduct(p);
  const ogImage = grouped.displayProduct.imagen;

  const pathSlug = p.slug?.trim() || slug;
  const canonicalPath = `/producto/${pathSlug}`;

  const keywords = [p.rubro?.nombre, p.subrubro?.nombre].filter(
    (k): k is string => Boolean(k)
  );

  return {
    title,
    description,
    ...(keywords.length > 0 && { keywords }),
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalPath,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const productData = await getProductData(slug);

  if (!productData?.producto) {
    notFound();
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailPageContent 
          initialData={productData}
          slug={slug}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
