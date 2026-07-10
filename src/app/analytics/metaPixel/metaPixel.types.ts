export const META_PIXEL_CURRENCY = 'ARS' as const;

export interface MetaPixelContent {
  id: string;
  quantity: number;
  item_price: number;
}

/** Payload reutilizable en snapshots de checkout y eventos de conversión. */
export interface MetaPixelAnalytics {
  value: number;
  currency: typeof META_PIXEL_CURRENCY;
  contents: MetaPixelContent[];
  content_ids: string[];
  num_items: number;
}

export interface MetaPixelViewContentParams {
  contentId: string;
  contentName: string;
  contentCategory?: string;
  value: number;
}

/** Evento custom para pedidos manuales (transferencia/efectivo) sin pago acreditado. */
export const META_CUSTOM_EVENT_PEDIDO_CREADO = 'PedidoCreado';
