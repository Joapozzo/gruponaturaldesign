/**
 * Service para productos publicados (ecommerce)
 * Endpoint optimizado: /api/productos/publicados
 * 
 * Arquitectura: api (apiClient) → service → hook → render
 * Usa apiClient normalizado para respuestas consistentes
 */

import { apiClient } from '@/lib/apiClient';
import type {
  ProductoPublicadoQueryParams,
  ProductoPublicado,
  PaginationInfo,
} from '../types/producto-publicado.types';
// import type { PaginatedApiResponse } from '@/lib/types/api.types';

/**
 * Construye query string desde parámetros
 */
function buildQueryString(params: ProductoPublicadoQueryParams): string {
  const searchParams = new URLSearchParams();
  
  if (params.destacado !== undefined) {
    searchParams.append('destacado', String(params.destacado));
  }
  if (params.rubroId) {
    searchParams.append('rubroId', String(params.rubroId));
  }
  if (params.subrubroId) {
    searchParams.append('subrubroId', String(params.subrubroId));
  }
  const search = params.search ?? params.searchTerm ?? '';
  if (search) {
    searchParams.append('search', search);
  }
  if (params.tieneStock !== undefined) {
    searchParams.append('tieneStock', String(params.tieneStock));
  }
  if (params.genero) {
    searchParams.append('genero', params.genero);
  }
  if (params.color) {
    searchParams.append('color', params.color);
  }
  if (params.talle) {
    searchParams.append('talle', params.talle);
  }
  if (params.page) {
    searchParams.append('page', String(params.page));
  }
  if (params.limit) {
    searchParams.append('limit', String(params.limit));
  }
  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    searchParams.append('sortOrder', params.sortOrder);
  }
  
  return searchParams.toString();
}

/**
 * Service para productos publicados
 * Usa apiClient normalizado para respuestas consistentes
 */
class ProductoPublicadoService {
  /**
   * Obtiene productos publicados con estructura optimizada
   * Usa apiClient que normaliza automáticamente las respuestas
   * 
   * @param params Parámetros de búsqueda y filtros
   * @returns Respuesta normalizada con productos y paginación
   * @throws ApiError si la petición falla
   */
  async getPublicados(
    params: ProductoPublicadoQueryParams = {}
  ): Promise<{
    productos: ProductoPublicado[];
    pagination: PaginationInfo;
  }> {
    const queryString = buildQueryString(params);
    const endpoint = `/productos/publicados${queryString ? `?${queryString}` : ''}`;
    
    // Usar apiClient normalizado (endpoint público, no requiere auth)
    const response = await apiClient.getPaginated<ProductoPublicado>(endpoint, {
      skipAuth: true, // Endpoint público
    });
    
    // Validar que la respuesta sea exitosa
    if (!response.success || !response.data) {
      throw {
        message: response.error || response.message || 'Error al obtener productos',
        status: 500,
        details: response.details,
      };
    }
    
    return {
      productos: response.data,
      pagination: response.pagination,
    };
  }

  /**
   * Obtiene todos los productos publicados haciendo múltiples requests
   * El API tiene un límite máximo de 100, así que hace paginación automática
   * 
   * @param params Parámetros de búsqueda y filtros
   * @returns Todos los productos (sin límite de paginación)
   * @throws ApiError si la petición falla
   */
  async getAllPublicados(
    params: ProductoPublicadoQueryParams = {}
  ): Promise<{
    productos: ProductoPublicado[];
    pagination: PaginationInfo;
  }> {
    const MAX_LIMIT = 100; // Límite máximo del API
    const allProductos: ProductoPublicado[] = [];
    let currentPage = 1;
    let totalPages = 1;
    let total = 0;

    // Hacer requests paginados hasta obtener todos los productos
    do {
      const pageParams: ProductoPublicadoQueryParams = {
        ...params,
        page: currentPage,
        limit: MAX_LIMIT,
      };

      const queryString = buildQueryString(pageParams);
      const endpoint = `/productos/publicados${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.getPaginated<ProductoPublicado>(endpoint, {
        skipAuth: true,
      });

      if (!response.success || !response.data) {
        throw {
          message: response.error || response.message || 'Error al obtener productos',
          status: 500,
          details: response.details,
        };
      }

      allProductos.push(...response.data);
      totalPages = response.pagination?.totalPages || 1;
      total = response.pagination?.total || response.data.length;

      currentPage++;
    } while (currentPage <= totalPages);

    return {
      productos: allProductos,
      pagination: {
        page: 1,
        limit: allProductos.length,
        total,
        totalPages: 1,
      },
    };
  }

  /**
   * Obtiene productos destacados publicados
   * Reutiliza getPublicados con destacado: true
   * 
   * @param params Parámetros de búsqueda y filtros (destacado se fuerza a true)
   * @returns Respuesta normalizada con productos destacados y paginación
   * @throws ApiError si la petición falla
   */
  async getDestacados(
    params: Omit<ProductoPublicadoQueryParams, 'destacado'> = {}
  ): Promise<{
    productos: ProductoPublicado[];
    pagination: PaginationInfo;
  }> {
    // Reutilizar endpoint dedicado de destacados
    const queryString = buildQueryString(params);
    const endpoint = `/productos/destacados${queryString ? `?${queryString}` : ''}`;
    
    // Usar apiClient normalizado (endpoint público, no requiere auth)
    const response = await apiClient.getPaginated<ProductoPublicado>(endpoint, {
      skipAuth: true, // Endpoint público
    });
    
    // Validar que la respuesta sea exitosa
    if (!response.success || !response.data) {
      throw {
        message: response.error || response.message || 'Error al obtener productos destacados',
        status: 500,
        details: response.details,
      };
    }
    
    return {
      productos: response.data,
      pagination: response.pagination,
    };
  }
}

export const productoPublicadoService = new ProductoPublicadoService();

