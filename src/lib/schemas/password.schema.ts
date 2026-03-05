import { z } from 'zod';

/** Opciones para el schema de contraseña (reutilizable en registro, reset, etc.) */
export interface PasswordSchemaOptions {
  minLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
}

const DEFAULT_OPTIONS: Required<PasswordSchemaOptions> = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecial: true,
};

/** Regex y labels para cada regla (usados por el schema y por la UI) */
export const PASSWORD_RULES = {
  minLength: (n: number) => ({
    label: `Mín. ${n} caracteres`,
    test: (value: string) => value.length >= n,
  }),
  lowercase: {
    label: 'Una minúscula',
    test: (value: string) => /[a-z]/.test(value),
  },
  uppercase: {
    label: 'Una mayúscula',
    test: (value: string) => /[A-Z]/.test(value),
  },
  number: {
    label: 'Un número',
    test: (value: string) => /\d/.test(value),
  },
  special: {
    label: 'Un carácter especial',
    test: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
} as const;

export type PasswordRuleId = keyof typeof PASSWORD_RULES;

/** Evalúa todas las reglas aplicables para un valor (para UI live) */
export function getPasswordRuleChecks(
  value: string,
  options: PasswordSchemaOptions = {}
): Array<{ id: string; label: string; ok: boolean }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const out: Array<{ id: string; label: string; ok: boolean }> = [];

  out.push({
    id: 'minLength',
    label: PASSWORD_RULES.minLength(opts.minLength).label,
    ok: PASSWORD_RULES.minLength(opts.minLength).test(value),
  });
  if (opts.requireLowercase) {
    out.push({ id: 'lowercase', label: PASSWORD_RULES.lowercase.label, ok: PASSWORD_RULES.lowercase.test(value) });
  }
  if (opts.requireUppercase) {
    out.push({ id: 'uppercase', label: PASSWORD_RULES.uppercase.label, ok: PASSWORD_RULES.uppercase.test(value) });
  }
  if (opts.requireNumber) {
    out.push({ id: 'number', label: PASSWORD_RULES.number.label, ok: PASSWORD_RULES.number.test(value) });
  }
  if (opts.requireSpecial) {
    out.push({ id: 'special', label: PASSWORD_RULES.special.label, ok: PASSWORD_RULES.special.test(value) });
  }
  return out;
}

/** Crea un schema Zod de contraseña reutilizable */
export function createPasswordSchema(options: PasswordSchemaOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return z
    .string()
    .min(opts.minLength, `Mínimo ${opts.minLength} caracteres`)
    .refine((v) => !opts.requireLowercase || /[a-z]/.test(v), 'Incluí al menos una minúscula')
    .refine((v) => !opts.requireUppercase || /[A-Z]/.test(v), 'Incluí al menos una mayúscula')
    .refine((v) => !opts.requireNumber || /\d/.test(v), 'Incluí al menos un número')
    .refine((v) => !opts.requireSpecial || /[^a-zA-Z0-9]/.test(v), 'Incluí al menos un carácter especial');
}

/** Schema por defecto (registro / cambio de contraseña) */
export const passwordSchema = createPasswordSchema();

export type PasswordSchemaType = z.infer<ReturnType<typeof createPasswordSchema>>;
