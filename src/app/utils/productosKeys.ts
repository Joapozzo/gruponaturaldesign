/**
 * Query keys centralizadas para productos
 * Facilita invalidación y mantenimiento
 */
export const productosKeys = {
  all: ['productos'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: (
    empresaId: number,
    page?: number,
    limit?: number,
    search?: string,
    rubroId?: number,
    subrubroId?: number,
    sexo?: string,
    color?: string,
    talle?: string,
    stockMin?: number,
    stockMax?: number,
    orderBy?: string,
    orderDirection?: string
  ) =>
    [
      ...productosKeys.lists(),
      empresaId,
      page,
      limit,
      search,
      rubroId,
      subrubroId,
      sexo,
      color,
      talle,
      stockMin,
      stockMax,
      orderBy,
      orderDirection,
    ] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: number) => [...productosKeys.details(), id] as const,
};

