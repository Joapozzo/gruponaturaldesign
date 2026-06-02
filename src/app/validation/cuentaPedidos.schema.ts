import { z } from 'zod';

export const customerOrderStatusSchema = z.enum([
  'pendiente_pago',
  'pendiente_confirmacion',
  'confirmado',
  'en_preparacion',
  'enviado',
  'entregado',
  'cancelado',
  'fallido',
  'vencido',
]);

export const cuentaPedidoListItemSchema = z.object({
  id: z.number().int().positive(),
  numero: z.string(),
  fechaPedido: z.string(),
  estado: customerOrderStatusSchema,
  estadoLabel: z.string(),
  formaPago: z.enum(['mercado_pago', 'transferencia', 'efectivo']).nullable(),
  total: z.number(),
  descuentoTotal: z.number(),
  itemCount: z.number().int().nonnegative(),
  trackingUrl: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  shippingProvider: z.enum(['correo', 'andreani']).nullable(),
  requiresPostalShipping: z.boolean(),
  canViewPaymentInstructions: z.boolean(),
  syncStatus: z.enum(['pending', 'synced', 'conflict', 'error']),
  sfactoryOrdenId: z.number().nullable(),
  sfactoryExternalOrderId: z.string().nullable(),
});

export const cuentaPedidoItemLineSchema = z.object({
  id: z.number().int().positive(),
  productName: z.string(),
  productSlug: z.string().min(1).optional(),
  quantity: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  especificaciones: z.string().optional(),
});

export const cuentaPedidoDetailSchema = cuentaPedidoListItemSchema.extend({
  items: z.array(cuentaPedidoItemLineSchema),
  observaciones: z.string().nullable(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
});

export const cuentaPedidosListResponseSchema = z.object({
  data: z.array(cuentaPedidoListItemSchema),
  pagination: paginationSchema,
});

export type CustomerOrderStatus = z.infer<typeof customerOrderStatusSchema>;
export type CuentaPedidoListItem = z.infer<typeof cuentaPedidoListItemSchema>;
export type CuentaPedidoDetail = z.infer<typeof cuentaPedidoDetailSchema>;
export type CuentaPedidosListResponse = z.infer<typeof cuentaPedidosListResponseSchema>;
