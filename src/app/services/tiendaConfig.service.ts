import { apiClient } from '@/lib/apiClient';
import type { TiendaConfigPublic } from '@/app/utils/checkoutPaymentCopy';
import { DEFAULT_TIENDA_CONFIG_PUBLIC } from '@/app/utils/checkoutPaymentCopy';

export interface TiendaConfigAdmin {
  id: number;
  empresaId: number;
  emailPedidosInterno: string | null;
  whatsappTelefono: string | null;
  whatsappMensajeDefault: string | null;
  retiroDireccion: string | null;
  retiroHorarios: string | null;
  retiroDemora: string | null;
  retiroNotas: string | null;
  pagoManualInstruccionesExtra: string | null;
  updatedAt: string;
}

export type TiendaConfigInput = {
  emailPedidosInterno?: string;
  whatsappTelefono?: string;
  whatsappMensajeDefault?: string;
  retiroDireccion?: string;
  retiroHorarios?: string;
  retiroDemora?: string;
  retiroNotas?: string;
  pagoManualInstruccionesExtra?: string;
};

const emptyForm: TiendaConfigInput = {
  emailPedidosInterno: '',
  whatsappTelefono: '',
  whatsappMensajeDefault: '',
  retiroDireccion: '',
  retiroHorarios: '',
  retiroDemora: '',
  retiroNotas: '',
  pagoManualInstruccionesExtra: '',
};

export function tiendaConfigToForm(data: TiendaConfigAdmin | null): TiendaConfigInput {
  if (!data) return { ...emptyForm };
  return {
    emailPedidosInterno: data.emailPedidosInterno ?? '',
    whatsappTelefono: data.whatsappTelefono ?? '',
    whatsappMensajeDefault: data.whatsappMensajeDefault ?? '',
    retiroDireccion: data.retiroDireccion ?? '',
    retiroHorarios: data.retiroHorarios ?? '',
    retiroDemora: data.retiroDemora ?? '',
    retiroNotas: data.retiroNotas ?? '',
    pagoManualInstruccionesExtra: data.pagoManualInstruccionesExtra ?? '',
  };
}

export async function getTiendaConfigAdmin(): Promise<TiendaConfigAdmin | null> {
  const res = await apiClient.get<TiendaConfigAdmin | null>('/admin/empresa/tienda-config');
  if (!res.success) {
    throw new Error(res.message || 'Error al obtener configuración de tienda');
  }
  return res.data ?? null;
}

export async function updateTiendaConfig(input: TiendaConfigInput): Promise<TiendaConfigAdmin> {
  const res = await apiClient.patch<TiendaConfigAdmin>('/admin/empresa/tienda-config', {
    emailPedidosInterno: input.emailPedidosInterno?.trim() || undefined,
    whatsappTelefono: input.whatsappTelefono?.trim() || undefined,
    whatsappMensajeDefault: input.whatsappMensajeDefault?.trim() || undefined,
    retiroDireccion: input.retiroDireccion?.trim() || undefined,
    retiroHorarios: input.retiroHorarios?.trim() || undefined,
    retiroDemora: input.retiroDemora?.trim() || undefined,
    retiroNotas: input.retiroNotas?.trim() || undefined,
    pagoManualInstruccionesExtra: input.pagoManualInstruccionesExtra?.trim() || undefined,
  });
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al guardar configuración de tienda');
  }
  return res.data;
}

export async function fetchTiendaConfigPublic(): Promise<TiendaConfigPublic> {
  const res = await apiClient.get<TiendaConfigPublic>('/checkout/config-tienda', { skipAuth: true });
  if (!res.success || res.data == null) {
    return DEFAULT_TIENDA_CONFIG_PUBLIC;
  }
  return { ...DEFAULT_TIENDA_CONFIG_PUBLIC, ...res.data };
}
