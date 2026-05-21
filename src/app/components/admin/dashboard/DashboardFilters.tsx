'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardFullQueryInput } from '@/app/types/dashboard.types';

interface DashboardFiltersProps {
  initial: DashboardFullQueryInput;
}

const PRESETS = [
  { label: 'Hoy', days: 0 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: 'Mes', days: null },
] as const;

function thisMonthRange(): { desde: string; hasta: string } {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const desde = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const ultimo = new Date(Date.UTC(y, m + 1, 0));
  const hasta = ultimo.toISOString().slice(0, 10);
  return { desde, hasta };
}

export function DashboardFilters({ initial }: DashboardFiltersProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const desde = sp.get('fechaDesde') ?? initial.fechaDesde ?? '';
  const hasta = sp.get('fechaHasta') ?? initial.fechaHasta ?? '';
  const compare = sp.get('compare') ?? (initial.compare !== false ? 'true' : 'false');
  const segmentar = sp.get('segmentar') ?? (initial.segmentarTipoCliente !== false ? 'true' : 'false');

  const update = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(sp.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === '' || v === null) {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
      router.replace(`/admin/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, sp]
  );

  const applyPreset = (days: number | null) => {
    const hastaYmd = new Date().toISOString().slice(0, 10);
    let desdeYmd: string;
    if (days === null) {
      const m = thisMonthRange();
      update({ fechaDesde: m.desde, fechaHasta: m.hasta });
      return;
    } else if (days === 0) {
      desdeYmd = hastaYmd;
    } else {
      const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      desdeYmd = d.toISOString().slice(0, 10);
    }
    update({ fechaDesde: desdeYmd, fechaHasta: hastaYmd });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CalendarDays className="w-4 h-4 text-neutral-400 flex-shrink-0" />

      {PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => applyPreset(p.days)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md border transition-colors',
            'border-neutral-200 bg-white text-neutral-600',
            'hover:border-neutral-400 hover:text-neutral-900',
            'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1'
          )}
        >
          {p.label}
        </button>
      ))}

      <div className="flex items-center gap-1 ml-2">
        <label htmlFor="fd" className="text-xs text-neutral-500 sr-only">Desde</label>
        <input
          id="fd"
          type="date"
          value={desde}
          onChange={(e) => update({ fechaDesde: e.target.value })}
          className="h-8 px-2 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1"
        />
        <span className="text-xs text-neutral-400">—</span>
        <label htmlFor="fh" className="text-xs text-neutral-500 sr-only">Hasta</label>
        <input
          id="fh"
          type="date"
          value={hasta}
          onChange={(e) => update({ fechaHasta: e.target.value })}
          className="h-8 px-2 text-xs border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1"
        />
      </div>

      <div className="flex items-center gap-3 ml-2">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={compare === 'true'}
            onChange={(e) => update({ compare: e.target.checked ? 'true' : 'false' })}
            className="w-3.5 h-3.5 rounded border-neutral-300"
          />
          <span className="text-xs text-neutral-600">vs. anterior</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={segmentar === 'true'}
            onChange={(e) => update({ segmentar: e.target.checked ? 'true' : 'false' })}
            className="w-3.5 h-3.5 rounded border-neutral-300"
          />
          <span className="text-xs text-neutral-600">por tipo</span>
        </label>
      </div>
    </div>
  );
}
