'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/admin/PageHeader';
import { AdminEmailsPageActions } from '@/app/components/admin/emails/AdminEmailsPageActions';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MAX_NEWSLETTER_RECIPIENTS } from '@/app/config/newsletterLimits';
import { useBulkSelection } from '@/app/hooks/useBulkSelection';
import {
  EmailLog,
  Subscriber,
  newsletterAdminService,
} from '@/app/services/newsletter-admin.service';
import { useAdminEmailsPageActions } from '@/app/hooks/useAdminEmailsPageActions';

type TabId = 'campaign' | 'subscribers' | 'history';
type SubscriberFilter = 'all' | 'active' | 'inactive';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'campaign', label: 'Campaña' },
  { id: 'subscribers', label: 'Suscriptores' },
  { id: 'history', label: 'Historial' },
];

type RecipientMode = 'all' | 'selected';

function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SkeletonRows({ rows, columns }: { rows: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-t border-gray-100">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td key={columnIndex} className="px-4 py-3">
              <div className="h-4 rounded bg-gray-200 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function PaginationControls({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-3 text-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &lt;
      </button>
      <span className="text-gray-600">
        Página {page} de {Math.max(totalPages, 1)}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded border border-gray-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}

function CampaignTab() {
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('<p>Escribí el contenido de la campaña.</p>');
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('all');
  const [isSending, setIsSending] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [totalActive, setTotalActive] = useState(0);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);

  const bulkSelection = useBulkSelection(subscribers);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingSubscribers(true);
    newsletterAdminService
      .getSubscribers({ page: 1, limit: 100, active: true })
      .then((result) => {
        if (cancelled) return;
        setSubscribers(result.data);
        setTotalActive(result.pagination.total);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Error al cargar suscriptores');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSubscribers(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedEmails = useMemo(
    () =>
      subscribers
        .filter((subscriber) => bulkSelection.selectedIds.has(subscriber.id))
        .map((subscriber) => subscriber.email),
    [subscribers, bulkSelection.selectedIds]
  );

  const handleToggleSubscriber = (subscriber: Subscriber) => {
    if (
      !bulkSelection.selectedIds.has(subscriber.id) &&
      bulkSelection.selectedCount >= MAX_NEWSLETTER_RECIPIENTS
    ) {
      toast.error(`Máximo ${MAX_NEWSLETTER_RECIPIENTS} destinatarios por campaña.`);
      return;
    }
    bulkSelection.toggleSelect(subscriber.id);
  };

  const handleSelectAllVisible = () => {
    if (subscribers.length === 0) return;
    if (allOnPageSelected) {
      bulkSelection.clearSelection();
      return;
    }
    if (subscribers.length <= MAX_NEWSLETTER_RECIPIENTS) {
      bulkSelection.selectAll();
      return;
    }
    bulkSelection.clearSelection();
    subscribers.slice(0, MAX_NEWSLETTER_RECIPIENTS).forEach((subscriber) => {
      bulkSelection.toggleSelect(subscriber.id);
    });
    toast(`Se seleccionaron los primeros ${MAX_NEWSLETTER_RECIPIENTS} suscriptores.`, {
      icon: 'ℹ️',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSubject = subject.trim();
    const trimmedHtml = htmlBody.trim();

    if (!trimmedSubject) {
      toast.error('Ingresá un asunto.');
      return;
    }
    if (!trimmedHtml) {
      toast.error('Ingresá el contenido de la campaña.');
      return;
    }

    let recipients: string[] | undefined;

    if (recipientMode === 'selected') {
      if (selectedEmails.length === 0) {
        toast.error('Seleccioná al menos un suscriptor.');
        return;
      }
      if (selectedEmails.length > MAX_NEWSLETTER_RECIPIENTS) {
        toast.error(`Máximo ${MAX_NEWSLETTER_RECIPIENTS} destinatarios por campaña.`);
        return;
      }
      recipients = selectedEmails;
    } else {
      if (totalActive === 0) {
        toast.error('No hay suscriptores activos.');
        return;
      }
      if (totalActive > MAX_NEWSLETTER_RECIPIENTS) {
        toast.error(
          `Hay ${totalActive} suscriptores activos. El límite es ${MAX_NEWSLETTER_RECIPIENTS}. Usá "Seleccionar suscriptores".`
        );
        return;
      }
    }

    setIsSending(true);
    try {
      const result = await newsletterAdminService.sendNewsletter({
        subject: trimmedSubject,
        htmlBody: trimmedHtml,
        recipientList: recipients,
      });
      const count = result?.recipients ?? recipients?.length ?? totalActive;
      toast.success(
        count != null ? `Newsletter enviado a ${count} destinatarios` : 'Newsletter enviado'
      );
      if (recipientMode === 'selected') {
        bulkSelection.clearSelection();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const allOnPageSelected =
    subscribers.length > 0 && bulkSelection.selectedCount === subscribers.length;

  return (
    <Card variant="bordered" className="p-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Plan Resend gratis: hasta <strong>{MAX_NEWSLETTER_RECIPIENTS} emails por día</strong>.
          Cada destinatario cuenta como un envío (incluye otros mails transaccionales del mismo día).
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Asunto</label>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">
              Cuerpo HTML
            </label>
            <textarea
              rows={12}
              value={htmlBody}
              onChange={(event) => setHtmlBody(event.target.value)}
              className="min-h-[300px] w-full resize-none rounded border border-gray-300 p-3 font-mono text-sm focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">
              Preview
            </label>
            <iframe
              sandbox="allow-same-origin"
              srcDoc={htmlBody}
              className="min-h-[300px] w-full rounded border border-gray-300 bg-white"
              title="Preview newsletter"
            />
          </div>
        </div>

        <div className="rounded border border-gray-200 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-900">Destinatarios</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={recipientMode === 'all'}
                onChange={() => setRecipientMode('all')}
                className="accent-black"
              />
              Todos los suscriptores activos
              {!isLoadingSubscribers && (
                <span className="text-gray-500">({totalActive})</span>
              )}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                checked={recipientMode === 'selected'}
                onChange={() => setRecipientMode('selected')}
                className="accent-black"
              />
              Seleccionar suscriptores
            </label>
          </div>

          {recipientMode === 'all' && !isLoadingSubscribers && totalActive > MAX_NEWSLETTER_RECIPIENTS && (
            <p className="mt-3 text-sm text-amber-800">
              Superás el límite de {MAX_NEWSLETTER_RECIPIENTS} destinatarios. Elegí suscriptores
              manualmente.
            </p>
          )}

          {recipientMode === 'selected' && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                <span>
                  {bulkSelection.selectedCount} de {Math.min(subscribers.length, MAX_NEWSLETTER_RECIPIENTS)}{' '}
                  seleccionados (máx. {MAX_NEWSLETTER_RECIPIENTS})
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllVisible}
                    className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium hover:border-black"
                  >
                    {allOnPageSelected ? 'Quitar todos' : 'Seleccionar todos'}
                  </button>
                  <button
                    type="button"
                    onClick={bulkSelection.clearSelection}
                    disabled={bulkSelection.selectedCount === 0}
                    className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium hover:border-black disabled:opacity-50"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto rounded border border-gray-200">
                {isLoadingSubscribers ? (
                  <div className="space-y-2 p-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-8 rounded bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : subscribers.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {subscribers.map((subscriber) => {
                      const isSelected = bulkSelection.selectedIds.has(subscriber.id);
                      return (
                        <li key={subscriber.id}>
                          <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSubscriber(subscriber)}
                              className="accent-black"
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-gray-900">
                              {subscriber.email}
                            </span>
                            <span className="shrink-0 text-xs text-gray-500">
                              {formatDate(subscriber.subscribedAt)}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-sm text-gray-500">
                    No hay suscriptores activos.
                  </p>
                )}
              </div>

              {totalActive > subscribers.length && (
                <p className="text-xs text-gray-500">
                  Mostrando los primeros {subscribers.length} de {totalActive} suscriptores activos.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSending || isLoadingSubscribers}
            className="rounded bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#Ed3237] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSending ? 'Enviando...' : 'Enviar campaña'}
          </button>
        </div>
      </form>
    </Card>
  );
}

function SubscribersTab() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<SubscriberFilter>('active');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    newsletterAdminService
      .getSubscribers({ page, limit: 20, active: filter === 'all' ? 'all' : filter === 'active' })
      .then((result) => {
        if (cancelled) return;
        setItems(result.data);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Error al obtener suscriptores');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filter]);

  const visibleItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => (filter === 'active' ? item.active : !item.active));
  }, [filter, items]);

  return (
    <Card variant="bordered" padding="none">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-gray-900">{total} suscriptores activos</p>
        <select
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value as SubscriberFilter);
            setPage(1);
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Fecha de alta</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={8} columns={3} />
            ) : visibleItems.length > 0 ? (
              visibleItems.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{subscriber.email}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(subscriber.subscribedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={subscriber.active ? 'success' : 'default'}>
                      {subscriber.active ? 'activo' : 'inactivo'}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                  No hay suscriptores para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
    </Card>
  );
}

function HistoryTab() {
  const [items, setItems] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    newsletterAdminService
      .getEmailLogs({ page, limit: 20, type, status })
      .then((result) => {
        if (cancelled) return;
        setItems(result.data);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Error al obtener historial');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, type, status]);

  return (
    <Card variant="bordered" padding="none">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-end">
        <select
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(1);
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="newsletter">newsletter</option>
          <option value="order_status">order_status</option>
          <option value="contact">contact</option>
          <option value="welcome">welcome</option>
          <option value="internal">internal</option>
        </select>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="sent">sent</option>
          <option value="failed">failed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Destinatario</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Message ID</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows rows={8} columns={5} />
            ) : items.length > 0 ? (
              items.map((log) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-600">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.type}</td>
                  <td className="px-4 py-3 text-gray-600">{log.to}</td>
                  <td className="px-4 py-3">
                    <Badge variant={log.status === 'sent' ? 'success' : 'danger'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {log.messageId ?? '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No hay envíos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls page={page} totalPages={totalPages} onChange={setPage} />
    </Card>
  );
}

export default function AdminEmailsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('campaign');
  const { handleRefresh, isRefreshing } = useAdminEmailsPageActions();

  return (
    <>
      <PageHeader
        title="Emails"
        description="Gestiona newsletters, suscriptores e historial de envíos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Emails' },
        ]}
        action={<AdminEmailsPageActions handleRefresh={handleRefresh} isRefreshing={isRefreshing} />}
      />

      <div className="mt-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded border px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'campaign' && <CampaignTab />}
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </>
  );
}
