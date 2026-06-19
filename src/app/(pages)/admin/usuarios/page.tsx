'use client';

import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { UsuariosPageActions } from '@/app/components/admin/usuarios/UsuariosPageActions';
import { UsuariosTableClient } from '@/app/components/admin/usuarios/UsuariosTableClient';
import { UsuarioModal } from '@/app/components/admin/usuarios/UsuarioModal';

export default function UsuariosPage() {
  return (
    <>
      <Toaster position="top-right" />
      <PageHeader
        title="Usuarios"
        description="Gestiona usuarios del sistema"
        action={<UsuariosPageActions />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Usuarios' },
        ]}
      />

      <div className="mt-8">
        <Suspense
          fallback={
            <Card variant="elevated" padding="none">
              <TableSkeleton rows={10} columns={6} showPagination />
            </Card>
          }
        >
          <UsuariosTableClient />
        </Suspense>
      </div>

      <UsuarioModal />
    </>
  );
}