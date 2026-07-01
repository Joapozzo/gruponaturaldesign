'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { useTiendaConfigAdmin } from '@/app/hooks/useTiendaConfigAdmin';
import { useTiendaConfigQuery } from '@/app/hooks/useTiendaConfigQuery';
import { configuracionKeys } from '@/app/hooks/configuracionQueryKeys';
import {
  updateTiendaConfig,
  type TiendaConfigInput,
} from '@/app/services/tiendaConfig.service';
import { DatosBancariosTabSkeleton } from '@/app/components/admin/configuracion/skeletons';

function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  maxLength?: number;
  hint?: string;
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
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-60"
      />
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
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
            Guardar tienda y contacto
          </>
        )}
      </Button>
    </div>
  );
}

function TiendaContactoFormFields({
  form,
  update,
  disabled,
  hasChanges,
  onSave,
  saving,
}: {
  form: TiendaConfigInput;
  update: (field: keyof TiendaConfigInput, value: string) => void;
  disabled: boolean;
  hasChanges: boolean;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Emails y WhatsApp</h3>
        <Field
          id="emailPedidosInterno"
          label="Email pedidos interno"
          value={form.emailPedidosInterno ?? ''}
          onChange={(v) => update('emailPedidosInterno', v)}
          disabled={disabled}
          placeholder="ventas@empresa.com"
          maxLength={255}
          hint="Mail interno único: pedidos, consultas de contacto y comprobantes. Si está vacío, se usa RESEND_INTERNAL_TO del servidor."
        />
        <Field
          id="whatsappTelefono"
          label="WhatsApp (teléfono)"
          value={form.whatsappTelefono ?? ''}
          onChange={(v) => update('whatsappTelefono', v)}
          disabled={disabled}
          placeholder="+54 9 ..."
          maxLength={30}
        />
        <TextAreaField
          id="whatsappMensajeDefault"
          label="Mensaje WhatsApp por defecto"
          value={form.whatsappMensajeDefault ?? ''}
          onChange={(v) => update('whatsappMensajeDefault', v)}
          disabled={disabled}
          placeholder="¡Hola! Me gustaría recibir atención personalizada."
          maxLength={500}
        />
        <TextAreaField
          id="pagoManualInstruccionesExtra"
          label="Instrucciones extra pago manual"
          value={form.pagoManualInstruccionesExtra ?? ''}
          onChange={(v) => update('pagoManualInstruccionesExtra', v)}
          disabled={disabled}
          placeholder="Texto adicional en checkout y emails de transferencia/efectivo."
          maxLength={500}
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900">Retiro en tienda</h3>
        <Field
          id="retiroDireccion"
          label="Dirección de retiro"
          value={form.retiroDireccion ?? ''}
          onChange={(v) => update('retiroDireccion', v)}
          disabled={disabled}
          placeholder="Alta Córdoba, Córdoba Capital"
          maxLength={255}
        />
        <Field
          id="retiroHorarios"
          label="Horarios"
          value={form.retiroHorarios ?? ''}
          onChange={(v) => update('retiroHorarios', v)}
          disabled={disabled}
          placeholder="Lun a Vie 9 a 18 hs"
          maxLength={255}
        />
        <Field
          id="retiroDemora"
          label="Demora estimada"
          value={form.retiroDemora ?? ''}
          onChange={(v) => update('retiroDemora', v)}
          disabled={disabled}
          placeholder="48 a 72 hs para retirar"
          maxLength={255}
        />
        <TextAreaField
          id="retiroNotas"
          label="Notas de retiro"
          value={form.retiroNotas ?? ''}
          onChange={(v) => update('retiroNotas', v)}
          disabled={disabled}
          placeholder="Esperá confirmación por mail"
          maxLength={500}
        />
        <SaveRow saving={saving} disabled={disabled} hasChanges={hasChanges} onSave={onSave} />
      </div>
    </div>
  );
}

export function TiendaContactoTab() {
  const queryClient = useQueryClient();
  const { data: config, isPending, isFetching } = useTiendaConfigQuery();
  const showSkeleton = isPending && config === undefined;
  const isReady = !showSkeleton;

  const mutation = useMutation({
    mutationFn: updateTiendaConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(configuracionKeys.tiendaConfig, data);
      toast.success('Configuración de tienda guardada');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'No se pudo guardar');
    },
  });

  const { form, update, hasChanges, handleSave } = useTiendaConfigAdmin(config, mutation, {
    isReady,
  });

  if (showSkeleton) {
    return <DatosBancariosTabSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <span>Tienda y contacto</span>
        {isFetching && !isPending ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-label="Actualizando" />
        ) : null}
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-sm text-gray-600">
          WhatsApp, retiro en tienda, email interno de pedidos y texto de comprobante en checkout.
        </p>
        <TiendaContactoFormFields
          form={form}
          update={update}
          disabled={isFetching || mutation.isPending}
          hasChanges={hasChanges}
          onSave={handleSave}
          saving={mutation.isPending}
        />
      </CardBody>
    </Card>
  );
}
