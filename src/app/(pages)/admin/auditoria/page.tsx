import React, { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import PageHeader from '@/components/admin/PageHeader';
import { AuditoriaTableClient } from '@/app/components/admin/auditoria/AuditoriaTableClient';
import { AuditoriaPageActions } from '@/app/components/admin/auditoria/AuditoriaPageActions';
import { AdminTableSkeleton } from '@/app/components/admin/AdminTableSkeleton';
import { getEmpresaId } from '@/app/utils/getEmpresaId';
import { parseTableSearchParams } from '@/app/utils/parseTableSearchParams';
import { createSSRQueryClient } from '@/app/utils/createSSRQueryClient';
import { prefetchAuditoriaTable } from '@/app/utils/prefetchAuditoriaTable';
import type { AuditLogQueryParams } from '@/app/types/audit.types';

interface AdminAuditoriaPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    entity?: string;
    userId?: string;
    userEmail?: string;
    dateFrom?: string;
    dateTo?: string;
    action?: string;
    method?: string;
  }>;
}

export default async function AdminAuditoriaPage({ searchParams }: AdminAuditoriaPageProps) {
  const empresaId = getEmpresaId();
  const params = await searchParams;
  const { page, limit } = parseTableSearchParams(params);

  const filters: Partial<AuditLogQueryParams> = {};
  if (params.entity) filters.entity = params.entity as AuditLogQueryParams['entity'];
  if (params.userId) filters.userId = parseInt(params.userId, 10);
  if (params.userEmail) filters.userEmail = params.userEmail;
  if (params.dateFrom) filters.dateFrom = params.dateFrom;
  if (params.dateTo) filters.dateTo = params.dateTo;
  if (params.action) filters.action = params.action as AuditLogQueryParams['action'];
  if (params.method) filters.method = params.method;

  const queryClient = createSSRQueryClient();
  await prefetchAuditoriaTable(queryClient, {
    empresaId,
    page,
    limit,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader
        title="Auditoría"
        description="Historial de cambios por entidad, usuario y fecha"
        action={<AuditoriaPageActions empresaId={empresaId} />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Auditoría' },
        ]}
      />

      <Suspense fallback={<AdminTableSkeleton />}>
        <AuditoriaTableClient empresaId={empresaId} />
      </Suspense>
    </HydrationBoundary>
  );
}
