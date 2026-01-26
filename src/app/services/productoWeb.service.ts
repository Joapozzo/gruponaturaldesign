import { apiClient } from '@/lib/apiClient';

export interface ProductoWebResponse {
  id: number;
  empresaId: number;
  productoPadreId: number;
  sfactoryId: number;
  sfactoryCodigo: string;
  sfactoryBarcode: string | null;
  nombre: string;
  descripcionCompleta: string | null;
  sexo: string | null;
  talle: string | null;
  color: string | null;
  precioCache: number | null;
  stockCache: number | null;
  ultimaSyncSfactory: string | null;
  activoSfactory: boolean;
  imagenVariante: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductoWebData {
  stockCache?: number | null;
  precioCache?: number | null;
}

export interface BulkUpdateProductoWebData {
  updates: Array<{ id: number } & UpdateProductoWebData>;
}

class ProductoWebService {
  /**
   * Actualiza un ProductoWeb
   */
  async update(id: number, data: UpdateProductoWebData): Promise<ProductoWebResponse> {
    const endpoint = `/productos-web/${id}`;
    const response = await apiClient.patch<ProductoWebResponse>(
      endpoint,
      data
    );
    if (!response.data) {
      throw new Error('Error al actualizar producto web');
    }
    return response.data;
  }

  /**
   * Actualiza múltiples ProductoWeb en lote
   */
  async updateBulk(data: BulkUpdateProductoWebData): Promise<ProductoWebResponse[]> {
    const endpoint = `/productos-web/bulk`;
    const response = await apiClient.patch<ProductoWebResponse[]>(
      endpoint,
      data
    );
    return response.data || [];
  }

  /**
   * Obtiene un ProductoWeb por ID
   */
  async getById(id: number): Promise<ProductoWebResponse> {
    const endpoint = `/productos-web/${id}`;
    const response = await apiClient.get<ProductoWebResponse>(endpoint);
    if (!response.data) {
      throw new Error('Producto web no encontrado');
    }
    return response.data;
  }
}

export const productoWebService = new ProductoWebService();

