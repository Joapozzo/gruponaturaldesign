import { z } from 'zod';
import { shippingProviderSchema } from '@/app/validation/shippingTracking.schema';

export const pedidoLabelReasonSchema = z.enum([
  'retiro_tienda',
  'correo_portal_only',
  'missing_provider',
  'missing_tracking',
  'missing_andreani_agrupador',
  'andreani_ready',
]);

export const pedidoLabelAvailabilitySchema = z.object({
  canDownload: z.boolean(),
  provider: shippingProviderSchema.nullable(),
  trackingNumber: z.string().nullable(),
  reason: pedidoLabelReasonSchema,
  message: z.string(),
});

export type PedidoLabelReason = z.infer<typeof pedidoLabelReasonSchema>;
export type PedidoLabelAvailability = z.infer<typeof pedidoLabelAvailabilitySchema>;
