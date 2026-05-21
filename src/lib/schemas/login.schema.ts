import { z } from 'zod';
import { createConsumerEmailSchema } from './email.schema';

export const loginFormSchema = z.object({
  email: createConsumerEmailSchema(),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
