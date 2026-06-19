/**
 * Service para obtener detalles de producto por slug
 * Arquitectura: apiClient → service → hook → component
 */

import { apiClient } from '@/lib/apiClient';
import type { ProductoPadreConVariantes } from '@/app/types/producto-detail.types';

export interface ProductoDetailResponse {
  producto: ProductoPadreConVariantes;
  relatedProducts: ProductoPadreConVariantes[];
}

export interface ProductoDetailParams {
  slug: string;
  empresaId?: number; // Opcional, se puede obtener del contexto
  includeVariantes?: boolean;
}

class ProductoDetailService {
  /**
   * Obtiene un producto por slug con sus variantes y productos relacionados
   */
  async getBySlug(
    params: ProductoDetailParams
  ): Promise<ProductoDetailResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.empresaId) {
      queryParams.append('empresaId', String(params.empresaId));
    }
    
    if (params.includeVariantes !== undefined) {
      queryParams.append('includeVariantes', String(params.includeVariantes));
    } else {
      queryParams.append('includeVariantes', 'true');
    }

    const endpoint = `/productos/slug/${encodeURIComponent(params.slug)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiClient.get<ProductoDetailResponse>(endpoint, {
      skipAuth: true, // Endpoint público
    });

    if (!response.success || !response.data) {
      throw {
        message: response.error || response.message || 'Producto no encontrado',
        status: 404,
        details: response.details,
      };
    }

    return response.data;
  }
}

export const productoDetailService = new ProductoDetailService();

