'use client';

import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNewsletterSubscribe } from '@/app/hooks/useNewsletterSubscribe';

export default function NewsletterFooterForm() {
  const [email, setEmail] = useState('');
  const { subscribe, state, error } = useNewsletterSubscribe();

  useEffect(() => {
    if (state === 'success') {
      toast.success('¡Suscripto al newsletter!');
      setEmail('');
    } else if (state === 'error' && error) {
      toast.error(error);
    }
  }, [state, error]);

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
    </form>
  );
}
