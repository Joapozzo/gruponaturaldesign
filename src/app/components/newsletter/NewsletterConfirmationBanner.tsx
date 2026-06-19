'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useNewsletterEligible } from '@/app/hooks/useNewsletterEligible';
import { useNewsletterSubscribe, NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE } from '@/app/hooks/useNewsletterSubscribe';

const NEWSLETTER_FLAG = 'newsletter_subscribed';

interface NewsletterConfirmationBannerProps {
  defaultEmail?: string | null;
}

export default function NewsletterConfirmationBanner({
  defaultEmail,
}: NewsletterConfirmationBannerProps) {
  const eligible = useNewsletterEligible();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState(defaultEmail ?? '');
  const { subscribe, state, error } = useNewsletterSubscribe();

  useEffect(() => {
    setMounted(true);
    setVisible(localStorage.getItem(NEWSLETTER_FLAG) !== 'true');
  }, []);

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    if (state === 'success' || state === 'already_subscribed') {
      setVisible(false);
    }
  }, [state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await subscribe(email.trim());
  };

  if (!mounted || !eligible || !visible) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm font-semibold text-black">
        ¿Querés recibir novedades y ofertas exclusivas?
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#Ed3237] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === 'loading' ? 'Enviando...' : 'Suscribirme'}
        </button>
      </form>
      {state === 'success' && <p className="mt-2 text-sm text-green-700">¡Suscripto!</p>}
      {state === 'already_subscribed' && (
        <p className="mt-2 text-sm text-gray-700">{NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE}</p>
      )}
      {state === 'error' && error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
