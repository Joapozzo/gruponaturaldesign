'use client';

import { FormEvent, useState } from 'react';
import { useNewsletterSubscribe } from '@/app/hooks/useNewsletterSubscribe';

export default function NewsletterOutOfStockForm() {
  const [email, setEmail] = useState('');
  const { subscribe, state, error } = useNewsletterSubscribe();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await subscribe(email.trim());
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm font-semibold text-black">¿Te avisamos cuando llegue?</p>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 sm:flex-row">
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
          {state === 'loading' ? 'Enviando...' : 'Avisarme'}
        </button>
      </form>
      {state === 'success' && <p className="mt-2 text-xs text-green-700">¡Suscripto!</p>}
      {state === 'error' && error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
