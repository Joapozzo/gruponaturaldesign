'use client';

import { CopyButton } from '@/components/ui/CopyButton';

export function CuponCodigoCell({ codigo }: { codigo: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm font-medium">{codigo}</span>
      <CopyButton value={codigo} label="Código" />
    </div>
  );
}
