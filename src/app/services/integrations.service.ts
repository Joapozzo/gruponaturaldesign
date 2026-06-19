import { apiClient } from '@/lib/apiClient';
import type { IntegrationsStatusPayload } from '@/app/types/integrations.types';

type IntegrationsStatusApiBody = IntegrationsStatusPayload & {
  success: boolean;
  message?: string;
  error?: string;
};

export async function getIntegrationsStatus(): Promise<IntegrationsStatusPayload> {
  const res = await apiClient.get<IntegrationsStatusApiBody>('/admin/integrations/status');
  if (!res.success) {
    throw new Error(res.message || res.error || 'Error al obtener estado de integraciones');
  }

  const body = res as unknown as IntegrationsStatusApiBody;
  if (!body.integrations || !body.modeRaw) {
    throw new Error('Respuesta inválida del servidor de integraciones');
  }

  return {
    mode: body.mode,
    modeRaw: body.modeRaw,
    timestamp: body.timestamp,
    integrations: body.integrations,
  };
}
