'use client';

import { FormEvent, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BaseModal from '@/app/components/modal/BaseModal';
import { useNewsletterEligible } from '@/app/hooks/useNewsletterEligible';
import { useNewsletterSubscribe, NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE } from '@/app/hooks/useNewsletterSubscribe';

const NEWSLETTER_FLAG = 'newsletter_subscribed';

export default function NewsletterPopup() {
  const pathname = usePathname();
  const eligible = useNewsletterEligible();

  if (pathname?.startsWith('/maintenance')) {
    return null;
  }
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { subscribe, state, error } = useNewsletterSubscribe();

  useEffect(() => {
    setMounted(true);
    if (!eligible) return;
    const id = window.setTimeout(() => {
      if (localStorage.getItem(NEWSLETTER_FLAG) === 'true') return;
      setIsOpen(true);
    }, 45000);

    return () => window.clearTimeout(id);
  }, [eligible]);

  useEffect(() => {
    if (state === 'success') {
      localStorage.setItem(NEWSLETTER_FLAG, 'true');
      setIsOpen(false);
    } else if (state === 'already_subscribed') {
      localStorage.setItem(NEWSLETTER_FLAG, 'true');
      setIsOpen(false);
    }
  }, [state]);

  const handleClose = () => {
    localStorage.setItem(NEWSLETTER_FLAG, 'true');
    setIsOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await subscribe(email.trim());
  };

  if (!mounted || !eligible) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showCloseButton
      contentClassName="p-6"
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-black">¿Querés recibir novedades?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enterate primero de nuevos productos, promociones y lanzamientos de NTDS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full rounded bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#Ed3237] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
          {state === 'success' && <p className="text-sm text-green-700">¡Suscripto!</p>}
          {state === 'already_subscribed' && (
            <p className="text-sm text-gray-700">{NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE}</p>
          )}
          {state === 'error' && error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </BaseModal>
  );
}
