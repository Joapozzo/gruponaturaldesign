import React, { Suspense } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { ProductosTableClient } from '@/app/components/admin/productos/ProductosTableClient';
import { ProductosPageActions } from '@/app/components/admin/productos/ProductosPageActions';
import { AdminTableSkeleton } from '@/app/components/admin/AdminTableSkeleton';
import { getEmpresaId } from '@/app/utils/getEmpresaId';

/**
 * Página de administración de productos (Server Component).
 * No hace prefetch en servidor: las rutas de productos requieren Bearer token
 * y el cliente es quien tiene el token. La tabla hace fetch en el cliente.
 */
export default async function AdminProductosPage() {
  const empresaId = getEmpresaId();

  return (
    <>
      <PageHeader
        title="Productos"
        description="Gestiona tus productos y sus variantes"
        action={<ProductosPageActions empresaId={empresaId} />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Productos' },
        ]}
      />

      <Suspense fallback={<AdminTableSkeleton />}>
        <ProductosTableClient empresaId={empresaId} />
      </Suspense>
    </>
  );
}
