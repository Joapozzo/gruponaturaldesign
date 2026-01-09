// Tipos para Clientes basados en el backend

export interface ClienteResponse {
  id: number;
  empresaId: number;
  sfactoryId: number | null;
  sfactoryCodigo: string | null;
  razonSocial: string;
  nombre: string | null;
  cuit: string | null;
  tipo: string | null;
  activo: boolean;
  email: string | null;
  telefono: string | null;
  movil: string | null;
  domicilioFiscal: string | null;
  localidadId: number | null;
  provinciaId: number | null;
  paisId: number | null;
  cpFiscal: string | null;
  categoriaFiscal: string | null;
  codigoExterno: string | null;
  datosCompletos: any | null;
  ultimaSync: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ClienteQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
}

export interface ClienteCreateParams {
  razonSocial: string; // requerido
  nombre?: string;
  cuit?: string | number; // puede venir como string o number
  tipo?: string;
  email?: string;
  telefono?: string | number; // puede venir como string o number
  movil?: string | number; // puede venir como string o number
  domicilioFiscal?: string;
  localidadId?: number; // localidad_fiscal_id en SFactory
  provinciaId?: number; // provincia_id en SFactory
  paisId?: number; // pais_id en SFactory
  cpFiscal?: string | number; // puede venir como string o number
  categoriaFiscal?: string;
  codigoExterno?: string | number; // puede venir como string o number
  ctbId?: number; // ctb_id en SFactory (opcional)
  cuentaId?: number; // cuenta_id en SFactory (opcional)
  codigo?: string; // código del cliente (opcional, se genera automáticamente si no se proporciona)
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

