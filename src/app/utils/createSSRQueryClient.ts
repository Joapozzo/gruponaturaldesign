import { QueryClient } from '@tanstack/react-query';

/**
 * Crea un QueryClient configurado para SSR
 * Centraliza la configuración de cache y refetch
 */
export function createSSRQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30, // 30 minutos - datos se consideran frescos
        gcTime: 1000 * 60 * 60 * 24, // 24 horas - mantener en cache
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

