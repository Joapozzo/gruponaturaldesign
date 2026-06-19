'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import BaseModal from '@/app/components/modal/BaseModal';
import { usuarioService } from '@/app/services/usuario.service';
import { useUsuarioModal } from './useUsuarioModal';
import type {
  CrearUsuarioInput,
  ActualizarUsuarioInput,
  Usuario,
  UsuarioRol,
} from '@/app/types/usuario.types';

type UsuarioFormData = Omit<CrearUsuarioInput, 'empresaId'>;

const inputClassName =
  'w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none disabled:bg-neutral-100 disabled:text-neutral-600';

/** Enum Prisma (`rol`) + tabla `role` (`code`) → valor del `<select>`. */
function normalizeUsuarioRol(usuario: Usuario): UsuarioRol {
  const raw = typeof usuario.rol === 'string' ? usuario.rol.toLowerCase().trim() : '';
  if (raw === 'admin' || raw === 'vendedor' || raw === 'cliente') {
    return raw;
  }
  const code = usuario.role?.code?.toUpperCase() ?? '';
  if (code === 'ADMIN') return 'admin';
  if (code === 'VENDEDOR') return 'vendedor';
  if (code === 'USER' || code === 'CLIENTE') return 'cliente';
  return 'cliente';
}

export function UsuarioModal() {
  const { isOpen, mode, usuario, close } = useUsuarioModal();
  const [formData, setFormData] = useState<UsuarioFormData>({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rol: 'cliente',
  });

  const createMutation = useMutation({
    mutationFn: (data: CrearUsuarioInput) => usuarioService.crear(data),
    onSuccess: () => {
      toast.success('Usuario creado correctamente');
      close();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarUsuarioInput }) =>
      usuarioService.actualizar(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      close();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar');
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && usuario) {
      setFormData({
        email: usuario.email ?? '',
        password: '',
        nombre: usuario.nombre ?? '',
        apellido: usuario.apellido ?? '',
        telefono: usuario.telefono ?? '',
        rol: normalizeUsuarioRol(usuario),
      });
      return;
    }
    if (mode === 'create') {
      setFormData({
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        telefono: '',
        rol: 'cliente',
      });
    }
  }, [isOpen, mode, usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      createMutation.mutate(formData);
    } else if (usuario) {
      const data: ActualizarUsuarioInput = {
        nombre: formData.nombre,
        apellido: formData.apellido || undefined,
        telefono: formData.telefono || undefined,
        rol: formData.rol,
      };
      updateMutation.mutate({ id: usuario.id, data });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={close}
      title={mode === 'create' ? 'Crear usuario' : 'Editar usuario'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-neutral-900">
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={mode === 'edit'}
            className={inputClassName}
          />
        </div>

        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-800">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className={inputClassName}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-800">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-800">Apellido</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Teléfono</label>
          <input
            type="text"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800">Rol</label>
          <select
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value as UsuarioRol })}
            className={inputClassName}
          >
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}