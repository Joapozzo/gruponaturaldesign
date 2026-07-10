import { isMetaPixelEnabled, getMetaPixelId } from '@/app/analytics/metaPixel/metaPixel.config';
import {
  buildMetaPixelAnalyticsFromCart,
  metaAnalyticsToEventParams,
  mapCartProductToMetaContent,
} from '@/app/analytics/metaPixel/metaPixel.mappers';
import {
  META_CUSTOM_EVENT_PEDIDO_CREADO,
  META_PIXEL_CURRENCY,
  type MetaPixelAnalytics,
  type MetaPixelViewContentParams,
} from '@/app/analytics/metaPixel/metaPixel.types';
import type { CartItem, CartProduct } from '@/app/types/cart';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function canTrack(): boolean {
  return (
    isMetaPixelEnabled() &&
    typeof window !== 'undefined' &&
    typeof window.fbq === 'function'
  );
}

function dedupeKey(event: string, eventId?: string): string | null {
  if (!eventId) return null;
  return `meta_pixel:${event}:${eventId}`;
}

function wasAlreadyTracked(key: string | null): boolean {
  if (!key || typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function markTracked(key: string | null): void {
  if (!key || typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    /* quota / private mode */
  }
}

function track(event: string, params?: Record<string, unknown>, eventId?: string): void {
  if (!canTrack()) return;

  const key = dedupeKey(event, eventId);
  if (wasAlreadyTracked(key)) return;

  if (eventId) {
    window.fbq!('track', event, params ?? {}, { eventID: eventId });
  } else {
    window.fbq!('track', event, params ?? {});
  }

  markTracked(key);
}

export function trackMetaPageView(): void {
  if (!canTrack()) return;
  window.fbq!('track', 'PageView');
}

export function trackMetaViewContent(params: MetaPixelViewContentParams): void {
  const eventId = `view_content:${params.contentId}`;
  track(
    'ViewContent',
    {
      content_ids: [params.contentId],
      content_name: params.contentName,
      content_type: 'product',
      ...(params.contentCategory ? { content_category: params.contentCategory } : {}),
      value: params.value,
      currency: META_PIXEL_CURRENCY,
    },
    eventId
  );
}

export function trackMetaAddToCart(product: CartProduct, quantity: number): void {
  const content = mapCartProductToMetaContent(product, quantity);
  track('AddToCart', {
    content_ids: [content.id],
    content_type: 'product',
    contents: [content],
    value: content.item_price * quantity,
    currency: META_PIXEL_CURRENCY,
    num_items: quantity,
  });
}

const INITIATE_CHECKOUT_KEY = 'meta_pixel:InitiateCheckout';

export function trackMetaInitiateCheckout(items: CartItem[], value: number): void {
  if (wasAlreadyTracked(INITIATE_CHECKOUT_KEY)) return;
  if (!canTrack()) return;

  const analytics = metaAnalyticsToEventParams(
    buildMetaPixelAnalyticsFromCart(items, value)
  );
  track('InitiateCheckout', analytics);
  markTracked(INITIATE_CHECKOUT_KEY);
}

export function trackMetaAddPaymentInfo(
  items: CartItem[],
  value: number,
  paymentMethod: string
): void {
  const analytics = metaAnalyticsToEventParams(
    buildMetaPixelAnalyticsFromCart(items, value)
  );
  track('AddPaymentInfo', {
    ...analytics,
    payment_method: paymentMethod,
  });
}

export function trackMetaPurchase(analytics: MetaPixelAnalytics, pedidoId: number): void {
  track('Purchase', metaAnalyticsToEventParams(analytics), `pedido_${pedidoId}`);
}

export function trackMetaPedidoCreado(analytics: MetaPixelAnalytics, pedidoId: number): void {
  track(
    META_CUSTOM_EVENT_PEDIDO_CREADO,
    metaAnalyticsToEventParams(analytics),
    `pedido_creado_${pedidoId}`
  );
}

export { getMetaPixelId, isMetaPixelEnabled };
