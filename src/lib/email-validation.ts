import { isIntegrationsLiveClient } from './integrations-env';
import {
  CONSUMER_EMAIL_DOMAIN_ERROR,
  CONSUMER_EMAIL_DOMAINS,
  extractEmailDomain,
  isConsumerEmailDomain,
  isValidEmailFormat,
  validateConsumerEmail,
} from './email-domain.core';

export {
  CONSUMER_EMAIL_DOMAIN_ERROR,
  CONSUMER_EMAIL_DOMAINS,
  extractEmailDomain,
  isConsumerEmailDomain,
  isValidEmailFormat,
  validateConsumerEmail,
};

/** Bypass solo en test; en `NEXT_PUBLIC_INTEGRATIONS_ENV=production` siempre se exige proveedor habitual. */
export function skipConsumerEmailDomainCheck(): boolean {
  if (isIntegrationsLiveClient()) return false;
  return process.env.NEXT_PUBLIC_ALLOW_ANY_EMAIL_DOMAIN === 'true';
}

/** Valida formato + dominio de proveedor según entorno. */
export function validateEmailForApp(email: string): string | undefined {
  return validateConsumerEmail(email, {
    skipDomainCheck: skipConsumerEmailDomainCheck(),
  });
}
