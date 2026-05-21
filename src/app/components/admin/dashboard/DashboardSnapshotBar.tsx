'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useDashboardKpis } from '@/app/hooks/dashboard';
import { DashboardErrorState } from './DashboardErrorState';

export function DashboardSnapshotBar() {
  const { data, isError, refetch } = useDashboardKpis();

  if (isError) return <DashboardErrorState message="Error al cargar snapshot" onRetry={refetch} />;

  const pendientes = data?.snapshot.pendientesConfirmacion ?? 0;
  const errores = data?.snapshot.erroresSfactory ?? 0;

  if (pendientes === 0 && errores === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-emerald-900">Todo en orden</p>
          <p className="text-xs text-emerald-700">Sin alertas operativas pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {pendientes > 0 && (
        <Link
          href="/admin/pedidos?estado=pendiente_confirmacion"
          className="flex items-center gap-3 p-4 bg-amber-50/60 border border-amber-200 rounded-lg hover:bg-amber-100/60 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold text-amber-900 tabular-nums">
              {pendientes} pendientes de confirmar
            </p>
            <p className="text-xs text-amber-700 truncate">Requieren confirmación manual</p>
          </div>
        </Link>
      )}
      {errores > 0 && (
        <Link
          href="/admin/pedidos?syncStatus=error,conflict"
          className="flex items-center gap-3 p-4 bg-rose-50/60 border border-rose-200 rounded-lg hover:bg-rose-100/60 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold text-rose-900 tabular-nums">
              {errores} errores de sync
            </p>
            <p className="text-xs text-rose-700 truncate">Revisar S-Factory</p>
          </div>
        </Link>
      )}
    </div>
  );
}
