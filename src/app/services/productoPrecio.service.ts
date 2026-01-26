import { apiClient } from '@/lib/apiClient';

export interface CreateProductoPrecioData {
  productoWebId: number;
  tipoCliente: 'minorista' | 'mayorista';
  precioLista: number;
  minimoUnidades?: number | null;
  cuotasFinanciado?: number;
}

export interface UpdateProductoPrecioData {
  precioLista?: number;
  minimoUnidades?: number | null;
  cuotasFinanciado?: number;
}

class ProductoPrecioService {
  /**
   * Crea o actualiza un precio de producto
   */
  async upsert(data: CreateProductoPrecioData) {
    const response = await apiClient.post('/productos-precios', data);
    return response.data;
  }

  /**
   * Actualiza un precio existente
   */
  async update(id: number, data: UpdateProductoPrecioData) {
    const response = await apiClient.patch(`/productos-precios/${id}`, data);
    return response.data;
  }

  /**
   * Obtiene precios por productoWebId
   */
  async getByProductoWebId(productoWebId: number) {
    const response = await apiClient.get(`/productos-precios/producto-web/${productoWebId}`);
    return response.data;
  }

  /**
   * Obtiene precio por productoWebId y tipoCliente
   */
  async getByProductoWebIdAndTipo(
    productoWebId: number,
    tipoCliente: 'minorista' | 'mayorista'
  ) {
    const response = await apiClient.get(
      `/productos-precios/producto-web/${productoWebId}/tipo/${tipoCliente}`
    );
    return response.data;
  }

  /**
   * Elimina un precio
   */
  async delete(id: number) {
    const response = await apiClient.delete(`/productos-precios/${id}`);
    return response.data;
  }
}

export const productoPrecioService = new ProductoPrecioService();

