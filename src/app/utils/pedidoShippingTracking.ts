import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { ShippingProviderId } from '@/app/validation/shippingTracking.schema';

type CheckoutEnvioSnapshot = {
  provider?: string;
};

function parseSnapshot(raw: unknown): CheckoutEnvioSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  return raw as CheckoutEnvioSnapshot;
}

function providerFromFormaEnvio(forma: string | null | undefined): ShippingProviderId | null {
  if (!forma) return null;
  if (forma.startsWith('andreani')) return 'andreani';
  if (forma.startsWith('correo')) return 'correo';
  return null;
}

export function resolvePedidoShippingTracking(pedido: AdminPedidoDetalle): {
  shippingProvider: ShippingProviderId | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
} {
  const snap = parseSnapshot(pedido.checkoutEnvioSnapshot);
  const fromSnapshot =
    snap?.provider === 'andreani' || snap?.provider === 'correo' ? snap.provider : null;
  const shippingProvider = fromSnapshot ?? providerFromFormaEnvio(pedido.formaEnvio);

  const andreani = pedido.andreaniNumeroEnvio?.trim() || null;
  const correo = pedido.correoTrackingNumber?.trim() || null;

  let trackingNumber: string | null = null;
  if (shippingProvider === 'andreani') trackingNumber = andreani;
  else if (shippingProvider === 'correo') trackingNumber = correo;
  else trackingNumber = andreani ?? correo;

  return {
    shippingProvider,
    trackingNumber,
    trackingUrl: pedido.trackingUrl?.trim() || null,
  };
}
