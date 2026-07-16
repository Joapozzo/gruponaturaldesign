/**
 * Query keys centralizadas para subrubros
 */

import type { SubrubroQueryParams } from '../types/rubro.types';

export const subrubrosKeys = {
  all: ['subrubros'] as const,
  lists: () => [...subrubrosKeys.all, 'list'] as const,
  list: (params?: SubrubroQueryParams) => [...subrubrosKeys.lists(), params] as const,
};
