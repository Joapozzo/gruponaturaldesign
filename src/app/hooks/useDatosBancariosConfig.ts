'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import {
  datosBancariosToForm,
  type DatosBancariosConfig,
  type DatosBancariosInput,
} from '@/app/services/empresaDatosBancarios.service';

export function useDatosBancariosConfig(
  config: DatosBancariosConfig | null | undefined,
  mutation: UseMutationResult<DatosBancariosConfig, Error, DatosBancariosInput>,
  options?: { isReady?: boolean }
) {
  const isReady = options?.isReady ?? config !== undefined;

  const [form, setForm] = useState<DatosBancariosInput>(() => datosBancariosToForm(config ?? null));

  useEffect(() => {
    if (!isReady) return;
    setForm(datosBancariosToForm(config ?? null));
  }, [config, isReady]);

  const savedForm = useMemo(() => datosBancariosToForm(config ?? null), [config]);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm]
  );

  const update = (field: keyof DatosBancariosInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    mutation.mutate(form);
  };

  return { form, update, hasChanges, handleSave, setForm };
}
