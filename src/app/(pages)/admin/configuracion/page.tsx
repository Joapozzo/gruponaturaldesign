'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { ConfiguracionTabBar, type ConfiguracionTabId } from '@/app/components/admin/configuracion/ConfiguracionTabBar';
import { PreciosTab } from '@/app/components/admin/configuracion/PreciosTab';
import { DatosBancariosTab } from '@/app/components/admin/configuracion/DatosBancariosTab';
import { TiendaContactoTab } from '@/app/components/admin/configuracion/TiendaContactoTab';
import { IntegracionesTab } from '@/app/components/admin/configuracion/IntegracionesTab';
import { EnvioTab } from '@/app/components/admin/configuracion/EnvioTab';
import { ConfiguracionPageActions } from '@/app/components/admin/configuracion/ConfiguracionPageActions';
import { useAdminConfiguracionPageActions } from '@/app/hooks/useAdminConfiguracionPageActions';
import { usePrefetchConfiguracion } from '@/app/hooks/usePrefetchConfiguracion';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<ConfiguracionTabId>('integraciones');
  const { handleRefresh, isRefreshing } = useAdminConfiguracionPageActions();
  usePrefetchConfiguracion();

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Integraciones, envíos, precios, datos bancarios y contacto de tienda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Configuración' },
        ]}
        action={
          <ConfiguracionPageActions handleRefresh={handleRefresh} isRefreshing={isRefreshing} />
        }
      />

      <div className="mt-8 space-y-6">
        <ConfiguracionTabBar activeTab={activeTab} onChange={setActiveTab} />

        <div className="max-w-4xl">
          <div hidden={activeTab !== 'integraciones'}>
            <IntegracionesTab onOpenEnvios={() => setActiveTab('envios')} />
          </div>
          <div hidden={activeTab !== 'envios'}>
            <EnvioTab />
          </div>
          <div hidden={activeTab !== 'precios'}>
            <PreciosTab />
          </div>
          <div hidden={activeTab !== 'datos-bancarios'}>
            <DatosBancariosTab />
          </div>
          <div hidden={activeTab !== 'tienda-contacto'}>
            <TiendaContactoTab />
          </div>
        </div>
      </div>
    </>
  );
}
