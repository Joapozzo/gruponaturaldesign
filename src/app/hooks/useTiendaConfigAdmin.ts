'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import {
  tiendaConfigToForm,
  type TiendaConfigAdmin,
  type TiendaConfigInput,
} from '@/app/services/tiendaConfig.service';

export function useTiendaConfigAdmin(
  config: TiendaConfigAdmin | null | undefined,
  mutation: UseMutationResult<TiendaConfigAdmin, Error, TiendaConfigInput>,
  options?: { isReady?: boolean }
) {
  const isReady = options?.isReady ?? config !== undefined;

  const [form, setForm] = useState<TiendaConfigInput>(() => tiendaConfigToForm(config ?? null));

  useEffect(() => {
    if (!isReady) return;
    setForm(tiendaConfigToForm(config ?? null));
  }, [config, isReady]);

  const savedForm = useMemo(() => tiendaConfigToForm(config ?? null), [config]);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm]
  );

  const update = (field: keyof TiendaConfigInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    mutation.mutate(form);
  };

  return { form, update, hasChanges, handleSave, setForm };
}
