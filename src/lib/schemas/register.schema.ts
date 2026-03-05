import { z } from 'zod';
import { createPasswordSchema } from './password.schema';

/** Schema para el formulario de registro (email + contraseña + confirmar) */
export const registerFormSchema = z
  .object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: createPasswordSchema(),
    confirmPassword: z.string().min(1, 'Confirmá la contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
