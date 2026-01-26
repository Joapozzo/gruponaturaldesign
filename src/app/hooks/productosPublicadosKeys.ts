/**
 * Query keys para productos publicados
 * Separado del hook para poder ser usado en Server Components (prefetch)
 */

import type { ProductoPublicadoQueryParams } from '../types/producto-publicado.types';

export const productosPublicadosKeys = {
  all: ['productos-publicados'] as const,
  lists: () => [...productosPublicadosKeys.all, 'list'] as const,
  list: (params?: ProductoPublicadoQueryParams) => 
    [...productosPublicadosKeys.lists(), params] as const,
};

export const productosDestacadosKeys = {
  all: ['productos-destacados'] as const,
  lists: () => [...productosDestacadosKeys.all, 'list'] as const,
  list: (params?: Omit<ProductoPublicadoQueryParams, 'destacado'>) => 
    [...productosDestacadosKeys.lists(), params] as const,
};

