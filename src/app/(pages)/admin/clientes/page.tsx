'use client';

import React from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { ClientesPageActions } from '@/app/components/admin/clientes/ClientesPageActions';
import { ClientesTableClient } from '@/app/components/admin/clientes/ClientesTableClient';
import { ClientesPageWrapper } from '@/app/components/admin/clientes/ClientesPageWrapper';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Card } from '@/components/ui/Card';

export default function ClientesPage() {
  return (
    <ClientesPageWrapper>
      <PageHeader
        title="Clientes"
        description="Gestiona tu base de clientes"
        action={<ClientesPageActions />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Clientes' },
        ]}
      />

      <div className="mt-8">
        <Suspense
          fallback={
            <Card variant="elevated" padding="none">
              <TableSkeleton rows={20} columns={8} showPagination={true} />
            </Card>
          }
        >
          <ClientesTableClient />
        </Suspense>
      </div>
    </ClientesPageWrapper>
  );
}
