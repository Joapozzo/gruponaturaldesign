import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ShippingData } from '@/app/types/cart';
import { useCheckoutStep3Shipping } from './useCheckoutStep3Shipping';
import { quoteCheckoutShipping } from '@/app/services/checkoutShipping.service';

const { shippingRef, patchShipping } = vi.hoisted(() => {
  const shippingRef = {
    current: {
      tipo: 'envio' as const,
      direccion: 'Av Siempre Viva 742',
      localidad: 'CABA',
      provincia: 'Buenos Aires',
      codigo_postal: '1406',
    } as ShippingData,
  };
  const patchShipping = vi.fn((partial: Partial<ShippingData>) => {
    shippingRef.current = { ...shippingRef.current, ...partial };
  });
  return { shippingRef, patchShipping };
});

vi.mock('@/app/hooks/useCheckoutShippingForm', () => ({
  useCheckoutShippingForm: () => ({
    get shipping() {
      return shippingRef.current;
    },
    errors: {},
    touched: {},
    handleShippingChange: vi.fn(),
    patchShipping,
    handleBlur: vi.fn(),
    handleSubmit: vi.fn(),
  }),
}));

vi.mock('@/app/components/hooks/useCart', () => ({
  useCart: () => ({
    shippingData: null,
    setShippingData: vi.fn(),
    itemCount: 2,
    items: [],
    subtotal: 100,
    total: 121,
  }),
}));

const isWholesaleLimitReachedRef = { current: false };

vi.mock('@/app/contexts/SalesContext', () => ({
  useSales: () => ({ isWholesaleLimitReached: isWholesaleLimitReachedRef.current }),
}));

vi.mock('@/app/services/checkoutShipping.service', () => ({
  quoteCheckoutShipping: vi.fn(),
  fetchCheckoutShippingAgencies: vi.fn().mockResolvedValue([]),
}));

describe('useCheckoutStep3Shipping', () => {
  const onNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    isWholesaleLimitReachedRef.current = false;
    shippingRef.current = {
      tipo: 'envio',
      direccion: 'Av Siempre Viva 742',
      localidad: 'CABA',
      provincia: 'Buenos Aires',
      codigo_postal: '1406',
    };
    vi.mocked(quoteCheckoutShipping).mockResolvedValue({ precio: 2500 });
  });

  it('canCalculateShipping true con dirección completa', () => {
    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));
    expect(result.current.canCalculateShipping).toBe(true);
  });

  it('canContinue true con retiro en local', () => {
    shippingRef.current = { tipo: 'retiro' };
    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));
    expect(result.current.canContinue).toBe(true);
  });

  it('canContinue false si wholesale limit alcanzado', () => {
    isWholesaleLimitReachedRef.current = true;
    shippingRef.current = { tipo: 'retiro' };
    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));
    expect(result.current.canContinue).toBe(false);
  });

  it('handleSelectDeliveryTipo retiro limpia checkoutEnvio', () => {
    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));

    act(() => result.current.handleSelectDeliveryTipo('retiro'));

    expect(patchShipping).toHaveBeenCalledWith(
      expect.objectContaining({
        tipo: 'retiro',
        checkoutEnvio: undefined,
        checkoutProvider: undefined,
      })
    );
  });

  it('calculateShipping cotiza 4 opciones y aplica la más barata', async () => {
    vi.mocked(quoteCheckoutShipping)
      .mockResolvedValueOnce({ precio: 5000 })
      .mockResolvedValueOnce({ precio: 1200, correoOpciones: [{ price: 1200, serviceCode: 'STD' }] })
      .mockResolvedValueOnce({ precio: 3000 })
      .mockResolvedValueOnce({ precio: 4000 });

    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));

    await act(async () => {
      result.current.calculateShipping();
    });

    await waitFor(() => expect(result.current.quoteLoading).toBe(false));

    expect(quoteCheckoutShipping).toHaveBeenCalledTimes(4);
    expect(patchShipping).toHaveBeenCalledWith(
      expect.objectContaining({
        checkoutEnvio: expect.objectContaining({
          clientQuotedAmount: 1200,
          cpDestino: '1406',
        }),
      })
    );
    expect(result.current.selectedOptionId).toBe('correo-agency');
  });
});
