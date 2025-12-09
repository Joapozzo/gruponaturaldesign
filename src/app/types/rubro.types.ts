// Tipos para Rubros basados en el backend

export interface RubroResponse {
  id: number;
  empresaId: number;
  sfactoryId: number;
  sfactoryCodigo: string | null;
  nombre: string;
  codigoExterno: string | null;
  visibleWeb: boolean;
  orden: number;
  slug: string | null;
  descripcionWeb: string | null;
  imagenUrl: string | null;
  ultimaSync: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SubrubroResponse {
  id: number;
  empresaId: number;
  rubroId: number;
  sfactoryId: number;
  sfactoryCodigo: string | null;
  sfactoryRubroId: number;
  nombre: string;
  codigoExterno: string | null;
  visibleWeb: boolean;
  orden: number;
  slug: string | null;
  descripcionWeb: string | null;
  imagenUrl: string | null;
  ultimaSync: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RubroConSubrubros extends RubroResponse {
  subrubros?: SubrubroResponse[];
  _count?: {
    subrubros: number;
    productosPadre: number;
  };
}

export interface SubrubroConRubro extends SubrubroResponse {
  rubro?: {
    id: number;
    nombre: string;
    slug: string | null;
  };
  _count?: {
    productosPadre: number;
  };
}

export interface RubroQueryParams {
  empresaId?: number;
  visibleWeb?: boolean;
  includeSubrubros?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubrubroQueryParams {
  empresaId?: number;
  rubroId?: number;
  visibleWeb?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

