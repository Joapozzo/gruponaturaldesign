'use client';

import { Check, Copy } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

type CopyButtonProps = {
  value: string;
  label?: string;
  title?: string;
  showLabel?: boolean;
  className?: string;
};

export function CopyButton({
  value,
  label = 'Texto',
  title,
  showLabel = false,
  className,
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard({
    successMessage: `${label} copiado`,
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={title ?? `Copiar ${label.toLowerCase()}`}
      onClick={() => copy(value)}
      className={cn('text-neutral-500 hover:text-neutral-800', className)}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {showLabel && <span className="ml-1">{copied ? 'Copiado' : 'Copiar'}</span>}
    </Button>
  );
}
