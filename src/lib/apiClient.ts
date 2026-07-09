import { buildAuthLoginUrl } from './auth-callback-url';
import { getAccessToken } from './auth-client';
import type { ApiResponse, ApiError, PaginatedApiResponse } from './types/api.types';
import {
  isMaintenanceApiPayload,
  tryHandleMaintenanceResponse,
} from './api-maintenance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

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

  /** Mensaje amigable cuando el servidor no está disponible (503/502/504) */
  private static SERVICE_UNAVAILABLE_MESSAGE =
    'Servicio temporalmente no disponible. Por favor intentá de nuevo en unos segundos.';

  /**
   * Método principal para realizar peticiones HTTP
   * Normaliza automáticamente las respuestas del backend.
   * Para 503 hace un reintento automático tras 2s antes de fallar.
   */
  async request<T>(
    endpoint: string,
    options?: RequestInit & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean; // Para endpoints que no requieren autenticación
      skipContentType?: boolean; // Para FormData y otros casos especiales
      /** No redirigir a login en 401 (p. ej. abandonar checkout con sesión vencida). */
      suppressAuthRedirect?: boolean;
      _retry503?: boolean; // interno: ya hicimos retry
    }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const {
      customHeaders,
      skipAuth,
      skipContentType,
      suppressAuthRedirect,
      _retry503,
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
        if (tryHandleMaintenanceResponse(response.status, responseData)) {
          throw this.normalizeError(responseData, 503);
        }
        // 401 en peticiones que requieren auth: redirigir a login (token faltante/vencido)
        if (
          response.status === 401 &&
          !skipAuth &&
          !suppressAuthRedirect &&
          typeof window !== 'undefined'
        ) {
          window.location.href = buildAuthLoginUrl({ reason: 'session_expired' });
        }
        // 503: un reintento automático solo para GET (evitar reenviar POST/PUT)
        const isGet = (fetchOptions.method ?? 'GET').toUpperCase() === 'GET';
        if (
          response.status === 503 &&
          !_retry503 &&
          isGet &&
          !isMaintenanceApiPayload(responseData)
        ) {
          await new Promise((r) => setTimeout(r, 2000));
          return this.request<T>(endpoint, { ...options, _retry503: true });
        }
        const error = this.normalizeError(responseData, response.status);
        // Usar mensaje amigable para 502/503/504 si el servidor no envió uno claro
        if ([502, 503, 504].includes(response.status)) {
          const msg = (responseData?.message ?? error.message) as string;
          if (!msg || msg.includes('pool timeout') || msg.includes('ECONNREFUSED')) {
            (error as ApiError).message = ApiClient.SERVICE_UNAVAILABLE_MESSAGE;
          }
        }
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
      suppressAuthRedirect?: boolean;
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

  /**
   * GET binario (PDF, etc.) con auth. No parsea JSON.
   */
  async getBlob(
    endpoint: string,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      customHeaders?: Record<string, string>;
      skipAuth?: boolean;
    }
  ): Promise<{ blob: Blob; fileName?: string; contentType?: string }> {
    const url = `${this.baseURL}${endpoint}`;
    const { skipAuth, customHeaders, ...fetchOptions } = options || {};
    const headers = skipAuth
      ? customHeaders || {}
      : await this.getHeaders(customHeaders, true);

    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({
        success: false,
        message: 'Error al descargar el archivo',
      }));
      if (response.status === 401 && !skipAuth && typeof window !== 'undefined') {
        window.location.href = buildAuthLoginUrl({ reason: 'session_expired' });
      }
      throw this.normalizeError(responseData, response.status);
    }

    const blob = await response.blob();
    const fileName = parseBlobFileName(response.headers.get('Content-Disposition'));
    return {
      blob,
      fileName,
      contentType: response.headers.get('Content-Type') ?? undefined,
    };
  }
}

function parseBlobFileName(contentDisposition: string | null): string | undefined {
  if (!contentDisposition) return undefined;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim());
    } catch {
      return utf8[1].trim();
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return plain?.[1]?.trim();
}

// Instancia singleton exportada
export const apiClient = new ApiClient();

