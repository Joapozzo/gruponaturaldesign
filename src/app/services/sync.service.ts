const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class SyncService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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

    return response.json();
  }

  async syncProductos(empresaId: number): Promise<{ success: boolean; message: string }> {
    const endpoint = `/sync/productos/${empresaId}`;
    return this.request<{ success: boolean; message: string }>(endpoint, {
      method: 'POST',
    });
  }
}

export const syncService = new SyncService();

