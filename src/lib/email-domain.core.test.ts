import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isConsumerEmailDomain,
  validateConsumerEmail,
  isValidEmailFormat,
  CONSUMER_EMAIL_DOMAIN_ERROR,
} from './email-domain.core';

describe('email-domain.core', () => {
  it('acepta dominios de proveedores habituales', () => {
    expect(isConsumerEmailDomain('user@gmail.com')).toBe(true);
    expect(isConsumerEmailDomain('User@OUTLOOK.COM')).toBe(true);
    expect(isConsumerEmailDomain('x@yahoo.com.ar')).toBe(true);
  });

  it('rechaza dominios no listados', () => {
    expect(isConsumerEmailDomain('qa@empresa.com')).toBe(false);
    expect(validateConsumerEmail('qa@empresa.com', { skipDomainCheck: false })).toBe(
      CONSUMER_EMAIL_DOMAIN_ERROR
    );
  });

  it('permite cualquier dominio con skipDomainCheck', () => {
    expect(validateConsumerEmail('test@example.com', { skipDomainCheck: true })).toBeUndefined();
  });

  it('valida formato de email', () => {
    expect(isValidEmailFormat('bad')).toBe(false);
    expect(isValidEmailFormat('ok@gmail.com')).toBe(true);
  });

  it('requiere email no vacío', () => {
    expect(validateConsumerEmail('')).toBe('El email es requerido');
  });
});
