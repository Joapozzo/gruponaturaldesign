'use client';

import { Clock, AlertTriangle, CreditCard, Timer } from 'lucide-react';
import { useDashboardAlertas } from '@/app/hooks/dashboard';
import { DashboardSectionCard } from './DashboardSectionCard';
import { DashboardAlertasList } from './DashboardAlertasList';
import { DashboardErrorState } from './DashboardErrorState';

interface AlertaBloqueProps {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  count: number;
  countClass: string;
  children: React.ReactNode;
}

function AlertaBloque({ icon, iconClass, title, count, countClass, children }: AlertaBloqueProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={iconClass}>{icon}</span>
        <h4 className="text-xs font-semibold text-neutral-700">{title}</h4>
        <span className={`ml-auto text-xs font-medium tabular-nums ${countClass}`}>{count}</span>
      </div>
      {children}
    </div>
  );
}

export function DashboardAlertas() {
  const { data, isError, refetch } = useDashboardAlertas();

  if (isError) {
    return (
      <DashboardSectionCard title="Alertas">
        <DashboardErrorState message="Error al cargar alertas" onRetry={refetch} />
      </DashboardSectionCard>
    );
  }

  const total =
    (data?.pendientesConfirmacion.length ?? 0) +
    (data?.sfactoryIssues.length ?? 0) +
    (data?.pagoPendienteAntiguo.length ?? 0) +
    (data?.proximosAVencer?.length ?? 0);

  return (
    <DashboardSectionCard
      title="Alertas"
      action={<span className="text-xs text-neutral-500 tabular-nums">{total}</span>}
      noPadding
    >
      <div className="divide-y divide-neutral-100">
        <AlertaBloque
          icon={<Clock className="w-3.5 h-3.5" />}
          iconClass="text-amber-600"
          title="Pendientes de confirmar"
          count={data?.pendientesConfirmacion.length ?? 0}
          countClass="text-amber-700"
        >
          <DashboardAlertasList
            items={data?.pendientesConfirmacion ?? []}
            icon={<Clock className="w-4 h-4" />}
            emptyMessage="Sin pedidos pendientes"
            badgeVariant="warning"
            href="/admin/pedidos?estado=pendiente_confirmacion"
          />
        </AlertaBloque>

        <AlertaBloque
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          iconClass="text-rose-600"
          title="Errores S-Factory"
          count={data?.sfactoryIssues.length ?? 0}
          countClass="text-rose-700"
        >
          <DashboardAlertasList
            items={data?.sfactoryIssues ?? []}
            icon={<AlertTriangle className="w-4 h-4" />}
            emptyMessage="Sin errores de sync"
            badgeVariant="danger"
            href="/admin/pedidos?syncStatus=error,conflict"
          />
        </AlertaBloque>

        <AlertaBloque
          icon={<CreditCard className="w-3.5 h-3.5" />}
          iconClass="text-orange-600"
          title="Pago pendiente antiguo"
          count={data?.pagoPendienteAntiguo.length ?? 0}
          countClass="text-orange-700"
        >
          <DashboardAlertasList
            items={data?.pagoPendienteAntiguo ?? []}
            icon={<CreditCard className="w-4 h-4" />}
            emptyMessage="Sin pagos pendientes viejos"
            badgeVariant="info"
            href="/admin/pedidos?estado=pendiente_pago"
          />
        </AlertaBloque>

        <AlertaBloque
          icon={<Timer className="w-3.5 h-3.5" />}
          iconClass="text-violet-600"
          title="Próximos a vencer"
          count={data?.proximosAVencer?.length ?? 0}
          countClass="text-violet-700"
        >
          <DashboardAlertasList
            items={data?.proximosAVencer ?? []}
            icon={<Timer className="w-4 h-4" />}
            emptyMessage="Sin vencimientos próximos"
            badgeVariant="warning"
            href="/admin/pedidos?estado=pendiente_pago,pendiente_confirmacion"
          />
        </AlertaBloque>
      </div>
    </DashboardSectionCard>
  );
}
