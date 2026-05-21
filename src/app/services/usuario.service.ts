'use client';

import {
  Usuario,
  UsuarioQueryParams,
  UsuarioListResponse,
  CrearUsuarioInput,
  ActualizarUsuarioInput,
  Empresa,
} from '@/app/types/usuario.types';
import type { ApiResponse } from '@/lib/types/api.types';
import { tryHandleMaintenanceResponse } from '@/lib/api-maintenance';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getFirebaseToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    const fn = (window as unknown as { __getFirebaseToken?: () => Promise<string | null> }).__getFirebaseToken;
    if (fn) return fn();
  }
  return null;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getFirebaseToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: 'include',
  });

  const body = await response.json().catch(() => ({}));
  if (tryHandleMaintenanceResponse(response.status, body)) {
    throw new Error('Servicio en mantenimiento');
  }
  if (!response.ok) {
    const error = body as { message?: string };
    throw new Error(error.message || `Error ${response.status}`);
  }

  return body as T;

}

async function fetchApiData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const json = await fetchApi<ApiResponse<T>>(endpoint, options);
  if (!json.success) {
    throw new Error(json.message || json.error || 'Error en la solicitud');
  }
  if (json.data === undefined) {
    throw new Error(json.message || 'Sin datos en la respuesta');
  }
  return json.data;
}

async function fetchApiSuccessOnly(endpoint: string, options?: RequestInit): Promise<void> {
  const json = await fetchApi<ApiResponse>(endpoint, options);
  if (!json.success) {
    throw new Error(json.message || json.error || 'Error en la solicitud');
  }
}

export const usuarioService = {
  async listar(params?: UsuarioQueryParams): Promise<UsuarioListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.q) searchParams.set('q', params.q);
    if (params?.rol) searchParams.set('rol', params.rol);
    if (params?.activo !== undefined) searchParams.set('activo', String(params.activo));
    
    const query = searchParams.toString();
    return fetchApiData<UsuarioListResponse>(`/admin/usuarios${query ? `?${query}` : ''}`);
  },

  async detalle(id: number): Promise<Usuario> {
    return fetchApiData<Usuario>(`/admin/usuarios/${id}`);
  },

  async crear(data: CrearUsuarioInput): Promise<Usuario> {
    return fetchApiData<Usuario>('/admin/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async actualizar(id: number, data: ActualizarUsuarioInput): Promise<Usuario> {
    return fetchApiData<Usuario>(`/admin/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async desactivar(id: number): Promise<void> {
    await fetchApiData<unknown>(`/admin/usuarios/${id}/desactivar`, {
      method: 'POST',
    });
  },

  async habilitar(id: number): Promise<void> {
    await fetchApiData<unknown>(`/admin/usuarios/${id}/habilitar`, {
      method: 'POST',
    });
  },

  async eliminar(id: number): Promise<void> {
    await fetchApiSuccessOnly(`/admin/usuarios/${id}`, {
      method: 'DELETE',
    });
  },

  async listarEmpresas(): Promise<Empresa[]> {
    const rows = await fetchApiData<Empresa[]>('/admin/usuarios/empresas');
    return Array.isArray(rows) ? rows : [];
  },
};