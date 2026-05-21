import { apiClient } from '@/lib/apiClient';

export interface PrecioConfig {
  descuentoTransferencia: number;
  iva: number;
  cuotasFinanciado: number;
}

export interface EmpresaPrecioConfig extends PrecioConfig {
  empresaId: number;
  precioConfigUpdatedAt: string | null;
}

export async function getPrecioConfig(): Promise<EmpresaPrecioConfig> {
  const res = await apiClient.get<EmpresaPrecioConfig>('/admin/empresa/config-precios');
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al obtener configuración de precios');
  }
  return res.data;
}

export async function updatePrecioConfig(config: Partial<PrecioConfig>): Promise<EmpresaPrecioConfig> {
  const res = await apiClient.patch<EmpresaPrecioConfig>('/admin/empresa/config-precios', config);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al actualizar configuración de precios');
  }
  return res.data;
}

export async function recalcularPrecios(): Promise<{ actualizados: number }> {
  const res = await apiClient.post<{ actualizados: number }>('/admin/empresa/config-precios/recalcular', {});
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al recalcular precios');
  }
  return res.data;
}