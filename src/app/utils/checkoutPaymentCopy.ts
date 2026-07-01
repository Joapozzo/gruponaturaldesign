import {
  WHATSAPP_DEFAULT_MESSAGE,
  WHATSAPP_PHONE_NUMBER,
  getWhatsAppNumberForUrl,
} from '@/app/utils/constants';

export interface TiendaConfigPublic {
  emailPedidosInterno: string | null;
  whatsappTelefono: string;
  whatsappMensajeDefault: string;
  retiroDireccion: string;
  retiroHorarios: string | null;
  retiroDemora: string | null;
  retiroNotas: string | null;
  pagoManualInstruccionesExtra: string | null;
  pagoManualHorasPlazo: number;
}

export interface PaymentCopyInput {
  emailPedidosInterno?: string | null;
  whatsappTelefono?: string;
  pagoManualHorasPlazo?: number;
  pagoManualInstruccionesExtra?: string | null;
}

/** WhatsApp + email de tienda (si está configurado) para enviar comprobante. */
export function buildProofContactPhrase(
  phone: string,
  emailPedidosInterno?: string | null
): string {
  const email = emailPedidosInterno?.trim();
  if (email) {
    return `por WhatsApp al ${phone} o por email a ${email}`;
  }
  return `por WhatsApp al ${phone}`;
}

/** `checkout` = antes de confirmar (incluye plazo genérico). `confirmation` = post-pedido (plazo exacto va en el hero). */
export type PaymentCopyVariant = 'checkout' | 'confirmation';

export interface PaymentCopyOptions extends PaymentCopyInput {
  externalOrderId?: string;
  variant?: PaymentCopyVariant;
}

export function buildPaymentProofMessage(config?: PaymentCopyOptions): string {
  const phone = config?.whatsappTelefono?.trim() || WHATSAPP_PHONE_NUMBER;
  const contact = buildProofContactPhrase(phone, config?.emailPedidosInterno);
  const hours = config?.pagoManualHorasPlazo ?? 48;
  const extra = config?.pagoManualInstruccionesExtra?.trim();
  const variant = config?.variant ?? 'checkout';
  const base =
    variant === 'confirmation'
      ? `Enviá el comprobante de la transferencia ${contact}.`
      : `Enviá el comprobante de la transferencia ${contact}. Tenés ${hours} horas para abonar una vez confirmado el pedido.`;
  return extra ? `${base} ${extra}` : base;
}

export function buildEfectivoProofMessage(config?: PaymentCopyOptions): string {
  const phone = config?.whatsappTelefono?.trim() || WHATSAPP_PHONE_NUMBER;
  const contact = buildProofContactPhrase(phone, config?.emailPedidosInterno);
  const extra = config?.pagoManualInstruccionesExtra?.trim();
  const orderRef = config?.externalOrderId?.trim();
  const orderPart = orderRef ? ` Incluí el pedido ${orderRef} al escribir.` : '';
  const base = `Coordiná el pago y enviá comprobante ${contact}.${orderPart}`;
  return extra ? `${base} ${extra}` : base;
}

export function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${getWhatsAppNumberForUrl(phone)}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_TIENDA_CONFIG_PUBLIC: TiendaConfigPublic = {
  emailPedidosInterno: null,
  whatsappTelefono: WHATSAPP_PHONE_NUMBER,
  whatsappMensajeDefault: WHATSAPP_DEFAULT_MESSAGE,
  retiroDireccion: 'Alta Córdoba, Córdoba Capital.',
  retiroHorarios: null,
  retiroDemora: 'Demora de 48 a 72 hs para poder retirar',
  retiroNotas: 'Esperá confirmación por mail',
  pagoManualInstruccionesExtra: null,
  pagoManualHorasPlazo: 48,
};
