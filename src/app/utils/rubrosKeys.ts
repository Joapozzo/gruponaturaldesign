/**
 * Query keys centralizadas para rubros
 * Facilita invalidación y cache consistente con React Query
 */

import type { RubroQueryParams } from '../types/rubro.types';

export const rubrosKeys = {
  all: ['rubros'] as const,
  lists: () => [...rubrosKeys.all, 'list'] as const,
  list: (params?: RubroQueryParams) => [...rubrosKeys.lists(), params] as const,
};
