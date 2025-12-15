import type { ApiResponse } from '@/app/types/common.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

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
  productoWebId: number;
  color: string;
  files: File[];
}

export class ProductImageService {
  /**
   * Sube imágenes para un producto
   */
  async uploadImages(params: UploadImagesParams): Promise<ProductImage[]> {
    const formData = new FormData();
    formData.append('productoWebId', params.productoWebId.toString());
    formData.append('color', params.color);

    params.files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/product-images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al subir imágenes');
    }

    const result: ApiResponse<ProductImage[]> = await response.json();
    return result.data || [];
  }

  /**
   * Obtiene imágenes de un producto
   */
  async getImages(
    productoWebId: number,
    color?: string
  ): Promise<ProductImage[]> {
    const url = new URL(
      `${API_BASE_URL}/product-images/${productoWebId}`
    );
    if (color) {
      url.searchParams.append('color', color);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener imágenes');
    }

    const result: ApiResponse<ProductImage[]> = await response.json();
    return result.data || [];
  }

  /**
   * Obtiene imágenes agrupadas por color
   */
  async getImagesByColor(
    productoWebId: number
  ): Promise<Record<string, ProductImage[]>> {
    const response = await fetch(
      `${API_BASE_URL}/product-images/${productoWebId}/by-color`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener imágenes');
    }

    const result: ApiResponse<Record<string, ProductImage[]>> =
      await response.json();
    return result.data || {};
  }

  /**
   * Obtiene colores únicos de un producto
   */
  async getColors(productoWebId: number): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/product-images/${productoWebId}/colors`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener colores');
    }

    const result: ApiResponse<string[]> = await response.json();
    return result.data || [];
  }

  /**
   * Elimina una imagen
   */
  async deleteImage(imageId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/product-images/${imageId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar imagen');
    }
  }
}

export const productImageService = new ProductImageService();

