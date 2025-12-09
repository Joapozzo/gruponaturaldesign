import type {
  ProductoPadreConVariantes,
  ProductoQueryParams,
  PaginatedResponse,
} from '../types/producto.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ProductoService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || error.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // El backend devuelve { success, data, pagination?, message? }
    return data as T;
  }

  async getAll(
    params?: ProductoQueryParams
  ): Promise<PaginatedResponse<ProductoPadreConVariantes>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/productos${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<{
      success: boolean;
      data: ProductoPadreConVariantes[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint);
    
    return {
      data: response.data || [],
      pagination: response.pagination || {
        page: 1,
        limit: 10,
        total: response.data?.length || 0,
        totalPages: 1,
      },
    };
  }

  async getById(id: number, includeVariantes = false): Promise<ProductoPadreConVariantes> {
    const endpoint = `/productos/${id}?includeVariantes=${includeVariantes}`;
    const response = await this.request<{
      success: boolean;
      data: ProductoPadreConVariantes;
    }>(endpoint);
    return response.data;
  }

  async updateDestacado(id: number, destacado: boolean): Promise<ProductoPadreConVariantes> {
    const endpoint = `/productos/${id}`;
    const response = await this.request<{
      success: boolean;
      data: ProductoPadreConVariantes;
    }>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ destacado }),
    });
    return response.data;
  }

  async updatePublicado(id: number, publicado: boolean): Promise<ProductoPadreConVariantes> {
    const endpoint = `/productos/${id}`;
    const response = await this.request<{
      success: boolean;
      data: ProductoPadreConVariantes;
    }>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ publicado }),
    });
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const endpoint = `/productos/${id}`;
    await this.request<{ success: boolean }>(endpoint, {
      method: 'DELETE',
    });
  }

  async bulkUpdatePublicado(ids: number[], publicado: boolean): Promise<void> {
    const endpoint = `/productos/bulk/publicado`;
    await this.request<{ success: boolean }>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ ids, publicado }),
    });
  }

  async bulkUpdateDestacado(ids: number[], destacado: boolean): Promise<void> {
    const endpoint = `/productos/bulk/destacado`;
    await this.request<{ success: boolean }>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ ids, destacado }),
    });
  }

  async exportToCSV(params?: ProductoQueryParams): Promise<Blob> {
    // Por ahora, exportamos desde el frontend
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/productos${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.getAll(params || {});
    
    // Convertir a CSV
    const headers = ['ID', 'Código', 'Nombre', 'Descripción', 'Rubro', 'Subrubro', 'Publicado', 'Destacado', 'Variantes'];
    const rows = response.data.map((p) => [
      p.id,
      p.codigoAgrupacion,
      p.nombre,
      p.descripcion || '',
      p.rubro?.nombre || '',
      p.subrubro?.nombre || '',
      p.publicado ? 'Sí' : 'No',
      p.destacado ? 'Sí' : 'No',
      p._count?.productosWeb || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}

export const productoService = new ProductoService();

