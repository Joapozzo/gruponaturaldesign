'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SyncContextType {
  isSyncing: boolean;
  setIsSyncing: (value: boolean) => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSetIsSyncing = useCallback((value: boolean) => {
    setIsSyncing(value);
  }, []);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        setIsSyncing: handleSetIsSyncing,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

