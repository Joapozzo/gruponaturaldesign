import type { PaginationInfo } from '@/components/ui/Table';

export type UsuarioRol = 'admin' | 'vendedor' | 'cliente';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  rol: UsuarioRol;
  activo: boolean;
  emailVerified: boolean;
  empresaId: number | null;
  empresa?: { id: number; nombre: string } | null;
  role?: { id: number; code: string; name: string } | null;
  externalId?: string | null;
  provider?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  rol?: UsuarioRol;
  activo?: boolean;
}

export interface UsuarioListResponse {
  data: Usuario[];
  pagination: PaginationInfo;
}

export interface CrearUsuarioInput {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  rol: UsuarioRol;
  empresaId?: number;
}

export interface ActualizarUsuarioInput {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  rol?: UsuarioRol;
  empresaId?: number | null;
  activo?: boolean;
}

export interface Empresa {
  id: number;
  nombre: string;
}