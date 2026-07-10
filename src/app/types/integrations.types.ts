export type IntegrationCheckStatus = 'ok' | 'error' | 'misconfigured' | 'mock';

export type MicorreoLayerStatus = 'ok' | 'error' | 'misconfigured' | 'skipped';

export interface IntegrationStatusItem {
  configured: boolean;
  status: IntegrationCheckStatus;
  mode: string | null;
  detail: string;
}

export interface MicorreoIntegrationLayer {
  status: MicorreoLayerStatus;
  detail: string;
  customerIdSuffix?: string | null;
}

export interface CorreoIntegrationStatusItem extends IntegrationStatusItem {
  layers: {
    integrator: MicorreoIntegrationLayer;
    account: MicorreoIntegrationLayer;
    operational: MicorreoIntegrationLayer;
  };
  healthy: boolean;
  readyForCheckout: boolean;
}

export interface IntegrationsStatusPayload {
  mode: string;
  modeRaw: 'test' | 'prod';
  timestamp: string;
  integrations: {
    mercadopago: IntegrationStatusItem;
    correo: CorreoIntegrationStatusItem;
    andreani: IntegrationStatusItem;
  };
}

export interface MicorreoHealthReport {
  env: string;
  integrator: MicorreoIntegrationLayer;
  account: MicorreoIntegrationLayer;
  operational: MicorreoIntegrationLayer;
  readyForCheckout: boolean;
}
