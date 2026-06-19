import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import { formatPedidoMoney } from './pedidoDetailFormat';

interface PedidoDetailItemsSectionProps {
  pedido: AdminPedidoDetalle;
}

export function PedidoDetailItemsSection({ pedido }: PedidoDetailItemsSectionProps) {
  const totalLabel =
    pedido.estadoInterno === 'pendiente_pago' ? 'Total a cobrar' : 'Total cobrado';

  return (
    <section>
      <h3 className="text-sm font-semibold text-neutral-900 mb-2">Ítems</h3>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-3 py-2">Producto</th>
              <th className="text-right px-3 py-2">Cant.</th>
              <th className="text-right px-3 py-2">P. unit.</th>
              <th className="text-right px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(pedido.items ?? []).map((it) => {
              const specParts = [
                it.talle ? `Talle ${it.talle}` : null,
                it.color ?? null,
                it.bordado ? 'Bordado' : null,
              ].filter(Boolean);
              return (
                <tr key={it.id} className="border-t border-neutral-100">
                  <td className="px-3 py-2">
                    <div className="font-medium">{it.nombre}</div>
                    <div className="text-xs text-neutral-500">{it.codigo}</div>
                    {specParts.length > 0 ? (
                      <div className="text-xs text-neutral-600 mt-0.5">{specParts.join(' · ')}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-right">{Number(it.cantidad)}</td>
                  <td className="px-3 py-2 text-right">{formatPedidoMoney(it.precioUnitario)}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatPedidoMoney(it.subtotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-col items-end gap-1 text-sm">
        <div className="text-neutral-600">
          {pedido.sfactoryOrdenId != null ? 'Subtotal productos (S-Factory)' : 'Subtotal productos'}{' '}
          <span className="font-medium text-neutral-900">{formatPedidoMoney(pedido.subtotal)}</span>
        </div>
        {Number(pedido.costoEnvio ?? 0) > 0 ? (
          <div className="text-neutral-600">
            + Envío{' '}
            <span className="font-medium text-neutral-900">
              {formatPedidoMoney(pedido.costoEnvio ?? 0)}
            </span>
          </div>
        ) : null}
        {Number(pedido.descuento ?? 0) > 0 && pedido.sfactoryOrdenId == null ? (
          <div className="text-neutral-600">
            Desc.{' '}
            <span className="font-medium">{formatPedidoMoney(pedido.descuento ?? 0)}</span>
          </div>
        ) : null}
        {pedido.cuponCodigoSnapshot ? (
          <div className="text-neutral-500 text-xs">
            Cupón {pedido.cuponCodigoSnapshot}
            {Number(pedido.cuponDescuentoTotal ?? 0) > 0
              ? ` (${formatPedidoMoney(pedido.cuponDescuentoTotal ?? 0)} aplicado en ERP)`
              : null}
          </div>
        ) : null}
        <div className="pt-1 border-t border-neutral-200 w-full flex justify-end gap-2">
          <span className="text-base font-semibold text-neutral-900">
            {totalLabel} {formatPedidoMoney(pedido.total)}
          </span>
        </div>
      </div>
    </section>
  );
}
