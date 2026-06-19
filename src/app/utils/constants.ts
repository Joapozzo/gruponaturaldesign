/**
 * Constantes globales de la aplicación
 */

/** Nombre público de marca (SEO, títulos, textos). NTDS es la sigla; no combinar ambos. */
export const BRAND_NAME = 'Natural Design';
export const BRAND_SHORT = 'NTDS';

// IVA en Argentina (21%)
export const IVA_RATE = 0.21;

// Constante para el IVA como porcentaje
export const IVA_PERCENTAGE = 21;

// Número de teléfono de WhatsApp para contactos y pedidos
export const WHATSAPP_PHONE_NUMBER = '+54 9 3517 13-6311';

// Número de teléfono formateado con guiones (útil para schema.org y metadatos)
export const WHATSAPP_PHONE_NUMBER_FORMATTED = WHATSAPP_PHONE_NUMBER.replace(/\s/g, '-');

// Función helper para obtener el número sin caracteres especiales (útil para URLs de WhatsApp)
export const getWhatsAppNumberForUrl = (phoneNumber: string = WHATSAPP_PHONE_NUMBER): string => {
    return phoneNumber.replace(/\D/g, '');
};

/** Dirección / instrucciones para retiro en tienda (checkout paso envío). */
export const CHECKOUT_STORE_PICKUP_ADDRESS =
    'Alta Córdoba, Córdoba Capital. Coordiná el retiro por WhatsApp indicando tu nombre y número de pedido.';








