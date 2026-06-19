'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Server, WifiOff } from 'lucide-react';
import { useIntegrationsStatusQuery } from '@/app/hooks/useIntegrationsStatusQuery';
import type {
  IntegrationCheckStatus,
  IntegrationStatusItem,
  IntegrationsStatusPayload,
} from '@/app/types/integrations.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

const INTEGRATION_LABELS: Record<keyof IntegrationsStatusPayload['integrations'], string> = {
  mercadopago: 'Mercado Pago',
  correo: 'MiCorreo (Correo Argentino)',
  andreani: 'Andreani',
};

function mapStatusBadge(status: IntegrationCheckStatus): {
  variant: 'success' | 'danger' | 'warning' | 'info' | 'default';
  label: string;
} {
  switch (status) {
    case 'ok':
      return { variant: 'success', label: 'OK' };
    case 'mock':
      return { variant: 'warning', label: 'Mock' };
    case 'misconfigured':
      return { variant: 'danger', label: 'Sin configurar' };
    case 'error':
      return { variant: 'danger', label: 'Error' };
    default:
      return { variant: 'default', label: status };
  }
}

/** Normaliza mode del API (production, prod, sandbox, test, …) a etiqueta única. */
function formatIntegrationModeLabel(mode: string | null | undefined): string | null {
  if (!mode?.trim()) return null;
  const v = mode.trim().toLowerCase();
  if (v === 'prod' || v === 'production' || v === 'live') return 'Producción';
  if (v === 'test' || v === 'sandbox' || v === 'qa') return 'Test / Sandbox';
  if (v === 'mock') return 'Mock';
  return mode.trim();
}

function formatCheckedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

function IntegrationRow({
  name,
  item,
}: {
  name: string;
  item: IntegrationStatusItem;
}) {
  const badge = mapStatusBadge(item.status);
  const modeLabel = formatIntegrationModeLabel(item.mode);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
            <Badge variant={badge.variant}>{badge.label}</Badge>
            {modeLabel ? (
              <Badge variant="info">{modeLabel}</Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-gray-600 wrap-break-word">{item.detail}</p>
        </div>
        {item.status === 'ok' ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden />
        ) : item.status === 'mock' ? (
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
        ) : (
          <WifiOff className="h-5 w-5 shrink-0 text-red-500" aria-hidden />
        )}
      </div>
    </div>
  );
}

export function IntegracionesTab({ onOpenEnvios }: { onOpenEnvios?: () => void }) {
  const { data, isPending, isFetching, isError, error, refetch } = useIntegrationsStatusQuery();

  if (isPending && !data) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center gap-2 py-12 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verificando integraciones…
        </CardBody>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardBody className="space-y-4 py-8">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'No se pudo cargar el estado de integraciones'}
          </p>
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            <RefreshCw className="mr-2 inline h-4 w-4" />
            Reintentar
          </Button>
        </CardBody>
      </Card>
    );
  }

  const entries = Object.entries(data.integrations) as Array<
    [keyof IntegrationsStatusPayload['integrations'], IntegrationStatusItem]
  >;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Entorno actual</h2>
            <p className="mt-1 text-sm text-gray-500">
              Estado en vivo del API al que apunta este deploy
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={data.modeRaw === 'prod' ? 'success' : 'warning'}>
              {formatIntegrationModeLabel(data.modeRaw) ??
                formatIntegrationModeLabel(data.mode) ??
                data.mode}
            </Badge>
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-label="Actualizando" />
            ) : null}
          </div>
        </CardHeader>
        <CardBody className="space-y-3 pt-4">
          <div className="flex items-start gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
            <Server className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden />
            <span className="break-all font-mono text-xs sm:text-sm">{API_BASE}</span>
          </div>
          <p className="text-xs text-gray-500">
            Última verificación: {formatCheckedAt(data.timestamp)}
          </p>
        </CardBody>
      </Card>

      <div className="space-y-3">
        {entries.map(([key, item]) => (
          <div key={key}>
            <IntegrationRow name={INTEGRATION_LABELS[key]} item={item} />
            {key === 'correo' &&
            (item.status === 'misconfigured' || item.status === 'error') &&
            onOpenEnvios ? (
              <p className="mt-2 text-sm">
                <button
                  type="button"
                  className="text-red-700 underline font-medium"
                  onClick={onOpenEnvios}
                >
                  Configurar MiCorreo en Envíos
                </button>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
