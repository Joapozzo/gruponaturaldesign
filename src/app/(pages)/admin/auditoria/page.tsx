import React, { Suspense } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { AuditoriaTableClient } from '@/app/components/admin/auditoria/AuditoriaTableClient';
import { AuditoriaPageActions } from '@/app/components/admin/auditoria/AuditoriaPageActions';
import { AdminTableSkeleton } from '@/app/components/admin/AdminTableSkeleton';
import { getEmpresaId } from '@/app/utils/getEmpresaId';

/**
 * Página de administración de auditoría (Server Component).
 * No hace prefetch en servidor: las rutas de audit-logs requieren Bearer token;
 * la tabla hace fetch en el cliente.
 */
export default async function AdminAuditoriaPage() {
  const empresaId = getEmpresaId();

  return (
    <>
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
    </>
  );
}
