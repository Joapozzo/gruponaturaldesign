import { getAccessToken } from './auth';
import type { ApiResponse, ApiError, PaginatedApiResponse } from './types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Obtiene los headers por defecto, incluyendo el token de autenticación
   */
  private async getHeaders(
    customHeaders?: Record<string, string>,
    skipContentType?: boolean
  ): Promise<HeadersInit> {
    const headers: Record<string, string> = {};

    // Solo agregar Content-Type si no se especifica skipContentType
    // (útil para FormData que debe establecer su propio Content-Type)
    if (!skipContentType) {
      headers['Content-Type'] = 'application/json';
    }

    // Agregar headers personalizados
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    // Agregar token de autenticación si está disponible
    try {
      const token = await getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Si no hay token disponible, continuar sin él
      // (útil para endpoints públicos)
    }

    return headers;
  }

  /**
   * Normaliza la respuesta de la API
   * Asegura que siempre tengamos la estructura esperada
   */
  private normalizeResponse<T>(response: unknown): ApiResponse<T> {
    // Si ya tiene la estructura correcta, retornarla
    if (
      response &&
      typeof response === 'object' &&
      'success' in response &&
      (response as { success: unknown }).success === true
    ) {
      return response as ApiResponse<T>;
    }

    // Si no tiene la estructura, normalizarla
    return {
      success: true,
      data: response as T,
    };
  }

  /**
   * Normaliza error de API
   */
  private normalizeError(error: unknown, status: number): ApiError {
    // Si ya es un ApiError, retornarlo
    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as Record<string, unknown>;
      return {
        ...errorObj,
        status: status || (errorObj.status as number) || 0,
      } as ApiError;
    }

    // Normalizar error
    const errorObj = error as Record<string, unknown> | null;
    return {
      message: (errorObj?.message as string) || (errorObj?.error as string) || 'Error desconocido',
      error: errorObj?.error as string | undefined,
      status,
      details: errorObj?.details as ApiError['details'],
    };
  }

  /**
   * Método principal para realizar peticiones HTTP
   * Normaliza automáticamente las respuestas del backend
   */
  async request<T>(
    endpoint: string,
    options?: RequestInit & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean; // Para endpoints que no requieren autenticación
      skipContentType?: boolean; // Para FormData y otros casos especiales
    }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const {
      customHeaders,
      skipAuth,
      skipContentType,
      ...fetchOptions
    } = options || {};

    const headers = skipAuth
      ? (skipContentType
          ? customHeaders || {}
          : { 'Content-Type': 'application/json', ...customHeaders })
      : await this.getHeaders(customHeaders, skipContentType);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Parsear respuesta JSON
      const responseData = await response.json().catch(() => ({
        success: false,
        error: 'Error al parsear respuesta',
        message: 'La respuesta no es un JSON válido',
      }));

      // Si la respuesta HTTP no es exitosa, normalizar error
      if (!response.ok) {
        const error = this.normalizeError(responseData, response.status);
        throw error;
      }

      // Normalizar respuesta exitosa
      return this.normalizeResponse<T>(responseData);
    } catch (error) {
      // Re-lanzar errores de ApiError
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        'status' in error
      ) {
        throw error;
      }

      // Manejar errores de red (servidor no disponible, conexión rechazada, etc.)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error de conexión';
      
      // Detectar errores de conexión específicos
      const isConnectionError = 
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED') ||
        errorMessage.includes('ERR_INTERNET_DISCONNECTED');

      throw {
        message: isConnectionError 
          ? 'No se pudo conectar con el servidor. Verifique que el servidor esté en ejecución.'
          : errorMessage,
        status: 0,
        error: isConnectionError ? 'CONNECTION_ERROR' : 'NETWORK_ERROR',
      } as ApiError;
    }
  }

  /**
   * Método para peticiones con paginación
   * Retorna PaginatedApiResponse
   */
  async requestPaginated<T>(
    endpoint: string,
    options?: RequestInit & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
      skipContentType?: boolean;
    }
  ): Promise<PaginatedApiResponse<T>> {
    const response = await this.request<T[]>(endpoint, options);

    // Si la respuesta ya tiene paginación, retornarla
    if ('pagination' in response) {
      return response as PaginatedApiResponse<T>;
    }

    // Si no tiene paginación pero es exitosa, agregar paginación por defecto
    if (response.success && response.data) {
      return {
        ...response,
        pagination: {
          page: 1,
          limit: response.data.length,
          total: response.data.length,
          totalPages: 1,
        },
      } as PaginatedApiResponse<T>;
    }

    // Si hay error, retornar respuesta de error con paginación vacía
    return {
      ...response,
      data: [],
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        totalPages: 0,
      },
    } as PaginatedApiResponse<T>;
  }

  /**
   * Métodos helper para diferentes verbos HTTP
   * Todos retornan ApiResponse normalizada
   */
  async get<T>(
    endpoint: string,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async getPaginated<T>(
    endpoint: string,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
    }
  ): Promise<PaginatedApiResponse<T>> {
    return this.requestPaginated<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
      skipContentType?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
      skipContentType: body instanceof FormData || options?.skipContentType,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
      skipContentType?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
      skipContentType: body instanceof FormData || options?.skipContentType,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
      skipContentType?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
      skipContentType: body instanceof FormData || options?.skipContentType,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Instancia singleton exportada
export const apiClient = new ApiClient();

