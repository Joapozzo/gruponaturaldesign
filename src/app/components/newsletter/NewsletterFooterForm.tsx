'use client';

import { FormEvent, useState } from 'react';
import { useNewsletterSubscribe } from '@/app/hooks/useNewsletterSubscribe';

export default function NewsletterFooterForm() {
  const [email, setEmail] = useState('');
  const { subscribe, state, error } = useNewsletterSubscribe();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await subscribe(email.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="min-w-0 flex-1 rounded border border-gray-700 bg-transparent px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="shrink-0 rounded bg-[#Ed3237] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === 'loading' ? 'Enviando...' : 'Suscribirme'}
        </button>
      </div>
      {state === 'success' && <p className="text-xs text-green-400">¡Suscripto!</p>}
      {state === 'error' && error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}
