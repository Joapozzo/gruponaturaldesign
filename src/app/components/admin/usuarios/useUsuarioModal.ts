'use client';

import { create } from 'zustand';
import type { Usuario } from '@/app/types/usuario.types';

interface UsuarioModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  usuario: Usuario | null;
  openCreate: () => void;
  openEdit: (usuario: Usuario) => void;
  close: () => void;
}

export const useUsuarioModal = create<UsuarioModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  usuario: null,
  openCreate: () => set({ isOpen: true, mode: 'create', usuario: null }),
  openEdit: (usuario) => set({ isOpen: true, mode: 'edit', usuario }),
  close: () => set({ isOpen: false, usuario: null }),
}));