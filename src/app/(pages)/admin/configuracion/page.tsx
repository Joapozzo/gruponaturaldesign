'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { ConfiguracionTabBar, type ConfiguracionTabId } from '@/app/components/admin/configuracion/ConfiguracionTabBar';
import { PreciosTab } from '@/app/components/admin/configuracion/PreciosTab';
import { DatosBancariosTab } from '@/app/components/admin/configuracion/DatosBancariosTab';
import { ConfiguracionPageActions } from '@/app/components/admin/configuracion/ConfiguracionPageActions';
import { useAdminConfiguracionPageActions } from '@/app/hooks/useAdminConfiguracionPageActions';
import { usePrefetchConfiguracion } from '@/app/hooks/usePrefetchConfiguracion';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<ConfiguracionTabId>('precios');
  const { handleRefresh, isRefreshing } = useAdminConfiguracionPageActions();
  usePrefetchConfiguracion();

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Parámetros de precios y datos para transferencia / efectivo"
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

        <div className="max-w-2xl">
          <div hidden={activeTab !== 'precios'}>
            <PreciosTab />
          </div>
          <div hidden={activeTab !== 'datos-bancarios'}>
            <DatosBancariosTab />
          </div>
        </div>
      </div>
    </>
  );
}
