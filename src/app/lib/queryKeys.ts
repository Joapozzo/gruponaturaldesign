export const queryKeys = {
    products: {
        all: ['products'] as const,
        lists: () => [...queryKeys.products.all, 'list'] as const,
        list: (filters?: Record<string, any>) =>
            [...queryKeys.products.lists(), filters] as const,
        details: () => [...queryKeys.products.all, 'detail'] as const,
        detail: (code: string) => [...queryKeys.products.details(), code] as const,
        rubros: () => [...queryKeys.products.all, 'rubros'] as const,
        subrubros: () => [...queryKeys.products.all, 'subrubros'] as const,
    },
};