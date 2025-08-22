import { z } from 'zod';

export const contactSchema = z.object({
    nombreCompleto: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

    email: z
        .string()
        .email('Ingresa un email válido')
        .min(1, 'El email es requerido')
        .max(100, 'El email no puede exceder 100 caracteres'),

    empresa: z
        .string()
        .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
        .max(100, 'El nombre de la empresa no puede exceder 100 caracteres'),

    telefono: z
        .string()
        .min(8, 'El teléfono debe tener al menos 8 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[\d\s\-\+\(\)]+$/, 'El teléfono solo puede contener números, espacios, guiones y paréntesis'),

    mensaje: z
        .string()
        .min(10, 'El mensaje debe tener al menos 10 caracteres')
        .max(1000, 'El mensaje no puede exceder 1000 caracteres'),

    aceptaTerminos: z
        .boolean()
        .refine(val => val === true, 'Debes aceptar las políticas de privacidad')
});

export type ContactFormData = z.infer<typeof contactSchema>;