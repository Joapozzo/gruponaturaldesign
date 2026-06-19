/**
 * Tipos normalizados para respuestas de API
 * Sincronizados con api/src/types/common.types.ts
 * 
 * Arquitectura: api → service → hook → render
 * Este archivo define la estructura normalizada que esperamos del backend
 */

// ============================================
// API Response Types (Normalizados)
// ============================================

/**
 * Respuesta API normalizada y consistente
 * Esperada de TODOS los endpoints del backend
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: Array<{
    code?: string;
    path?: (string | number)[];
    message?: string;
  }>;
}

/**
 * Respuesta API con paginación
 * Extiende ApiResponse agregando información de paginación
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Error normalizado de API
 */
export interface ApiError {
  message: string;
  error?: string;
  status?: number;
  details?: Array<{
    code?: string;
    path?: (string | number)[];
    message?: string;
  }>;
}

// ============================================
// Tipo Helper para respuestas exitosas
// ============================================

export type ApiSuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};

export type ApiErrorResponse = ApiResponse<never> & {
  success: false;
  error: string;
  details?: Array<{
    code?: string;
    path?: (string | number)[];
    message?: string;
  }>;
};

