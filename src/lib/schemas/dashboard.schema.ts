import { z } from 'zod';

const dateYmd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Debe ser YYYY-MM-DD')
  .max(10);

export const dashboardKpisInputSchema = z.object({
  fechaDesde: dateYmd.optional(),
  fechaHasta: dateYmd.optional(),
  compare: z.boolean().optional(),
  segmentarTipoCliente: z.boolean().optional(),
});

export const dashboardSerieInputSchema = z.object({
  fechaDesde: dateYmd.optional(),
  fechaHasta: dateYmd.optional(),
});

export const dashboardAlertasInputSchema = z.object({
  limitePendientesConfirmacion: z.number().int().positive().max(50).optional(),
  limiteSfactoryIssues: z.number().int().positive().max(50).optional(),
  limitePagoPendienteAntiguo: z.number().int().positive().max(50).optional(),
  horasPagoPendienteMin: z.number().int().positive().max(720).optional(),
});

export const dashboardRecientesInputSchema = z.object({
  limit: z.number().int().positive().max(50).optional(),
});

export const dashboardStockCriticoInputSchema = z.object({
  limit: z.number().int().positive().max(200).optional(),
  maxStock: z.number().nonnegative().max(999_999).optional(),
  incluirSinStockSync: z.boolean().optional(),
});

export const dashboardFullInputSchema = z.object({
  fechaDesde: dateYmd.optional(),
  fechaHasta: dateYmd.optional(),
  serieFechaDesde: dateYmd.optional(),
  serieFechaHasta: dateYmd.optional(),
  compare: z.boolean().optional(),
  segmentarTipoCliente: z.boolean().optional(),
  limitePendientesConfirmacion: z.number().int().positive().max(50).optional(),
  limiteSfactoryIssues: z.number().int().positive().max(50).optional(),
  limitePagoPendienteAntiguo: z.number().int().positive().max(50).optional(),
  horasPagoPendienteMin: z.number().int().positive().max(720).optional(),
  limitRecientes: z.number().int().positive().max(50).optional(),
  limitStockCritico: z.number().int().positive().max(200).optional(),
  maxStockCritico: z.number().nonnegative().max(999_999).optional(),
  incluirSinStockSync: z.boolean().optional(),
});

export type DashboardKpisInput = z.infer<typeof dashboardKpisInputSchema>;
export type DashboardSerieInput = z.infer<typeof dashboardSerieInputSchema>;
export type DashboardAlertasInput = z.infer<typeof dashboardAlertasInputSchema>;
export type DashboardRecientesInput = z.infer<typeof dashboardRecientesInputSchema>;
export type DashboardStockCriticoInput = z.infer<typeof dashboardStockCriticoInputSchema>;
export type DashboardFullInput = z.infer<typeof dashboardFullInputSchema>;
