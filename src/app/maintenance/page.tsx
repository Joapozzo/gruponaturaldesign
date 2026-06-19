import type { Metadata } from 'next';
import MaintenanceScreen from '../components/maintenance/MaintenanceScreen';
import type { MaintenanceUiScope } from '@/lib/maintenance-mode';

export const metadata: Metadata = {
  title: 'Mantenimiento | GND',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ scope?: string }>;
};

function parseScope(scope: string | undefined): MaintenanceUiScope {
  return scope === 'admin' ? 'admin' : 'public';
}

export default async function MaintenancePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const uiScope = parseScope(params.scope);
  return <MaintenanceScreen scope={uiScope} />;
}
