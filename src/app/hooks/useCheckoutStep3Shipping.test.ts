import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { ShippingData } from '@/app/types/cart';
import { useCheckoutStep3Shipping } from './useCheckoutStep3Shipping';
import { quoteCheckoutShipping } from '@/app/services/checkoutShipping.service';

const { shippingRef, patchShipping, handleShippingChange } = vi.hoisted(() => {
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
  const handleShippingChange = vi.fn((field: keyof ShippingData, value: string) => {
    const clearsQuote =
      field === 'tipo' ||
      field === 'direccion' ||
      field === 'calle' ||
      field === 'numero' ||
      field === 'localidad' ||
      field === 'provincia' ||
      field === 'codigo_postal';
    shippingRef.current = {
      ...shippingRef.current,
      [field]: value,
      ...(clearsQuote ? { checkoutEnvio: undefined } : {}),
    };
  });
  return { shippingRef, patchShipping, handleShippingChange };
});

vi.mock('@/app/hooks/useCheckoutShippingForm', () => ({
  useCheckoutShippingForm: () => ({
    get shipping() {
      return shippingRef.current;
    },
    errors: {},
    touched: {},
    handleShippingChange,
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
    items: [
      {
        product: { id: 1, productoWebId: 1, nombre: 'Test', descripcion: '', categoria: '', precio: 50, precioLista: 50, imagen: '' },
        quantity: 2,
        subtotal: 100,
      },
    ],
    subtotal: 100,
    totalLista: 121,
    totalTransfer: 85,
    total: 121,
  }),
}));

const isWholesaleLimitReachedRef = { current: false };

vi.mock('@/app/contexts/SalesContext', () => ({
  useSales: () => ({ isWholesaleLimitReached: isWholesaleLimitReachedRef.current }),
}));

vi.mock('@/app/services/checkoutShipping.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/services/checkoutShipping.service')>();
  return {
    ...actual,
    quoteCheckoutShipping: vi.fn(),
    fetchCheckoutShippingAgencies: vi.fn().mockResolvedValue([]),
  };
});

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
    vi.mocked(quoteCheckoutShipping).mockResolvedValue({
      precio: 2500,
      moneda: 'ARS',
      provider: 'correo',
      parcel: {
        weightGrams: 612,
        height: 8,
        width: 50,
        depth: 80,
        declaredValue: 100,
      },
    });
  });

  it('canCalculateShipping true con direcciÃ³n completa', () => {
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

  it('calculateShipping cotiza opciones validas y aplica la mas barata', async () => {
    vi.mocked(quoteCheckoutShipping)
      .mockResolvedValueOnce({
        precio: 5000,
        moneda: 'ARS',
        provider: 'andreani',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
      })
      .mockResolvedValueOnce({
        precio: 1200,
        moneda: 'ARS',
        provider: 'correo',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
        correoOpciones: [{ price: 1200, serviceCode: 'STD' }],
      })
      .mockResolvedValueOnce({
        precio: 4000,
        moneda: 'ARS',
        provider: 'correo',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
      });

    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));

    await act(async () => {
      result.current.calculateShipping();
    });

    await waitFor(() => expect(result.current.quoteLoading).toBe(false));

    expect(quoteCheckoutShipping).toHaveBeenCalledTimes(3);
    expect(quoteCheckoutShipping).toHaveBeenCalledWith(
      expect.objectContaining({ declaredValueSubtotal: 121 })
    );
    expect(quoteCheckoutShipping).not.toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'andreani',
        deliveryType: 'agency',
      })
    );
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

  it('cambiar CP invalida cotización y no permite reactivar precio con tarjeta vieja', async () => {
    vi.mocked(quoteCheckoutShipping)
      .mockResolvedValueOnce({
        precio: 5000,
        moneda: 'ARS',
        provider: 'andreani',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
      })
      .mockResolvedValueOnce({
        precio: 1200,
        moneda: 'ARS',
        provider: 'correo',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
        correoOpciones: [{ price: 1200, serviceCode: 'STD' }],
      })
      .mockResolvedValueOnce({
        precio: 4000,
        moneda: 'ARS',
        provider: 'correo',
        parcel: { weightGrams: 612, height: 8, width: 50, depth: 80, declaredValue: 100 },
      });

    const { result } = renderHook(() => useCheckoutStep3Shipping({ onNext }));

    await act(async () => {
      result.current.calculateShipping();
    });
    await waitFor(() => expect(result.current.quoteLoading).toBe(false));

    expect(shippingRef.current.checkoutEnvio?.clientQuotedAmount).toBe(1200);
    expect(Object.keys(result.current.quoteByOption).length).toBeGreaterThan(0);

    act(() => {
      result.current.handleShippingChange('codigo_postal', '5000');
    });

    expect(result.current.quoteByOption).toEqual({});
    expect(result.current.selectedOptionId).toBeNull();
    expect(result.current.canContinue).toBe(false);
    expect(shippingRef.current.checkoutEnvio).toBeUndefined();

    act(() => {
      result.current.handleOptionCardClick('correo-home');
    });

    expect(shippingRef.current.checkoutEnvio).toBeUndefined();
    expect(result.current.canContinue).toBe(false);
  });
});

