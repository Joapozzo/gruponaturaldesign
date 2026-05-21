'use client';

import BaseModal from '@/app/components/modal/BaseModal';
import { Badge } from '@/components/ui/Badge';
import {
  ESTADOS_ECOMMERCE_REF,
  ESTADOS_SFACTORY_REF,
  mapEstadoPedidoBadgeVariant,
  mapSfactoryEstadoBadgeVariant,
} from '@/app/utils/pedidoEstadoDisplay';

interface PedidosEstadosHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PedidosEstadosHelpModal({ isOpen, onClose }: PedidosEstadosHelpModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Estados de pedidos" size="lg">
      <div className="space-y-6">
        <p className="text-sm text-neutral-600">
          El ecommerce y SFactory usan estados distintos. Un pedido puede estar confirmado en la web
          pero pendiente de aprobación en el ERP hasta que se cierre la venta en SFactory.
        </p>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900">Estados ecommerce</h3>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 w-44">
                    Estado
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {ESTADOS_ECOMMERCE_REF.map((row) => (
                  <tr key={row.nombre} className="border-t border-neutral-100">
                    <td className="px-3 py-2 align-top">
                      <Badge
                        variant={
                          row.estadoKey
                            ? mapEstadoPedidoBadgeVariant(row.estadoKey)
                            : 'default'
                        }
                      >
                        {row.nombre}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-neutral-600 align-top">{row.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900">Estados SFactory (ERP)</h3>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 w-16">
                    Cód.
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 w-36">
                    Estado
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {ESTADOS_SFACTORY_REF.map((row) => (
                  <tr key={row.codigo} className="border-t border-neutral-100">
                    <td className="px-3 py-2 text-neutral-600 tabular-nums align-top">
                      {row.codigo}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={mapSfactoryEstadoBadgeVariant(row.codigo)}>{row.nombre}</Badge>
                    </td>
                    <td className="px-3 py-2 text-neutral-600 align-top">{row.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </BaseModal>
  );
}
