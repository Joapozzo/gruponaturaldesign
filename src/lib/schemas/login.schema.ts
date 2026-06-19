import { z } from 'zod';

/** Login: solo formato válido (cuentas existentes pueden tener cualquier dominio). */
export const loginFormSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
