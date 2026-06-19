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
    logoSrc: '/logos/andreani.png',
  },
  {
    id: 'correo',
    name: 'Correo Argentino',
    description: 'MiCorreo / PaqAr',
    logoSrc: '/logos/correo.png',
  },
];

export function getShippingTrackingProvider(
  id: ShippingProviderId
): ShippingTrackingProviderOption | undefined {
  return SHIPPING_TRACKING_PROVIDERS.find((p) => p.id === id);
}

export function shippingProviderLabel(id: ShippingProviderId): string {
  return getShippingTrackingProvider(id)?.name ?? id;
}

export function shippingProviderLogo(id: ShippingProviderId): string | undefined {
  return getShippingTrackingProvider(id)?.logoSrc;
}

const DEFAULT_ANDREANI_TRACKING_URL =
  'https://www.andreani.com/#!/informacionEnvio/{trackingNumber}';
const DEFAULT_CORREO_TRACKING_URL = 'https://www.correoargentino.com.ar/MiCorreo';

/** URL pública del carrier (misma lógica que API; sin depender de env del cliente). */
export function buildClientShippingTrackingUrl(
  provider: ShippingProviderId,
  trackingNumber: string
): string {
  if (provider === 'andreani') {
    const tn = encodeURIComponent(trackingNumber.trim());
    return DEFAULT_ANDREANI_TRACKING_URL.replace('{trackingNumber}', tn);
  }
  return DEFAULT_CORREO_TRACKING_URL;
}
