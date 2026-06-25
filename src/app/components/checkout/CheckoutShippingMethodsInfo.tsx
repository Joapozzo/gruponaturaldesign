'use client';

import { MapPin, Store, Truck } from 'lucide-react';
import { useTiendaConfig } from '@/app/hooks/useTiendaConfig';
import { cn } from '@/lib/utils';

type Variant = 'sidebar' | 'summary';

interface CheckoutShippingMethodsInfoProps {
  variant?: Variant;
  className?: string;
}

export function CheckoutShippingMethodsInfo({
  variant = 'sidebar',
  className,
}: CheckoutShippingMethodsInfoProps) {
  const tienda = useTiendaConfig();
  const isSidebar = variant === 'sidebar';

  const wrapperClass = isSidebar
    ? 'hidden lg:block bg-black text-white rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3'
    : 'bg-gray-50/80 border border-gray-200 p-3 sm:p-4 rounded-lg space-y-2';

  const titleClass = isSidebar
    ? 'text-xs sm:text-sm font-bold mb-1.5 sm:mb-2'
    : 'text-xs sm:text-sm font-medium uppercase tracking-wide text-gray-500';

  const bodyClass = cn(
    'text-[10px] sm:text-xs space-y-1.5 sm:space-y-2',
    isSidebar ? 'text-gray-300' : 'text-gray-600'
  );

  const headingClass = cn(
    'font-semibold mb-1 flex items-center gap-1.5',
    isSidebar ? 'text-white' : 'text-gray-800'
  );

  return (
    <div className={cn(wrapperClass, className)}>
      <h3 className={titleClass}>MEDIOS DE ENVÍO</h3>
      <div className={bodyClass}>
        <div>
          <p className={headingClass}>
            <Truck className="w-3.5 h-3.5 shrink-0" aria-hidden />
            Interior y resto del país
          </p>
          <p className={isSidebar ? 'ml-2' : ''}>Andreani / Correo Argentino</p>
          <p className={cn(isSidebar ? 'ml-2 text-gray-400' : 'text-gray-500')}>
            El costo corre por cuenta del cliente
          </p>
        </div>
        <div>
          <p className={headingClass}>
            <Store className="w-3.5 h-3.5 shrink-0" aria-hidden />
            Pick up
          </p>
          <p className={isSidebar ? 'ml-2' : ''}>{tienda.retiroDireccion}</p>
          {tienda.retiroHorarios ? (
            <p className={isSidebar ? 'ml-2' : ''}>Horarios: {tienda.retiroHorarios}</p>
          ) : null}
          {tienda.retiroDemora ? (
            <p className={isSidebar ? 'ml-2' : ''}>{tienda.retiroDemora}</p>
          ) : null}
          {tienda.retiroNotas ? (
            <p className={cn(isSidebar ? 'ml-2 text-gray-400' : 'text-gray-500')}>
              {tienda.retiroNotas}
            </p>
          ) : null}
        </div>
        {/* <div>
          <p className={headingClass}>
            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
            Córdoba Capital
          </p>
          <p className={isSidebar ? 'ml-2' : ''}>
            Cadetería a coordinar con el vendedor (costo a cargo del cliente)
          </p>
        </div> */}
      </div>
    </div>
  );
}
