import { useMutation } from '@tanstack/react-query';
import { validarCupon, type ValidarCuponParams } from '@/app/services/cupones.service';
import type { CuponValidacionResponse } from '@/app/types/cupones';

interface UseCuponValidateOptions {
  onSuccess?: (data: CuponValidacionResponse) => void;
  onError?: (error: Error) => void;
}

export function useCuponValidate(options?: UseCuponValidateOptions) {
  return useMutation({
    mutationFn: (params: ValidarCuponParams) => validarCupon(params),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}