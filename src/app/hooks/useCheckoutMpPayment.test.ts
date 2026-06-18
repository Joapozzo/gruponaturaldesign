import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCheckoutMpPayment } from './useCheckoutMpPayment';
import { iniciarPagoMp, saveCheckoutMpSnapshot } from '@/app/services/checkoutMp.service';

vi.mock('@/app/services/checkoutMp.service', () => ({
  iniciarPagoMp: vi.fn(),
  saveCheckoutMpSnapshot: vi.fn(),
}));

const mpBody = {
  clienteNombre: 'Juan',
  clienteEmail: 'test@gmail.com',
  mpPricingMode: 'financiado' as const,
  items: [{ productoWebId: 1, cantidad: 1, precioUnitario: 100 }],
};

describe('useCheckoutMpPayment', () => {
  const assignHref = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    assignHref.mockClear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign: assignHref, href: 'http://localhost/' },
    });
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      set: assignHref,
      get: () => 'http://localhost/',
    });
    vi.mocked(iniciarPagoMp).mockResolvedValue({
      pedidoId: 42,
      checkoutUrl: 'https://mp.test/checkout',
      preferenceId: 'pref-1',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia pago, guarda snapshot y redirige', async () => {
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({
        body: mpBody,
        snapshot: { totalLabel: '$ 121', itemCount: 1, clienteEmail: 'test@gmail.com' },
        cuponCodigo: 'DESC10',
      });
    });

    expect(iniciarPagoMp).toHaveBeenCalledWith(
      expect.objectContaining({ cuponCodigo: 'DESC10', clienteEmail: 'test@gmail.com' })
    );
    expect(saveCheckoutMpSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({ pedidoId: 42, totalLabel: '$ 121', itemCount: 1 })
    );
    expect(assignHref).toHaveBeenCalledWith('https://mp.test/checkout');
    expect(result.current.loading).toBe(true);
    expect(result.current.phase).toBe('redirecting');
  });

  it('setea error y deja de cargar si falla iniciarPagoMp', async () => {
    vi.mocked(iniciarPagoMp).mockRejectedValue(new Error('MP caído'));
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({ body: mpBody });
    });

    expect(result.current.error).toBe('MP caído');
    expect(result.current.loading).toBe(false);
    expect(result.current.phase).toBe('idle');
    expect(saveCheckoutMpSnapshot).not.toHaveBeenCalled();
  });

  it('rechaza checkoutUrl inválida', async () => {
    vi.mocked(iniciarPagoMp).mockResolvedValue({
      pedidoId: 42,
      checkoutUrl: 'http://inseguro.test/checkout',
      preferenceId: 'pref-1',
    });
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({ body: mpBody });
    });

    expect(result.current.error).toContain('enlace válido');
    expect(result.current.loading).toBe(false);
    expect(assignHref).not.toHaveBeenCalled();
  });

  it('libera loading y expone fallback si la redirección no ocurre', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({ body: mpBody });
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.phase).toBe('redirecting');

    await act(async () => {
      vi.advanceTimersByTime(10_000);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.phase).toBe('idle');
    expect(result.current.error).toContain('automáticamente');
    expect(result.current.fallbackCheckoutUrl).toBe('https://mp.test/checkout');
  });

  it('cancelPayment detiene el estado de carga', async () => {
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({ body: mpBody });
    });

    act(() => {
      result.current.cancelPayment();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.phase).toBe('idle');
  });

  it('clearError limpia el mensaje y el fallback', async () => {
    vi.useFakeTimers();
    vi.mocked(iniciarPagoMp).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useCheckoutMpPayment());

    await act(async () => {
      await result.current.startPayment({ body: mpBody });
    });
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
    expect(result.current.fallbackCheckoutUrl).toBeNull();
  });
});
