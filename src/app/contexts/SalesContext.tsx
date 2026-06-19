'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '../components/hooks/useCart';
import { SALES_CONFIG, type SalesMode } from '../config/sales.config';

interface SalesContextValue {
  // Estado del modo
  mode: SalesMode;
  isWholesaleMode: boolean;
  isRetailMode: boolean;
  
  // Estado del carrito relacionado
  isWholesaleCart: boolean; // Carrito actual es mayorista
  isWholesaleLimitReached: boolean; // Límite alcanzado
  isNearWholesaleLimit: boolean; // Cerca del límite
  
  // Estado de bordado
  canActivateBordado: boolean; // Se puede activar bordado
  itemsNeededForBordado: number; // Items faltantes para activar bordado
  
  // Configuración
  config: typeof SALES_CONFIG;
  
  // Helpers
  switchToWholesale: () => void;
  switchToRetail: () => void;
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined);

interface SalesProviderProps {
  children: ReactNode;
}

export function SalesProvider({ children }: SalesProviderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mode, setMode] = useState<SalesMode>('retail');

  // Detectar modo basado en la ruta
  useEffect(() => {
    if (pathname === SALES_CONFIG.WHOLESALE_ROUTE) {
      setMode('wholesale');
    } else {
      setMode('retail');
    }
  }, [pathname]);

  // Calcular estados del carrito
  const isWholesaleCart = itemCount >= SALES_CONFIG.WHOLESALE_MIN_ITEMS;
  const isWholesaleLimitReached = itemCount >= SALES_CONFIG.WHOLESALE_MIN_ITEMS;
  const isNearWholesaleLimit = 
    itemCount >= SALES_CONFIG.WHOLESALE_WARNING_THRESHOLD && 
    itemCount < SALES_CONFIG.WHOLESALE_MIN_ITEMS;

  // Calcular estados de bordado
  const canActivateBordado = itemCount >= SALES_CONFIG.BORDADO_MIN_ITEMS;
  const itemsNeededForBordado = Math.max(0, SALES_CONFIG.BORDADO_MIN_ITEMS - itemCount);

  const value: SalesContextValue = {
    mode,
    isWholesaleMode: mode === 'wholesale',
    isRetailMode: mode === 'retail',
    isWholesaleCart,
    isWholesaleLimitReached,
    isNearWholesaleLimit,
    canActivateBordado,
    itemsNeededForBordado,
    config: SALES_CONFIG,
    switchToWholesale: () => setMode('wholesale'),
    switchToRetail: () => setMode('retail'),
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}

