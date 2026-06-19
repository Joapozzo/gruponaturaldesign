'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  parseMercadoPagoReturnParams,
  type MercadoPagoReturnParsed,
} from '@/app/services/mpResultQuery';

export type MpPaymentResult = MercadoPagoReturnParsed;

export function useMpPaymentResult(): MpPaymentResult {
  const searchParams = useSearchParams();
  return useMemo(() => parseMercadoPagoReturnParams(searchParams), [searchParams]);
}
