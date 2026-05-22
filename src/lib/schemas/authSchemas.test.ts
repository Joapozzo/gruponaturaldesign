import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loginFormSchema } from './login.schema';
import { registerFormSchema } from './register.schema';
import { contactSchema } from '@/app/schemas/contactSchema';
import { getNextPasswordRule, getPasswordRuleChecks } from './password.schema';

describe('authSchemas', () => {
  const prev = process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    else process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = prev;
  });

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
  });

  it('loginFormSchema acepta gmail y rechaza password vacío', () => {
    expect(loginFormSchema.safeParse({ email: 'u@gmail.com', password: 'x' }).success).toBe(true);
    expect(loginFormSchema.safeParse({ email: 'u@gmail.com', password: '' }).success).toBe(false);
  });

  it('registerFormSchema valida contraseña fuerte y coincidencia', () => {
    const ok = registerFormSchema.safeParse({
      email: 'u@gmail.com',
      password: 'Abcdef1!',
      confirmPassword: 'Abcdef1!',
    });
    expect(ok.success).toBe(true);

    const mismatch = registerFormSchema.safeParse({
      email: 'u@gmail.com',
      password: 'Abcdef1!',
      confirmPassword: 'Other1!',
    });
    expect(mismatch.success).toBe(false);
  });

  it('contactSchema exige términos y mensaje mínimo', () => {
    const fail = contactSchema.safeParse({
      email: 'a@b.com',
      empresa: 'ACME',
      telefono: '11223344',
      mensaje: 'corto',
      aceptaTerminos: false,
    });
    expect(fail.success).toBe(false);

    const ok = contactSchema.safeParse({
      email: 'contacto@empresa.com',
      empresa: 'ACME Corp',
      telefono: '1122334455',
      mensaje: 'Mensaje de prueba con longitud',
      aceptaTerminos: true,
    });
    expect(ok.success).toBe(true);
  });

  it('getPasswordRuleChecks evalúa reglas', () => {
    const weak = getPasswordRuleChecks('abc');
    expect(weak.every((r) => r.ok)).toBe(false);
    const strong = getPasswordRuleChecks('Abcdef1!');
    expect(strong.every((r) => r.ok)).toBe(true);
  });

  it('getNextPasswordRule devuelve la primera regla pendiente', () => {
    expect(getNextPasswordRule('')?.id).toBe('minLength');
    expect(getNextPasswordRule('abcdefgh')?.id).toBe('uppercase');
    expect(getNextPasswordRule('Abcdefg1!')).toBeNull();
  });
});
