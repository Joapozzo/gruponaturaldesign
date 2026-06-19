'use client';

import { Wrench } from 'lucide-react';
import ErrorPageTemplate from '../ErrorPageTemplate';
import Button from '@/components/ui/Button';
import type { MaintenanceUiScope } from '@/lib/maintenance-mode';
import { getWhatsAppNumberForUrl } from '@/app/utils/constants';
import { WhatsApp } from '../logos/WhatsApp';

const COPY: Record<
  MaintenanceUiScope,
  { code: string; title: string; description: string }
> = {
  public: {
    code: '503',
    title: 'Sitio en mantenimiento',
    description:
      'Estamos realizando tareas de mejora. La tienda volverá a estar disponible en breve. Gracias por tu paciencia.',
  },
  admin: {
    code: '503',
    title: 'Panel en mantenimiento',
    description:
      'El panel de administración no está disponible temporalmente. Intentá nuevamente en unos minutos.',
  },
};

const WHATSAPP_MAINTENANCE_MESSAGE =
  'Hola, vi que el sitio está en mantenimiento y quiero hacer una consulta.';

function MaintenanceWhatsAppCta() {
  const openWhatsApp = () => {
    const url = `https://wa.me/${getWhatsAppNumberForUrl()}?text=${encodeURIComponent(WHATSAPP_MAINTENANCE_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant="black"
      size="lg"
      type="button"
      onClick={openWhatsApp}
      className="inline-flex items-center gap-2 w-full sm:w-auto"
      aria-label="Contactar por WhatsApp"
    >
      <span className="w-5 h-5 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5">
        <WhatsApp />
      </span>
      <span>Escribinos por WhatsApp</span>
    </Button>
  );
}

export default function MaintenanceScreen({
  scope,
}: {
  scope: MaintenanceUiScope;
}) {
  const { code, title, description } = COPY[scope];
  return (
    <ErrorPageTemplate
      code={code}
      title={title}
      description={description}
      icon={Wrench}
      showBackButton={false}
      showDefaultActions={false}
      actions={scope === 'public' ? <MaintenanceWhatsAppCta /> : undefined}
    />
  );
}
