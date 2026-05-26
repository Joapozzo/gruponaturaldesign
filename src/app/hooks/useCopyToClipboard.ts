'use client';

import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { copyTextToClipboard } from '@/app/utils/copyToClipboard';

type UseCopyToClipboardOptions = {
  successMessage?: string;
  errorMessage?: string;
  resetMs?: number;
};

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const {
    successMessage = 'Copiado',
    errorMessage = 'No se pudo copiar',
    resetMs = 2000,
  } = options;

  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyTextToClipboard(text);
      if (!ok) {
        toast.error(errorMessage);
        return false;
      }

      setCopied(true);
      toast.success(successMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [successMessage, errorMessage, resetMs]
  );

  return { copied, copy };
}
