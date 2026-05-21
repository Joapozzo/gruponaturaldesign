import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClearCheckoutOnAuthChange } from './useClearCheckoutOnAuthChange';
import { clearCheckoutSession } from '@/app/stores/cartStore';

vi.mock('@/app/stores/cartStore', () => ({
  clearCheckoutSession: vi.fn(),
}));

type AuthCallback = (user: { uid: string } | null) => void;

const { onAuthStateChangedMock, emitAuth } = vi.hoisted(() => {
  let callback: AuthCallback | null = null;
  const onAuthStateChangedMock = vi.fn((cb: AuthCallback) => {
    callback = cb;
    return vi.fn();
  });
  const emitAuth = (user: { uid: string } | null) => {
    callback?.(user);
  };
  return { onAuthStateChangedMock, emitAuth };
});

vi.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: onAuthStateChangedMock,
  },
}));

describe('useClearCheckoutOnAuthChange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no limpia en la primera emisión de auth', () => {
    renderHook(() => useClearCheckoutOnAuthChange());
    emitAuth({ uid: 'user-a' });
    expect(clearCheckoutSession).not.toHaveBeenCalled();
  });

  it('limpia al cambiar de usuario', () => {
    renderHook(() => useClearCheckoutOnAuthChange());
    emitAuth({ uid: 'user-a' });
    emitAuth({ uid: 'user-b' });
    expect(clearCheckoutSession).toHaveBeenCalledTimes(1);
  });

  it('limpia al cerrar sesión', () => {
    renderHook(() => useClearCheckoutOnAuthChange());
    emitAuth({ uid: 'user-a' });
    emitAuth(null);
    expect(clearCheckoutSession).toHaveBeenCalledTimes(1);
  });

  it('desuscribe onAuthStateChanged al desmontar', () => {
    const unsub = vi.fn();
    onAuthStateChangedMock.mockReturnValueOnce(unsub);
    const { unmount } = renderHook(() => useClearCheckoutOnAuthChange());
    unmount();
    expect(unsub).toHaveBeenCalled();
  });
});
