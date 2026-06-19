import { apiClient } from '@/lib/apiClient';

export interface DatosBancariosConfig {
  id: number;
  empresaId: number;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  cbu: string | null;
  alias: string | null;
  titular: string;
  cuit: string | null;
  instrucciones: string | null;
  activo: boolean;
  updatedAt: string;
}

export type DatosBancariosInput = {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  cbu?: string;
  alias?: string;
  titular: string;
  cuit?: string;
  instrucciones?: string;
  activo?: boolean;
};

const emptyForm: DatosBancariosInput = {
  banco: '',
  tipoCuenta: '',
  numeroCuenta: '',
  cbu: '',
  alias: '',
  titular: '',
  cuit: '',
  instrucciones: '',
  activo: true,
};

export function datosBancariosToForm(data: DatosBancariosConfig | null): DatosBancariosInput {
  if (!data) return { ...emptyForm };
  return {
    banco: data.banco,
    tipoCuenta: data.tipoCuenta,
    numeroCuenta: data.numeroCuenta,
    cbu: data.cbu ?? '',
    alias: data.alias ?? '',
    titular: data.titular,
    cuit: data.cuit ?? '',
    instrucciones: data.instrucciones ?? '',
    activo: data.activo,
  };
}

export async function getDatosBancarios(): Promise<DatosBancariosConfig | null> {
  const res = await apiClient.get<DatosBancariosConfig | null>('/admin/empresa/datos-bancarios');
  if (!res.success) {
    throw new Error(res.message || 'Error al obtener datos bancarios');
  }
  return res.data ?? null;
}

export async function updateDatosBancarios(
  input: DatosBancariosInput
): Promise<DatosBancariosConfig> {
  const res = await apiClient.patch<DatosBancariosConfig>('/admin/empresa/datos-bancarios', {
    banco: input.banco.trim(),
    tipoCuenta: input.tipoCuenta.trim(),
    numeroCuenta: input.numeroCuenta.trim(),
    cbu: input.cbu?.trim() || undefined,
    alias: input.alias?.trim() || undefined,
    titular: input.titular.trim(),
    cuit: input.cuit?.trim() || undefined,
    instrucciones: input.instrucciones?.trim() || undefined,
    activo: input.activo ?? true,
  });
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al guardar datos bancarios');
  }
  return res.data;
}
