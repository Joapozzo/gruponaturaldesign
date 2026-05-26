import { z } from 'zod';

export const shippingProviderSchema = z.enum(['correo', 'andreani']);

export const shippingTrackingEventSchema = z.object({
  statusId: z.string(),
  status: z.string(),
  date: z.string(),
  facility: z.string(),
});

export const shippingTrackingResultSchema = z.object({
  trackingNumber: z.string(),
  provider: shippingProviderSchema,
  events: z.array(shippingTrackingEventSchema),
});

export const shippingTrackingResponseSchema = z.object({
  results: z.array(shippingTrackingResultSchema),
  trackingUrl: z.string().optional(),
});

export type ShippingProviderId = z.infer<typeof shippingProviderSchema>;
export type ShippingTrackingEvent = z.infer<typeof shippingTrackingEventSchema>;
export type ShippingTrackingResult = z.infer<typeof shippingTrackingResultSchema>;
export type ShippingTrackingResponse = z.infer<typeof shippingTrackingResponseSchema>;

export const shippingTrackingFormSchema = z.object({
  provider: shippingProviderSchema,
  trackingNumber: z.string().trim().min(1, 'Ingresá el número de envío'),
});

export type ShippingTrackingFormValues = z.infer<typeof shippingTrackingFormSchema>;
