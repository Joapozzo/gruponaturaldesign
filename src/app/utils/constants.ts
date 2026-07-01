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

export const WHATSAPP_DEFAULT_MESSAGE =
  '¡Hola! Me gustaría recibir atención personalizada.';

export const WHATSAPP_PHONE_NUMBER_FORMATTED = WHATSAPP_PHONE_NUMBER.replace(/\s/g, '-');

export const getWhatsAppNumberForUrl = (phoneNumber: string = WHATSAPP_PHONE_NUMBER): string => {
    return phoneNumber.replace(/\D/g, '');
};

/** @deprecated Usar retiro desde config tienda (`useTiendaConfig`). */
export const CHECKOUT_STORE_PICKUP_ADDRESS =
  'Alta Córdoba, Córdoba Capital. Coordiná el retiro por WhatsApp indicando tu nombre y número de pedido.';

/** Google Maps embed — showroom / retiro en tienda (Rivera Indarte 2143, Córdoba). */
export const STORE_LOCATION_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.5123456789!2d-64.1835!3d-31.4135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2f3456789ab%3A0x123456789abcdef!2sRivera%20Indarte%202143%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar';

export const STORE_LOCATION_MAP_TITLE = 'Ubicación NTDS - Rivera Indarte 2143, Córdoba';








