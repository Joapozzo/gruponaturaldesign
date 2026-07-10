import { apiClient } from '@/lib/apiClient';
import type { MicorreoHealthReport } from '@/app/types/integrations.types';

export type CorreoAccountStatus = 'not_configured' | 'pending' | 'active' | 'invalid';

export interface EnvioConfigSenderData {
  name: string;
  email?: string;
  phone?: string;
  cellPhone?: string;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  floor?: string;
  apartment?: string;
}

export interface EnvioConfigAdmin {
  id: number;
  empresaId: number;
  providerDefault: string;
  correoSenderData: EnvioConfigSenderData | null;
  correoAccountEmail: string | null;
  hasPassword: boolean;
  correoCustomerIdSuffix: string | null;
  correoAccountStatus: CorreoAccountStatus;
  correoAccountValidatedAt: string | null;
  correoAccountLastError: string | null;
  correoOriginCp: string | null;
  correoOriginProvinceCode: string | null;
  updatedAt: string;
}

export type EnvioConfigInput = {
  providerDefault?: 'correo' | 'andreani';
  correoSenderData?: EnvioConfigSenderData;
  correoAccountEmail?: string;
  correoAccountPassword?: string;
  correoOriginCp?: string;
  correoOriginProvinceCode?: string;
};

const emptySender: EnvioConfigSenderData = {
  name: '',
  email: '',
  phone: '',
  cellPhone: '',
  streetName: '',
  streetNumber: '',
  city: '',
  floor: '',
  apartment: '',
};

export function envioConfigToForm(data: EnvioConfigAdmin | null): EnvioConfigInput & {
  correoSenderData: EnvioConfigSenderData;
} {
  const sender = data?.correoSenderData ?? emptySender;
  return {
    providerDefault: (data?.providerDefault === 'andreani' ? 'andreani' : 'correo') as
      | 'correo'
      | 'andreani',
    correoSenderData: { ...emptySender, ...sender },
    correoAccountEmail: data?.correoAccountEmail ?? '',
    correoAccountPassword: '',
    correoOriginCp: data?.correoOriginCp ?? '',
    correoOriginProvinceCode: data?.correoOriginProvinceCode ?? '',
  };
}

export async function getEnvioConfig(): Promise<EnvioConfigAdmin> {
  const res = await apiClient.get<EnvioConfigAdmin>('/admin/empresa/envio-config');
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al obtener configuración de envíos');
  }
  return res.data;
}

export async function updateEnvioConfig(input: EnvioConfigInput): Promise<EnvioConfigAdmin> {
  const body: Record<string, unknown> = {};
  if (input.providerDefault != null) body.providerDefault = input.providerDefault;
  if (input.correoSenderData != null) {
    body.correoSenderData = {
      ...input.correoSenderData,
      name: input.correoSenderData.name.trim(),
    };
  }
  if (input.correoAccountEmail?.trim()) {
    body.correoAccountEmail = input.correoAccountEmail.trim();
  }
  if (input.correoAccountPassword?.trim()) {
    body.correoAccountPassword = input.correoAccountPassword.trim();
  }
  if (input.correoOriginCp?.trim()) body.correoOriginCp = input.correoOriginCp.trim();
  if (input.correoOriginProvinceCode?.trim()) {
    body.correoOriginProvinceCode = input.correoOriginProvinceCode.trim().toUpperCase();
  }
  const res = await apiClient.patch<EnvioConfigAdmin>('/admin/empresa/envio-config', body);
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al guardar configuración de envíos');
  }
  return res.data;
}

export async function syncMicorreoAccount(password?: string): Promise<EnvioConfigAdmin> {
  const res = await apiClient.post<EnvioConfigAdmin>(
    '/admin/empresa/envio-config/micorreo/sync',
    password?.trim() ? { correoAccountPassword: password.trim() } : {}
  );
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al vincular MiCorreo');
  }
  return res.data;
}

export async function registerMicorreoAccount(): Promise<EnvioConfigAdmin> {
  const res = await apiClient.post<EnvioConfigAdmin>(
    '/admin/empresa/envio-config/micorreo/register',
    {}
  );
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al registrar MiCorreo');
  }
  return res.data;
}

export async function getMicorreoHealth(): Promise<MicorreoHealthReport> {
  const res = await apiClient.get<MicorreoHealthReport>(
    '/admin/empresa/envio-config/micorreo/health'
  );
  if (!res.success || res.data == null) {
    throw new Error(res.message || 'Error al verificar estado de MiCorreo');
  }
  return res.data;
}

export const CORREO_PROVINCE_OPTIONS: Array<{ code: string; label: string }> = [
  { code: 'A', label: 'Salta' },
  { code: 'B', label: 'Buenos Aires' },
  { code: 'C', label: 'CABA' },
  { code: 'D', label: 'San Luis' },
  { code: 'E', label: 'Entre Ríos' },
  { code: 'F', label: 'La Rioja' },
  { code: 'G', label: 'Santiago del Estero' },
  { code: 'H', label: 'Chaco' },
  { code: 'J', label: 'San Juan' },
  { code: 'K', label: 'Catamarca' },
  { code: 'L', label: 'La Pampa' },
  { code: 'M', label: 'Mendoza' },
  { code: 'N', label: 'Misiones' },
  { code: 'P', label: 'Formosa' },
  { code: 'Q', label: 'Neuquén' },
  { code: 'R', label: 'Río Negro' },
  { code: 'S', label: 'Santa Fe' },
  { code: 'T', label: 'Tucumán' },
  { code: 'U', label: 'Chubut' },
  { code: 'V', label: 'Tierra del Fuego' },
  { code: 'W', label: 'Corrientes' },
  { code: 'X', label: 'Córdoba' },
  { code: 'Y', label: 'Jujuy' },
  { code: 'Z', label: 'Santa Cruz' },
];

export function envioStatusLabel(status: CorreoAccountStatus): string {
  switch (status) {
    case 'active':
      return 'Vinculada';
    case 'pending':
      return 'Pendiente';
    case 'invalid':
      return 'Error';
    default:
      return 'Sin configurar';
  }
}

export function envioStatusVariant(
  status: CorreoAccountStatus
): 'success' | 'danger' | 'warning' | 'default' {
  switch (status) {
    case 'active':
      return 'success';
    case 'invalid':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
}
