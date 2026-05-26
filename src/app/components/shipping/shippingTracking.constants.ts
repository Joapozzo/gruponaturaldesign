import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';

export type ShippingTrackingProviderOption = {
  id: ShippingProviderId;
  name: string;
  description: string;
  logoSrc?: string;
};

export const SHIPPING_TRACKING_PROVIDERS: ShippingTrackingProviderOption[] = [
  {
    id: 'andreani',
    name: 'Andreani',
    description: 'Seguimiento de envíos Andreani',
    logoSrc: '/logos/andreani.svg',
  },
  {
    id: 'correo',
    name: 'Correo Argentino',
    description: 'MiCorreo / PaqAr',
  },
];

export function shippingProviderLabel(id: ShippingProviderId): string {
  return SHIPPING_TRACKING_PROVIDERS.find((p) => p.id === id)?.name ?? id;
}

const DEFAULT_ANDREANI_TRACKING_URL =
  'https://www.andreani.com/#!/informacionEnvio/{trackingNumber}';
const DEFAULT_CORREO_TRACKING_URL =
  'https://www.correoargentino.com.ar/formularios/ccu/consulta-envio?id={trackingNumber}';

/** URL pública del carrier (misma lógica que API; sin depender de env del cliente). */
export function buildClientShippingTrackingUrl(
  provider: ShippingProviderId,
  trackingNumber: string
): string {
  const tn = encodeURIComponent(trackingNumber.trim());
  const template =
    provider === 'andreani' ? DEFAULT_ANDREANI_TRACKING_URL : DEFAULT_CORREO_TRACKING_URL;
  return template.replace('{trackingNumber}', tn);
}
