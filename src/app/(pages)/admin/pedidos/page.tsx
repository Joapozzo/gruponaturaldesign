import PageHeader from '@/components/admin/PageHeader';

export default function PedidosPage() {
  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Gestiona todos los pedidos de tu tienda"
      />

      <div className="mt-8">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <p className="text-neutral-500">Tabla de pedidos aquí...</p>
        </div>
      </div>
    </>
  );
}
