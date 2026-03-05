import { apiClient } from '@/lib/apiClient';

export interface ProductImage {
  id: number;
  productoWebId: number;
  color: string | null;
  imagenUrl: string;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadImagesParams {
  productoWebId?: number | null;
  productoPadreId?: number | null;
  color: string;
  files: File[];
}

export class ProductImageService {
  /**
   * Sube imágenes para un producto
   */
  async uploadImages(params: UploadImagesParams): Promise<ProductImage[]> {
    const formData = new FormData();
    
    if (params.productoWebId) {
      formData.append('productoWebId', params.productoWebId.toString());
    }
    if (params.productoPadreId) {
      formData.append('productoPadreId', params.productoPadreId.toString());
    }
    formData.append('color', params.color);

    params.files.forEach((file) => {
      formData.append('images', file);
    });

    const result = await apiClient.post<ProductImage[]>(
      '/product-images/upload',
      formData
    );
    return result.data || [];
  }

  /**
   * Obtiene imágenes de un producto
   */
  async getImages(
    productoWebId: number,
    color?: string
  ): Promise<ProductImage[]> {
    const endpoint = color
      ? `/product-images/${productoWebId}?color=${encodeURIComponent(color)}`
      : `/product-images/${productoWebId}`;

    const result = await apiClient.get<ProductImage[]>(endpoint);
    return result.data || [];
  }

  /**
   * Obtiene imágenes agrupadas por color
   */
  async getImagesByColor(
    productoWebId: number
  ): Promise<Record<string, ProductImage[]>> {
    const result = await apiClient.get<Record<string, ProductImage[]>>(
      `/product-images/${productoWebId}/by-color`
    );
    return result.data || {};
  }

  /**
   * Obtiene colores únicos de un producto
   */
  async getColors(productoWebId: number): Promise<string[]> {
    const result = await apiClient.get<string[]>(
      `/product-images/${productoWebId}/colors`
    );
    return result.data || [];
  }

  /**
   * Reordena imágenes enviando el nuevo orden al backend
   */
  async reorderImages(images: { id: number; orden: number }[]): Promise<void> {
    await apiClient.patch('/product-images/reorder', { images });
  }

  /**
   * Elimina una imagen
   */
  async deleteImage(imageId: number): Promise<void> {
    await apiClient.delete(`/product-images/${imageId}`);
  }

  /**
   * Obtiene imágenes de un producto padre (todas las variantes) agrupadas por color
   */
  async getProductoPadreImages(
    productoPadreId: number,
    color?: string
  ): Promise<Record<string, ProductImage[]>> {
    const endpoint = color
      ? `/product-images/producto-padre/${productoPadreId}?color=${encodeURIComponent(color)}`
      : `/product-images/producto-padre/${productoPadreId}`;

    const result = await apiClient.get<Record<string, ProductImage[]>>(endpoint);
    return result.data || {};
  }
}

export const productImageService = new ProductImageService();

