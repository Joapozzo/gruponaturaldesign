import { describe, it, expect, afterEach } from 'vitest';
import { skipConsumerEmailDomainCheck, validateEmailForApp } from './email-validation';

describe('email-validation', () => {
  const prev = process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    else process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = prev;
  });

  it('skipConsumerEmailDomainCheck según env', () => {
    delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    expect(skipConsumerEmailDomainCheck()).toBe(false);
    process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = 'true';
    expect(skipConsumerEmailDomainCheck()).toBe(true);
  });

  it('validateEmailForApp rechaza dominio corporativo sin bypass', () => {
    delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    expect(validateEmailForApp('qa@empresa.com')).toBeTruthy();
    expect(validateEmailForApp('ok@gmail.com')).toBeUndefined();
  });

  it('validateEmailForApp permite cualquier dominio con bypass', () => {
    process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = 'true';
    expect(validateEmailForApp('qa@empresa.com')).toBeUndefined();
  });
});
