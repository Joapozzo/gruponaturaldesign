'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/app/components/hooks/useCart';
import type { CustomerData } from '@/app/types/cart';

/**
 * Sincroniza los datos del usuario autenticado (sessionState) al carrito (customerData).
 * Solo rellena nombre, apellido, email si existen en sesión; no pisa datos ya completados por el usuario.
 * Responsabilidad única: mantener el store del carrito alineado con el perfil del usuario logueado.
 */
export function useSyncAuthToCart(): void {
  const { sessionState } = useAuth();
  const { customerData, setCustomerData } = useCart();
  const lastSyncedUid = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionState?.uid) return;
    if (lastSyncedUid.current === sessionState.uid) return;

    const nombre = sessionState.nombre?.trim();
    const apellido = sessionState.apellido?.trim();
    const email = sessionState.email?.trim();
    if (!email) return;

    lastSyncedUid.current = sessionState.uid;

    const merged: CustomerData = {
      nombre: nombre || customerData?.nombre || '',
      apellido: apellido ?? customerData?.apellido ?? '',
      email: email || customerData?.email || '',
      telefono: customerData?.telefono ?? '',
      empresa: customerData?.empresa,
      cuit: customerData?.cuit,
      fecha_nacimiento: customerData?.fecha_nacimiento,
      documento: customerData?.documento,
      tipo_documento: customerData?.tipo_documento ?? 'DNI',
    };

    setCustomerData(merged);
  }, [sessionState?.uid, sessionState?.nombre, sessionState?.apellido, sessionState?.email, setCustomerData]);
}
