import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';

interface PedidoDetailClienteSectionProps {
  pedido: AdminPedidoDetalle;
}

export function PedidoDetailClienteSection({ pedido }: PedidoDetailClienteSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900 mb-2">Cliente</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-neutral-500">Nombre</dt>
          <dd className="font-medium">{pedido.clienteNombre}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Email</dt>
          <dd>{pedido.clienteEmail}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Teléfono</dt>
          <dd>{pedido.clienteTelefono || '—'}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Dirección</dt>
          <dd>{pedido.clienteDireccion || '—'}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Ref. cliente</dt>
          <dd>{pedido.refCliente || '—'}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Cliente BD</dt>
          <dd>
            {pedido.cliente
              ? `#${pedido.cliente.id} ${pedido.cliente.razonSocial ?? ''}`.trim()
              : '—'}
          </dd>
        </div>
      </dl>
    </section>
  );
}
