'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { useCuponAdminDetail } from '@/app/hooks/useCuponAdminDetail';
import { useCuponAdminMutations } from '@/app/hooks/useCuponAdminMutations';
import toast from 'react-hot-toast';
import { Loader2, Save, Info } from 'lucide-react';
import type { CuponCreatePayload } from '@/app/types/cupones';
import { dateOnlyFromIso, todayDateOnlyAR } from '@/app/utils/dateOnly';

interface CuponFormProps {
  cuponId?: number;
  /** Si se provee, se llama al guardar/cancelar (modo modal). Si no, se navega a `/admin/cupones`. */
  onClose?: () => void;
}

function InfoIcon({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1 cursor-help">
      <Info className="w-3.5 h-3.5 text-gray-400" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

export function CuponForm({ cuponId, onClose }: CuponFormProps) {
  const router = useRouter();
  const isEditing = !!cuponId && cuponId > 0;
  const { data: existingCupon, isLoading } = useCuponAdminDetail(cuponId || 0);
  const { create, update } = useCuponAdminMutations();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push('/admin/cupones');
    }
  }, [onClose, router]);

  const [form, setForm] = useState<CuponCreatePayload>({
    codigo: '',
    nombre: '',
    tipoDescuento: 'porcentaje',
    valorDescuento: 0,
    alcance: 'carrito_completo',
    estado: 'activo',
    fechaInicio: todayDateOnlyAR(),
  });

  useEffect(() => {
    if (existingCupon && isEditing) {
      setForm({
        codigo: existingCupon.codigo,
        nombre: existingCupon.nombre,
        descripcion: existingCupon.descripcion || undefined,
        tipoDescuento: existingCupon.tipoDescuento,
        valorDescuento: existingCupon.valorDescuento,
        alcance: existingCupon.alcance,
        estado: existingCupon.estado,
        montoMinimo: existingCupon.montoMinimo || undefined,
        montoMaximoDescuento: existingCupon.montoMaximoDescuento || undefined,
        usoMaximo: existingCupon.usoMaximo || undefined,
        usoMaximoUsuario: existingCupon.usoMaximoUsuario || undefined,
        fechaInicio: dateOnlyFromIso(existingCupon.fechaInicio) ?? todayDateOnlyAR(),
        fechaFin: dateOnlyFromIso(existingCupon.fechaFin),
        esExclusivoWeb: existingCupon.esExclusivoWeb,
        aplicaIVA: existingCupon.aplicaIVA,
        requiereCodigo: existingCupon.requiereCodigo,
      });
    }
  }, [existingCupon, isEditing]);

  const handleChange = (
    field: keyof CuponCreatePayload,
    value: string | number | boolean | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await update.mutateAsync({ id: cuponId!, data: form });
        toast.success('Cupón actualizado');
      } else {
        await create.mutateAsync(form);
        toast.success('Cupón creado');
      }
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              value={form.codigo}
              onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
              placeholder="DESCUENTO20"
              disabled={isEditing}
            />
          </div>
          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="20% de descuento"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Input
            id="descripcion"
            value={form.descripcion || ''}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción opcional del cupón"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-sm mb-3">Descuento</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo">Tipo de descuento</Label>
            <select
              id="tipo"
              value={form.tipoDescuento}
              onChange={(e) => handleChange('tipoDescuento', e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto_fijo">Monto fijo ($)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="valor">Valor del descuento *</Label>
            <Input
              id="valor"
              type="number"
              value={form.valorDescuento}
              onChange={(e) => handleChange('valorDescuento', parseFloat(e.target.value) || 0)}
              min={0}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="alcance">Alcance</Label>
            <InfoIcon text="Define a qué productos del carrito aplica el cupón. 'Carrito completo' aplica a todos." />
          </div>
          <select
            id="alcance"
            value={form.alcance}
            onChange={(e) => handleChange('alcance', e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="carrito_completo">Carrito completo</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-sm mb-3">Límites y vigencia</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="montoMinimo">Monto mínimo del carrito</Label>
            <Input
              id="montoMinimo"
              type="number"
              value={form.montoMinimo || ''}
              onChange={(e) => handleChange('montoMinimo', parseFloat(e.target.value) || undefined)}
              placeholder="Sin mínimo"
            />
          </div>
          <div>
            <Label htmlFor="montoMaximo">Tope máximo de descuento</Label>
            <Input
              id="montoMaximo"
              type="number"
              value={form.montoMaximoDescuento || ''}
              onChange={(e) => handleChange('montoMaximoDescuento', parseFloat(e.target.value) || undefined)}
              placeholder="Sin tope"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="usoMaximo">Usos máximos total</Label>
            <Input
              id="usoMaximo"
              type="number"
              value={form.usoMaximo || ''}
              onChange={(e) => handleChange('usoMaximo', parseInt(e.target.value) || undefined)}
              placeholder="Ilimitado"
            />
          </div>
          <div>
            <Label htmlFor="usoMaximoUsuario">Usos máximo por usuario</Label>
            <Input
              id="usoMaximoUsuario"
              type="number"
              value={form.usoMaximoUsuario || ''}
              onChange={(e) => handleChange('usoMaximoUsuario', parseInt(e.target.value) || undefined)}
              placeholder="Ilimitado"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="fechaInicio">Fecha de inicio *</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={form.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fechaFin">Fecha de fin</Label>
            <Input
              id="fechaFin"
              type="date"
              value={form.fechaFin || ''}
              onChange={(e) => handleChange('fechaFin', e.target.value || undefined)}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-sm mb-3">Opciones</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.estado === 'activo'}
              onChange={(e) => handleChange('estado', e.target.checked ? 'activo' : 'pausado')}
              className="w-4 h-4"
            />
            <span>Activo al crear</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.esExclusivoWeb ?? false}
              onChange={(e) => handleChange('esExclusivoWeb', e.target.checked)}
              className="w-4 h-4"
            />
            <span>Exclusivo para web</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.aplicaIVA ?? true}
              onChange={(e) => handleChange('aplicaIVA', e.target.checked)}
              className="w-4 h-4"
            />
            <span>Aplicar IVA al descuento</span>
            <InfoIcon text="Si está activado, el % se calcula sobre el precio final (con IVA). Si está desactivado, se descuenta el IVA primero." />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.requiereCodigo ?? true}
              onChange={(e) => handleChange('requiereCodigo', e.target.checked)}
              className="w-4 h-4"
            />
            <span>Requiere código manual</span>
            <InfoIcon text="Si está activado, el cliente debe escribir el código del cupón en el checkout. Si está desactivado, se aplica automáticamente." />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="grayOutline" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={create.isPending || update.isPending}>
          {(create.isPending || update.isPending) ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isEditing ? 'Actualizar' : 'Crear Cupón'}
        </Button>
      </div>
    </div>
  );
}