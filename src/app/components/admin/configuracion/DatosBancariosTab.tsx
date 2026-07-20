'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { useDatosBancariosConfig } from '@/app/hooks/useDatosBancariosConfig';
import { useDatosBancariosQuery } from '@/app/hooks/useDatosBancariosQuery';
import { configuracionKeys } from '@/app/hooks/configuracionQueryKeys';
import {
  updateDatosBancarios,
  type DatosBancariosInput,
} from '@/app/services/empresaDatosBancarios.service';
import { DatosBancariosTabSkeleton } from '@/app/components/admin/configuracion/skeletons';

function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        fullWidth
      />
    </div>
  );
}

function DatosBancariosFormFields({
  form,
  update,
  disabled,
  hasChanges,
  onSave,
  saving,
}: {
  form: DatosBancariosInput;
  update: (field: keyof DatosBancariosInput, value: string | boolean) => void;
  disabled: boolean;
  hasChanges: boolean;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Cuenta bancaria</h3>
        <Field
          id="banco"
          label="Banco"
          value={form.banco}
          onChange={(v) => update('banco', v)}
          disabled={disabled}
          placeholder="Ej. Banco Nación"
          maxLength={100}
        />
        <Field
          id="tipoCuenta"
          label="Tipo de cuenta (opcional)"
          value={form.tipoCuenta}
          onChange={(v) => update('tipoCuenta', v)}
          disabled={disabled}
          placeholder="Ej. Cuenta Corriente — vacío si es MP"
          maxLength={50}
        />
        <Field
          id="numeroCuenta"
          label="Número de cuenta (opcional)"
          value={form.numeroCuenta}
          onChange={(v) => update('numeroCuenta', v)}
          disabled={disabled}
          placeholder="Ej. 1234567890 — vacío si es MP"
          maxLength={50}
        />
        <Field
          id="cbu"
          label="CBU"
          value={form.cbu ?? ''}
          onChange={(v) => update('cbu', v)}
          disabled={disabled}
          placeholder="22 dígitos"
          maxLength={22}
        />
        <Field
          id="alias"
          label="Alias"
          value={form.alias ?? ''}
          onChange={(v) => update('alias', v)}
          disabled={disabled}
          placeholder="Ej. MI.ALIAS.CBU"
          maxLength={50}
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900">Titular e instrucciones</h3>
        <Field
          id="titular"
          label="Titular"
          value={form.titular}
          onChange={(v) => update('titular', v)}
          disabled={disabled}
          placeholder="Razón social o nombre"
          maxLength={255}
        />
        <Field
          id="cuit"
          label="CUIT"
          value={form.cuit ?? ''}
          onChange={(v) => update('cuit', v)}
          disabled={disabled}
          placeholder="Ej. 20-12345678-9"
          maxLength={50}
        />
        <div className="grid gap-2">
          <Label htmlFor="instrucciones">Instrucciones</Label>
          <Input
            id="instrucciones"
            type="text"
            value={form.instrucciones ?? ''}
            onChange={(e) => update('instrucciones', e.target.value)}
            placeholder="Ej. Incluir número de pedido en el concepto"
            disabled={disabled}
            maxLength={500}
            fullWidth
          />
        </div>
        <SaveRow saving={saving} disabled={disabled} hasChanges={hasChanges} onSave={onSave} />
      </div>
    </div>
  );
}

function SaveRow({
  saving,
  disabled,
  hasChanges,
  onSave,
}: {
  saving: boolean;
  disabled: boolean;
  hasChanges: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end pt-2 mt-auto">
      <Button onClick={onSave} disabled={saving || disabled || !hasChanges} variant="brandRed">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Guardar datos bancarios
          </>
        )}
      </Button>
    </div>
  );
}

export function DatosBancariosTab() {
  const queryClient = useQueryClient();
  const { data: config, isPending, isFetching } = useDatosBancariosQuery();
  const showSkeleton = isPending && config === undefined;
  const isReady = !showSkeleton;

  const mutation = useMutation({
    mutationFn: updateDatosBancarios,
    onSuccess: () => {
      toast.success('Datos bancarios guardados');
      queryClient.invalidateQueries({ queryKey: configuracionKeys.datosBancarios });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    },
  });

  const { form, update, hasChanges, handleSave } = useDatosBancariosConfig(config, mutation, {
    isReady,
  });
  const disabled = mutation.isPending;

  if (showSkeleton) {
    return <DatosBancariosTabSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <span>Datos para transferencia / efectivo</span>
        {isFetching && !isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-label="Actualizando" />
        ) : null}
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-sm text-gray-600">
          Se muestran al cliente al elegir transferencia o efectivo en el checkout y se envían por
          email junto con el pedido.
        </p>

        <DatosBancariosFormFields
          form={form}
          update={update}
          disabled={disabled}
          hasChanges={hasChanges}
          onSave={handleSave}
          saving={mutation.isPending}
        />
      </CardBody>
    </Card>
  );
}
