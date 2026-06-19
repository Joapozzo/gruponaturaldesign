import { describe, it, expect, afterEach } from 'vitest';
import { skipConsumerEmailDomainCheck, validateEmailForApp } from './email-validation';

describe('email-validation', () => {
  const prevAllow = process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
  const prevIntegrations = process.env.NEXT_PUBLIC_INTEGRATIONS_ENV;

  afterEach(() => {
    if (prevAllow === undefined) delete process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN;
    else process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = prevAllow;
    if (prevIntegrations === undefined) delete process.env.NEXT_PUBLIC_INTEGRATIONS_ENV;
    else process.env.NEXT_PUBLIC_INTEGRATIONS_ENV = prevIntegrations;
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

  it('validateEmailForApp permite cualquier dominio con bypass en test', () => {
    delete process.env.NEXT_PUBLIC_INTEGRATIONS_ENV;
    process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = 'true';
    expect(validateEmailForApp('qa@empresa.com')).toBeUndefined();
  });

  it('no bypass en production aunque NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN=true', () => {
    process.env.NEXT_PUBLIC_INTEGRATIONS_ENV = 'production';
    process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN = 'true';
    expect(skipConsumerEmailDomainCheck()).toBe(false);
    expect(validateEmailForApp('qa@empresa.com')).toBeTruthy();
  });
});
