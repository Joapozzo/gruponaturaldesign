import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function ClientesPage() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gestiona tu base de clientes"
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Cliente
          </Button>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Clientes' }
        ]}
      />

      <div className="mt-8">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <p className="text-neutral-500">Tabla de clientes aquí...</p>
        </div>
      </div>
    </>
  );
}
