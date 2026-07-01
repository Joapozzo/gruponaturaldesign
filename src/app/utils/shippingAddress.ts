import type { ShippingData } from '@/app/types/cart';

export interface CheckoutEnvioAddress {
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  zipCode: string;
  floor?: string;
  department?: string;
  barrio?: string;
  loteManzana?: string;
}

export function syncShippingLegacyDireccion(shipping: ShippingData): ShippingData {
  const calle = shipping.calle?.trim() || shipping.direccion?.trim() || '';
  const numero = shipping.numero?.trim() || '';
  const line = [calle, numero].filter(Boolean).join(' ').trim();
  if (!line) return shipping;
  return { ...shipping, direccion: line, calle: calle || shipping.calle };
}

export function formatShippingAddressLine(shipping: ShippingData | null): string {
  if (!shipping) return '';
  const calle = shipping.calle?.trim() || shipping.direccion?.trim() || '';
  const parts = [
    calle,
    shipping.numero?.trim(),
    shipping.piso?.trim() ? `Piso ${shipping.piso.trim()}` : null,
    shipping.depto?.trim() ? `Depto ${shipping.depto.trim()}` : null,
    shipping.barrio?.trim() ? `Barrio ${shipping.barrio.trim()}` : null,
    shipping.loteManzana?.trim() ? `Lote/Mz ${shipping.loteManzana.trim()}` : null,
    shipping.localidad?.trim(),
    shipping.provincia?.trim(),
    shipping.codigo_postal?.trim() ? `CP ${shipping.codigo_postal.trim()}` : null,
  ].filter(Boolean);
  return parts.join(', ');
}

export function buildCheckoutEnvioAddress(
  shipping: ShippingData
): CheckoutEnvioAddress | undefined {
  const city = shipping.localidad?.trim() ?? '';
  const state = shipping.provincia?.trim() ?? '';
  const zipCode = shipping.codigo_postal?.trim() ?? shipping.checkoutEnvio?.cpDestino ?? '';
  const streetName = shipping.calle?.trim() || shipping.direccion?.trim() || '';
  const streetNumber = shipping.numero?.trim() || 's/n';
  if (!streetName || !city || !state || !zipCode) return undefined;
  return {
    streetName,
    streetNumber,
    city,
    state,
    zipCode,
    ...(shipping.piso?.trim() ? { floor: shipping.piso.trim() } : {}),
    ...(shipping.depto?.trim() ? { department: shipping.depto.trim() } : {}),
    ...(shipping.barrio?.trim() ? { barrio: shipping.barrio.trim() } : {}),
    ...(shipping.loteManzana?.trim() ? { loteManzana: shipping.loteManzana.trim() } : {}),
  };
}
