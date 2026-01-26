import { apiClient } from '@/lib/apiClient';

interface SyncProgress {
  current: number;
  total: number;
  message?: string;
}

class SyncService {
  /**
   * Sincroniza productos desde SFactory
   * @param onProgress - Callback opcional para recibir progreso de la sincronización
   */
  async syncProductos(
    onProgress?: (progress: SyncProgress) => void
  ): Promise<{ success: boolean; message: string }> {
    const endpoint = `/sync/productos`;
    
    try {
      // Notificar inicio
      onProgress?.({ current: 0, total: 100, message: 'Iniciando sincronización...' });
      
      // Crear AbortController para timeout de 5 minutos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 300000); // 5 minutos
      
      // Notificar progreso intermedio (fetch no soporta progreso real)
      onProgress?.({ current: 25, total: 100, message: 'Sincronizando productos...' });
      
      const response = await apiClient.post<{ success: boolean; message: string }>(
        endpoint,
        {},
        {
          signal: controller.signal,
        }
      );
      
      // Limpiar timeout si la petición se completó
      clearTimeout(timeoutId);
      
      if (!response.data) {
        throw new Error('Error al sincronizar productos');
      }
      
      // Notificar completado
      onProgress?.({ current: 100, total: 100, message: 'Sincronización completada' });
      
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Error desconocido';
      
      onProgress?.({ 
        current: 0, 
        total: 100, 
        message: `Error: ${errorMessage}` 
      });
      
      // Re-lanzar el error para que el llamador pueda manejarlo
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(errorMessage);
    }
  }
}

export const syncService = new SyncService();

