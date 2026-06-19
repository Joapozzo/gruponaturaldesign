'use client';

import type { ReactNode } from 'react';
import BaseModal from '@/app/components/modal/BaseModal';
import type { AuditLogItem } from '@/app/types/audit.types';
import { ENTITY_LABELS, ACTION_LABELS, formatAuditDate } from './auditDisplayUtils';

interface AuditoriaDetailModalProps {
  log: AuditLogItem | null;
  onClose: () => void;
}

const SKIP_DIFF_KEYS = new Set([
  'createdAt',
  'updatedAt',
  'empresaId',
  'rubro',
  'subrubro',
  '_count',
  'productosWeb',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function formatAuditValue(value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function getAuditDiffRows(oldValues: unknown, newValues: unknown) {
  const oldObj = isRecord(oldValues) ? oldValues : {};
  const newObj = isRecord(newValues) ? newValues : {};
  const keys = [...new Set([...Object.keys(oldObj), ...Object.keys(newObj)])]
    .filter((key) => !SKIP_DIFF_KEYS.has(key))
    .sort();

  return keys
    .filter((key) => oldObj[key] !== newObj[key])
    .map((key) => ({
      key,
      oldVal: formatAuditValue(oldObj[key]),
      newVal: formatAuditValue(newObj[key]),
    }));
}

function MetaItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-800 break-words">{value}</dd>
    </div>
  );
}

export function AuditoriaDetailModal({ log, onClose }: AuditoriaDetailModalProps) {
  const diffRows = log ? getAuditDiffRows(log.oldValues, log.newValues) : [];

  return (
    <BaseModal
      isOpen={log != null}
      onClose={onClose}
      title="Detalle de auditoría"
      size="xl"
    >
      {log && (
        <div className="space-y-6 text-neutral-900">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <MetaItem label="Fecha" value={formatAuditDate(log.createdAt)} />
            <MetaItem
              label="Entidad"
              value={ENTITY_LABELS[log.entity] ?? log.entity}
            />
            <MetaItem label="ID entidad" value={log.entityId ?? '—'} />
            <MetaItem
              label="Acción"
              value={ACTION_LABELS[log.action] ?? log.action}
            />
            <MetaItem label="Usuario" value={log.userEmail ?? '—'} />
            <MetaItem label="Método" value={log.method ?? '—'} />
            <MetaItem label="Path" value={log.path ?? '—'} />
            <MetaItem label="IP" value={log.ipAddress ?? '—'} />
          </dl>

          {log.summary && (
            <section>
              <h3 className="text-sm font-semibold text-neutral-800 mb-2">Resumen</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap break-words rounded-lg bg-neutral-50 border border-neutral-200 p-3">
                {log.summary}
              </p>
            </section>
          )}

          {diffRows.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-neutral-800 mb-2">Cambios</h3>
              <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium text-neutral-600">Campo</th>
                      <th className="px-3 py-2 font-medium text-neutral-600">Antes</th>
                      <th className="px-3 py-2 font-medium text-neutral-600">Después</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {diffRows.map((row) => (
                      <tr key={row.key} className="align-top">
                        <td className="px-3 py-2 font-mono text-neutral-700 whitespace-nowrap">
                          {row.key}
                        </td>
                        <td className="px-3 py-2 text-neutral-600 whitespace-pre-wrap break-words max-w-xs">
                          {row.oldVal}
                        </td>
                        <td className="px-3 py-2 text-neutral-800 whitespace-pre-wrap break-words max-w-xs">
                          {row.newVal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {!log.summary && diffRows.length === 0 && (
            <p className="text-sm text-neutral-500">Sin detalle adicional para este registro.</p>
          )}
        </div>
      )}
    </BaseModal>
  );
}
