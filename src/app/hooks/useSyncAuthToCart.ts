'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/app/components/hooks/useCart';
import { useCartStore } from '@/app/stores/cartStore';
import type { CustomerData } from '@/app/types/cart';

function sameCustomerData(a: CustomerData | null, b: CustomerData): boolean {
  if (!a) return false;
  return (
    a.nombre === b.nombre &&
    a.apellido === b.apellido &&
    a.email === b.email &&
    (a.telefono ?? '') === (b.telefono ?? '') &&
    (a.empresa ?? '') === (b.empresa ?? '') &&
    (a.cuit ?? '') === (b.cuit ?? '') &&
    (a.fecha_nacimiento ?? '') === (b.fecha_nacimiento ?? '') &&
    (a.documento ?? '') === (b.documento ?? '') &&
    (a.tipo_documento ?? 'DNI') === (b.tipo_documento ?? 'DNI')
  );
}

/**
 * Sincroniza los datos del usuario autenticado (sessionState) al carrito (customerData).
 * Rellena nombre, apellido, email y fecha de nacimiento desde sesión sin pisar lo que el usuario ya completó en el carrito.
 * Se vuelve a fusionar cuando la sesión recibe datos tarde (p. ej. nombre/apellido después del email).
 */
export function useSyncAuthToCart(): void {
  const { sessionState } = useAuth();
  const { setCustomerData } = useCart();
  const lastSyncedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionState?.uid) {
      lastSyncedUid.current = null;
      return;
    }

    const nombre = sessionState.nombre?.trim();
    const apellido = sessionState.apellido?.trim();
    const email = sessionState.email?.trim();
    if (!email) return;

    lastSyncedUid.current = sessionState.uid;

    const fromCart = useCartStore.getState().customerData;
    const fechaFromSession = sessionState.fechaNacimiento?.trim() || '';
    const cartFecha = fromCart?.fecha_nacimiento?.trim() || '';

    const merged: CustomerData = {
      nombre: nombre || fromCart?.nombre || '',
      apellido: apellido || fromCart?.apellido || '',
      email: email || fromCart?.email || '',
      telefono: fromCart?.telefono ?? '',
      empresa: fromCart?.empresa,
      cuit: fromCart?.cuit,
      fecha_nacimiento: cartFecha || fechaFromSession || '',
      documento: fromCart?.documento,
      tipo_documento: fromCart?.tipo_documento ?? 'DNI',
    };

    if (sameCustomerData(fromCart, merged)) return;

    setCustomerData(merged);
  }, [sessionState?.uid, sessionState?.nombre, sessionState?.apellido, sessionState?.email, sessionState?.fechaNacimiento, setCustomerData]);

  /** Si la fecha llega después (p. ej. completó onboarding), rellenar solo si el carrito sigue sin fecha */
  useEffect(() => {
    if (!sessionState?.uid) return;
    if (lastSyncedUid.current !== sessionState.uid) return;

    const sf = sessionState.fechaNacimiento?.trim();
    if (!sf) return;

    const current = useCartStore.getState().customerData;
    if (!current || current.fecha_nacimiento?.trim()) return;

    setCustomerData({ ...current, fecha_nacimiento: sf });
  }, [sessionState?.uid, sessionState?.fechaNacimiento, setCustomerData]);
}
