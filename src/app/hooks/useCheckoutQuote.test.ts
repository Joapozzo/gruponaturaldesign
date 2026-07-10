import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCheckoutQuote } from './useCheckoutQuote';
import { fetchCheckoutQuote } from '@/app/services/checkoutQuote.service';

vi.mock('@/app/services/checkoutQuote.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/services/checkoutQuote.service')>();
  return {
    ...actual,
    fetchCheckoutQuote: vi.fn(),
  };
});

const baseQuote = {
  quoteId: 'q-1',
  expiresAt: new Date(Date.now() + 600_000).toISOString(),
  moneda: 'ARS' as const,
  lineas: [],
  subtotalProductos: 1000,
  descuentoCupon: 0,
  costoEnvio: 200,
  totalFinal: 1200,
  paymentKind: 'manual' as const,
  manualFormaPago: 'transferencia' as const,
};

const cartItem = {
  product: {
    id: 1,
    nombre: 'Prod',
    codigo: 'P1',
    precioLista: 100,
  },
  quantity: 1,
};

describe('useCheckoutQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchCheckoutQuote).mockResolvedValue(baseQuote);
  });

  it('cotiza pago manual con debounce', async () => {
    const { result } = renderHook(() =>
      useCheckoutQuote({
        items: [cartItem],
        shippingData: null,
        paymentMetodo: 'transferencia',
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.quote?.totalFinal).toBe(1200);
    });
    expect(fetchCheckoutQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentKind: 'manual',
        manualFormaPago: 'transferencia',
      })
    );
  });

  it('cotiza transfer y financiado en paralelo para MP', async () => {
    vi.mocked(fetchCheckoutQuote)
      .mockResolvedValueOnce({ ...baseQuote, totalFinal: 900, mpPricingMode: 'transfer', paymentKind: 'mercado_pago' })
      .mockResolvedValueOnce({ ...baseQuote, totalFinal: 1100, mpPricingMode: 'financiado', paymentKind: 'mercado_pago' });

    const { result } = renderHook(() =>
      useCheckoutQuote({
        items: [cartItem],
        shippingData: null,
        paymentMetodo: 'mercado_pago',
        mpModo: 'financiado',
        enabled: true,
      })
    );

    await waitFor(() => {
      expect(result.current.mpQuotes.financiado?.totalFinal).toBe(1100);
    });
    expect(fetchCheckoutQuote).toHaveBeenCalledTimes(2);
    expect(result.current.quote?.totalFinal).toBe(1100);
  });
});
