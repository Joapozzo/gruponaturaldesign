import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCheckoutSessionLifecycle } from './useCheckoutSessionLifecycle';
import { clearCheckoutSession } from '@/app/stores/cartStore';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/app/stores/cartStore', () => ({
  clearCheckoutSession: vi.fn(),
}));

import { usePathname } from 'next/navigation';

describe('useCheckoutSessionLifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('limpia checkout al salir del funnel', () => {
    vi.mocked(usePathname).mockReturnValue('/checkout/datos');
    const { rerender } = renderHook(() => useCheckoutSessionLifecycle());

    vi.mocked(usePathname).mockReturnValue('/shoponline');
    rerender();

    expect(clearCheckoutSession).toHaveBeenCalled();
  });

  it('no limpia al navegar entre pasos del checkout', () => {
    vi.mocked(usePathname).mockReturnValue('/checkout/datos');
    const { rerender } = renderHook(() => useCheckoutSessionLifecycle());

    vi.mocked(usePathname).mockReturnValue('/checkout/envio');
    rerender();

    expect(clearCheckoutSession).not.toHaveBeenCalled();
  });

  it('limpia al desmontar si estaba en pasos de checkout', () => {
    vi.mocked(usePathname).mockReturnValue('/checkout/pago');
    const { unmount } = renderHook(() => useCheckoutSessionLifecycle());

    unmount();
    expect(clearCheckoutSession).toHaveBeenCalled();
  });
});
