/**
 * Query keys para detalle de producto por slug (público / ecommerce)
 * Permite cache e invalidación consistente con React Query
 */
export const productDetailKeys = {
  all: ['producto-detail'] as const,
  detailBySlug: (slug: string) => [...productDetailKeys.all, 'slug', slug] as const,
};
