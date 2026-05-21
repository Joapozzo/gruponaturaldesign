'use client';

import { useMemo } from 'react';
import { useDashboardSerieVentas } from '@/app/hooks/dashboard';
import { DashboardSectionCard } from './DashboardSectionCard';
import { DashboardErrorState } from './DashboardErrorState';
import { DashboardEmptyState } from './DashboardEmptyState';
import { formatMoneyArs, decimalStringToNumber } from '@/app/utils/dashboard.utils';

const HEIGHT = 200;
const PADDING_X = 8;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

export function DashboardSerieVentas() {
  const { data, isError, refetch } = useDashboardSerieVentas();

  if (isError) {
    return (
      <DashboardSectionCard title="Serie de ventas">
        <DashboardErrorState message="Error al cargar serie" onRetry={refetch} />
      </DashboardSectionCard>
    );
  }

  const puntos = data?.puntos ?? [];
  const rango = data?.rangoSerie;
  const totalVentas = puntos.reduce((s, p) => s + decimalStringToNumber(p.ventasTotales), 0);

  const { svgWidth, svgHeight, points, maxVal, xScale, yScale } = useMemo(() => {
    const w = 640;
    const innerW = w - PADDING_X * 2;
    const innerH = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const n = puntos.length;
    if (n === 0) return { svgWidth: w, svgHeight: HEIGHT, points: '', maxVal: 0, xScale: (_: number) => 0, yScale: (_: number) => 0 };

    const vals = puntos.map((p) => decimalStringToNumber(p.ventasTotales));
    const maxV = Math.max(...vals, 1);
    const xs = (i: number) => PADDING_X + (i / Math.max(n - 1, 1)) * innerW;
    const ys = (v: number) => PADDING_TOP + innerH - (v / maxV) * innerH;

    const pts = puntos.map((p, i) => `${xs(i)},${ys(decimalStringToNumber(p.ventasTotales))}`).join(' ');
    return { svgWidth: w, svgHeight: HEIGHT, points: pts, maxVal: maxV, xScale: xs, yScale: ys };
  }, [puntos]);

  const labels = useMemo(() => {
    if (!rango) return [];
    const n = puntos.length;
    if (n === 0) return [];
    const xs = (i: number) => PADDING_X + (i / Math.max(n - 1, 1)) * (svgWidth - PADDING_X * 2);
    return puntos.map((p, i) => {
      const show = n <= 10 || i === 0 || i === n - 1 || i === Math.floor(n / 2);
      const d = new Date(p.fecha + 'T00:00:00Z');
      return { x: xs(i), label: show ? d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : '' };
    });
  }, [puntos, rango, svgWidth]);

  return (
    <DashboardSectionCard
      title="Serie de ventas"
      action={
        <span className="text-xs text-neutral-500 tabular-nums">
          {puntos.length > 0 ? `${puntos.length} días` : '—'}
        </span>
      }
    >
      {puntos.length === 0 ? (
        <DashboardEmptyState message="Sin datos en el período seleccionado" />
      ) : (
        <>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-neutral-900 tabular-nums">
              {formatMoneyArs(totalVentas)}
            </span>
            <span className="text-xs text-neutral-500">
              total en {rango?.desde} — {rango?.hasta}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full"
            role="img"
            aria-label="Gráfico de ventas diarias"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75, 1].map((frac) => {
              const y = PADDING_TOP + (HEIGHT - PADDING_TOP - PADDING_BOTTOM) * (1 - frac);
              const val = Math.round(maxVal * frac);
              return (
                <g key={frac}>
                  <line x1={PADDING_X} y1={y} x2={svgWidth - PADDING_X} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
                  <text x={PADDING_X - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
                    {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                  </text>
                </g>
              );
            })}

            {points && (
              <polygon
                points={`${PADDING_X},${HEIGHT - PADDING_BOTTOM} ${points} ${svgWidth - PADDING_X},${HEIGHT - PADDING_BOTTOM}`}
                fill="url(#areaGrad)"
              />
            )}

            {points && (
              <polyline
                points={points}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {puntos.map((p, i) => (
              <circle
                key={i}
                cx={xScale(i)}
                cy={yScale(decimalStringToNumber(p.ventasTotales))}
                r="3"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}

            {labels.map((l, i) => (
              <text key={i} x={l.x} y={HEIGHT - 8} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {l.label}
              </text>
            ))}
          </svg>
        </>
      )}
    </DashboardSectionCard>
  );
}
