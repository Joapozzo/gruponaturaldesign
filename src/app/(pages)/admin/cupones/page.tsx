'use client';

import { Suspense, useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import BaseModal from '@/app/components/modal/BaseModal';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { CuponForm } from '@/app/components/admin/cupones/CuponForm';
import { CuponesPageActions } from '@/app/components/admin/cupones/CuponesPageActions';
import { CuponesTableClient } from '@/app/components/admin/cupones/CuponesTableClient';
import { cuponColumns } from '@/app/components/admin/cupones/columns';
import { useCuponesPageActions } from '@/app/hooks/useCuponesPageActions';

export default function CuponesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editCuponId, setEditCuponId] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const { handleRefresh, isRefreshing } = useCuponesPageActions();

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditCuponId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    setModalMode('edit');
    setEditCuponId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditCuponId(null);
  };

  return (
    <>
      <PageHeader
        title="Cupones"
        description="Gestiona cupones de descuento"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Cupones' },
        ]}
        action={
          <CuponesPageActions
            handleRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onHelpClick={() => setHelpOpen(true)}
            onCreateClick={handleOpenCreate}
          />
        }
      />

      <div className="mt-8">
        <Suspense
          fallback={
            <Card variant="elevated" padding="none">
              <TableSkeleton rows={20} columns={cuponColumns.length + 1} showPagination />
            </Card>
          }
        >
          <CuponesTableClient onEdit={handleOpenEdit} />
        </Suspense>
      </div>

      <BaseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'create' ? 'Nuevo Cupón' : 'Editar Cupón'}
        size="lg"
      >
        <CuponForm cuponId={editCuponId ?? undefined} onClose={handleCloseModal} />
      </BaseModal>

      <BaseModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="¿Cómo funcionan los cupones?"
        size="md"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Descuento por porcentaje</h4>
            <p>Se aplica un % sobre el precio de los productos seleccionados. Ej: 20% de descuento.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Descuento por monto fijo</h4>
            <p>Se descuenta un monto fijo del total. Si es para el carrito completo, se divide proporcionalmente entre los items.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">¿Qué es &quot;Aplicar IVA al descuento&quot;?</h4>
            <p>Si está activado, el descuento se calcula sobre el precio con IVA incluido (precio final del cliente).</p>
            <p className="mt-1 text-xs text-yellow-700">Si está desactivado, el descuento se calcula sobre el precio sin impuestos y el IVA se aplica después.</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">¿Qué es &quot;Requiere código manual&quot;?</h4>
            <p>Si está activado, el cliente debe ingresar el código del cupón manualmente en el checkout para aplicarlo.</p>
            <p className="mt-1 text-xs text-purple-700">Si está desactivado, el cupón se aplica automáticamente al carrito sin necesidad de que el cliente haga nada.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Alcance</h4>
            <ul className="text-xs space-y-1 mt-2">
              <li><strong>Carrito completo:</strong> Es el alcance disponible en este formulario y aplica a todos los productos del carrito.</li>
              <li><strong>Productos web, rubros y subrubros:</strong> Están contemplados por el motor de cupones, pero no están habilitados en este formulario de administración.</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">Límites</h4>
            <ul className="text-xs space-y-1 mt-2">
              <li><strong>Monto mínimo:</strong> El carrito debe alcanzar ese monto para que aplique el cupón.</li>
              <li><strong>Tope máximo:</strong> El descuento no puede superar ese monto aunque la fórmula diga más.</li>
              <li><strong>Usos máximos:</strong> Cantidad total de veces que se puede usar el cupón.</li>
              <li><strong>Usos por usuario:</strong> Veces que cada cliente puede usar el cupón.</li>
            </ul>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
