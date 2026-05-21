import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCupon,
  updateCupon,
  pausarCupon,
  activarCupon,
  deleteCupon,
} from '@/app/services/cuponesAdmin.service';
import { cuponesAdminKeys } from './cuponesQueryKeys';
import type { CuponCreatePayload, CuponUpdatePayload } from '@/app/types/cupones';

export function useCuponAdminMutations() {
  const qc = useQueryClient();

  const invalidateLists = () => {
    qc.invalidateQueries({ queryKey: cuponesAdminKeys.lists() });
  };

  const create = useMutation({
    mutationFn: (data: CuponCreatePayload) => createCupon(data),
    onSuccess: () => invalidateLists(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CuponUpdatePayload }) => updateCupon(id, data),
    onSuccess: (_, vars) => {
      invalidateLists();
      qc.invalidateQueries({ queryKey: cuponesAdminKeys.detail(vars.id) });
    },
  });

  const pausar = useMutation({
    mutationFn: (id: number) => pausarCupon(id),
    onSuccess: (_, id) => {
      invalidateLists();
      qc.invalidateQueries({ queryKey: cuponesAdminKeys.detail(id) });
    },
  });

  const activar = useMutation({
    mutationFn: (id: number) => activarCupon(id),
    onSuccess: (_, id) => {
      invalidateLists();
      qc.invalidateQueries({ queryKey: cuponesAdminKeys.detail(id) });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteCupon(id),
    onSuccess: () => invalidateLists(),
  });

  return { create, update, pausar, activar, remove };
}