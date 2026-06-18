'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Loader2, Link2, Save, UserPlus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { useEnvioConfigQuery } from '@/app/hooks/useEnvioConfigQuery';
import { configuracionKeys } from '@/app/hooks/configuracionQueryKeys';
import {
  CORREO_PROVINCE_OPTIONS,
  envioConfigToForm,
  envioStatusLabel,
  envioStatusVariant,
  registerMicorreoAccount,
  syncMicorreoAccount,
  updateEnvioConfig,
  type EnvioConfigInput,
} from '@/app/services/envioConfig.service';

export function EnvioTab() {
  const queryClient = useQueryClient();
  const { data: config, isPending, isFetching } = useEnvioConfigQuery();
  const [form, setForm] = useState(() => envioConfigToForm(null));

  useEffect(() => {
    if (config) setForm(envioConfigToForm(config));
  }, [config]);

  const savedForm = useMemo(() => envioConfigToForm(config ?? null), [config]);
  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm]
  );

  const saveMutation = useMutation({
    mutationFn: (input: EnvioConfigInput) => updateEnvioConfig(input),
    onSuccess: () => {
      toast.success('Configuración de envíos guardada');
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.envio });
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.integraciones });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al guardar'),
  });

  const syncMutation = useMutation({
    mutationFn: () =>
      syncMicorreoAccount(form.correoAccountPassword?.trim() || undefined),
    onSuccess: () => {
      toast.success('Cuenta MiCorreo vinculada');
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.envio });
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.integraciones });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al vincular'),
  });

  const registerMutation = useMutation({
    mutationFn: registerMicorreoAccount,
    onSuccess: () => {
      toast.success('Cuenta MiCorreo registrada');
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.envio });
      void queryClient.invalidateQueries({ queryKey: configuracionKeys.integraciones });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al registrar'),
  });

  const disabled =
    saveMutation.isPending || syncMutation.isPending || registerMutation.isPending;

  const updateSender = (field: keyof typeof form.correoSenderData, value: string) => {
    setForm((prev) => ({
      ...prev,
      correoSenderData: { ...prev.correoSenderData, [field]: value },
    }));
  };

  if (isPending && !config) {
    return (
      <Card>
        <CardBody className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardBody>
      </Card>
    );
  }

  const status = config?.correoAccountStatus ?? 'not_configured';

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <span>Envíos — MiCorreo</span>
        <div className="flex items-center gap-2">
          <Badge variant={envioStatusVariant(status)}>{envioStatusLabel(status)}</Badge>
          {config?.correoCustomerIdSuffix ? (
            <span className="text-xs text-gray-500">ID {config.correoCustomerIdSuffix}</span>
          ) : null}
          {isFetching && !isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" aria-label="Actualizando" />
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <p className="text-sm text-gray-600">
          La cuenta MiCorreo es de la empresa (no del cliente). Configurá remitente, origen y
          vinculá la cuenta existente para cotizar en checkout e importar envíos.
        </p>

        {config?.correoAccountLastError ? (
          <p className="text-sm text-red-600 rounded border border-red-200 bg-red-50 p-3">
            {config.correoAccountLastError}
          </p>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Remitente</h3>
            <div className="grid gap-2">
              <Label htmlFor="senderName">Nombre</Label>
              <Input
                id="senderName"
                value={form.correoSenderData.name}
                onChange={(e) => updateSender('name', e.target.value)}
                disabled={disabled}
                fullWidth
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="streetName">Calle</Label>
              <Input
                id="streetName"
                value={form.correoSenderData.streetName ?? ''}
                onChange={(e) => updateSender('streetName', e.target.value)}
                disabled={disabled}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="streetNumber">Altura</Label>
                <Input
                  id="streetNumber"
                  value={form.correoSenderData.streetNumber ?? ''}
                  onChange={(e) => updateSender('streetNumber', e.target.value)}
                  disabled={disabled}
                  fullWidth
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={form.correoSenderData.city ?? ''}
                  onChange={(e) => updateSender('city', e.target.value)}
                  disabled={disabled}
                  fullWidth
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.correoSenderData.phone ?? ''}
                  onChange={(e) => updateSender('phone', e.target.value)}
                  disabled={disabled}
                  fullWidth
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cellPhone">Celular</Label>
                <Input
                  id="cellPhone"
                  value={form.correoSenderData.cellPhone ?? ''}
                  onChange={(e) => updateSender('cellPhone', e.target.value)}
                  disabled={disabled}
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Origen y cuenta MiCorreo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="originCp">CP origen</Label>
                <Input
                  id="originCp"
                  value={form.correoOriginCp ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, correoOriginCp: e.target.value }))
                  }
                  placeholder="5000"
                  disabled={disabled}
                  fullWidth
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="originProvince">Provincia</Label>
                <select
                  id="originProvince"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  value={form.correoOriginProvinceCode ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      correoOriginProvinceCode: e.target.value,
                    }))
                  }
                  disabled={disabled}
                >
                  <option value="">Seleccionar</option>
                  {CORREO_PROVINCE_OPTIONS.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="micorreoEmail">Email cuenta MiCorreo</Label>
              <Input
                id="micorreoEmail"
                type="email"
                value={form.correoAccountEmail ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, correoAccountEmail: e.target.value }))
                }
                disabled={disabled}
                fullWidth
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="micorreoPassword">
                Contraseña MiCorreo
                {config?.hasPassword ? (
                  <span className="text-gray-500 font-normal"> (vacío = no cambiar)</span>
                ) : null}
              </Label>
              <Input
                id="micorreoPassword"
                type="password"
                autoComplete="new-password"
                value={form.correoAccountPassword ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, correoAccountPassword: e.target.value }))
                }
                disabled={disabled}
                fullWidth
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-gray-100">
          <Button
            variant="blackOutline"
            onClick={() => {
              if (
                !window.confirm(
                  '¿Crear cuenta nueva en MiCorreo con los datos de la empresa? Solo si no tenés cuenta existente.'
                )
              ) {
                return;
              }
              registerMutation.mutate();
            }}
            disabled={disabled}
          >
            {registerMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Crear cuenta nueva
          </Button>
          <Button
            variant="blackOutline"
            onClick={() => syncMutation.mutate()}
            disabled={disabled}
          >
            {syncMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Link2 className="w-4 h-4 mr-2" />
            )}
            Vincular cuenta
          </Button>
          <Button
            variant="brandRed"
            onClick={() => saveMutation.mutate(form)}
            disabled={disabled || !hasChanges}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar configuración
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
