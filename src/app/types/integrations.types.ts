export type IntegrationCheckStatus = 'ok' | 'error' | 'misconfigured' | 'mock';

export interface IntegrationStatusItem {
  configured: boolean;
  status: IntegrationCheckStatus;
  mode: string | null;
  detail: string;
}

export interface IntegrationsStatusPayload {
  mode: string;
  modeRaw: 'test' | 'prod';
  timestamp: string;
  integrations: {
    mercadopago: IntegrationStatusItem;
    correo: IntegrationStatusItem;
    andreani: IntegrationStatusItem;
  };
}
