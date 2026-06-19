import { mapFormaEnvioLabel } from '@/app/utils/dashboard.utils';
import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';

type CheckoutEnvioSnapshot = {
  version?: number;
  provider?: string;
  deliveryType?: string;
  cpDestino?: string;
  agencyLabel?: string;
  agencyId?: string;
  validatedAmount?: number;
  address?: {
    street?: string;
    streetNumber?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    floor?: string;
    department?: string;
  };
};

function parseSnapshot(raw: unknown): CheckoutEnvioSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  return raw as CheckoutEnvioSnapshot;
}

function labelFromSnapshot(snap: CheckoutEnvioSnapshot): string {
  const provider = snap.provider === 'andreani' ? 'Andreani' : snap.provider === 'correo' ? 'Correo Argentino' : snap.provider ?? 'Envío';
  if (snap.deliveryType === 'agency') {
    const suc = snap.agencyLabel?.trim();
    return suc ? `${provider} · retiro en sucursal (${suc})` : `${provider} · retiro en sucursal`;
  }
  if (snap.deliveryType === 'homeDelivery') {
    const addr = snap.address;
    const parts = addr
      ? [addr.street, addr.streetNumber, addr.city, addr.province, addr.zipCode].filter(Boolean)
      : [];
    const dir = parts.length ? parts.join(', ') : null;
    return dir ? `${provider} · envío a domicilio (${dir})` : `${provider} · envío a domicilio`;
  }
  return provider;
}

function isLikelyRetiro(pedido: AdminPedidoDetalle): boolean {
  const costo = Number(pedido.costoEnvio ?? 0);
  return (
    !pedido.formaEnvio &&
    costo <= 0 &&
    !pedido.entregaCp?.trim() &&
    !pedido.andreaniSucursalId &&
    !pedido.checkoutEnvioSnapshot
  );
}

export interface PedidoEntregaDisplay {
  tipoLabel: string;
  detalle?: string;
  costoEnvioLabel: string;
}

export function isRetiroEnTiendaPedido(pedido: AdminPedidoDetalle): boolean {
  return isLikelyRetiro(pedido);
}

export function formatPedidoEntregaDisplay(pedido: AdminPedidoDetalle): PedidoEntregaDisplay {
  const snap = parseSnapshot(pedido.checkoutEnvioSnapshot);
  const costo = Number(pedido.costoEnvio ?? 0);

  if (snap) {
    return {
      tipoLabel: labelFromSnapshot(snap),
      detalle: snap.cpDestino ? `CP ${snap.cpDestino}` : undefined,
      costoEnvioLabel: costo > 0 ? `$ ${costo.toLocaleString('es-AR')}` : 'Sin costo de envío',
    };
  }

  if (isLikelyRetiro(pedido)) {
    return {
      tipoLabel: 'Retiro en local',
      detalle: 'El cliente coordinó retiro en punto GND (sin envío postal).',
      costoEnvioLabel: 'Sin envío',
    };
  }

  if (pedido.formaEnvio) {
    const label = mapFormaEnvioLabel(pedido.formaEnvio);
    const extras: string[] = [];
    if (pedido.andreaniSucursalDescripcion) {
      extras.push(`Sucursal: ${pedido.andreaniSucursalDescripcion}`);
    } else if (pedido.andreaniSucursalId) {
      extras.push(`Sucursal ID: ${pedido.andreaniSucursalId}`);
    }
    if (pedido.entregaCp) extras.push(`CP ${pedido.entregaCp}`);
    return {
      tipoLabel: label,
      detalle: extras.length ? extras.join(' · ') : undefined,
      costoEnvioLabel: costo > 0 ? `$ ${costo.toLocaleString('es-AR')}` : 'Sin costo de envío',
    };
  }

  return {
    tipoLabel: 'No especificado',
    detalle: pedido.clienteDireccion?.trim() || undefined,
    costoEnvioLabel: costo > 0 ? `$ ${costo.toLocaleString('es-AR')}` : '—',
  };
}

export function mapFormaPagoLabel(forma: string | null | undefined): string {
  if (!forma) return '—';
  if (forma === 'mercado_pago') return 'Mercado Pago';
  if (forma === 'transferencia') return 'Transferencia';
  if (forma === 'efectivo') return 'Efectivo';
  return forma;
}
