import { Suspense } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { AdminTableSkeleton } from '@/app/components/admin/AdminTableSkeleton';
import { PedidosPageActions } from '@/app/components/admin/pedidos/PedidosPageActions';
import { PedidosTableClient } from '@/app/components/admin/pedidos/PedidosTableClient';

export default function PedidosPage() {
  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Gestiona pedidos web"
        action={<PedidosPageActions />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Pedidos' },
        ]}
      />

      <div className="mt-6">
        <Suspense fallback={<AdminTableSkeleton />}>
          <PedidosTableClient />
        </Suspense>
      </div>
    </>
  );
}
