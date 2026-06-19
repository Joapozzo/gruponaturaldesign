/** Alineado con NEWSLETTER_MAX_RECIPIENTS del API (Resend gratis: 100/día). */
export const MAX_NEWSLETTER_RECIPIENTS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_NEWSLETTER_MAX_RECIPIENTS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 100;
})();
