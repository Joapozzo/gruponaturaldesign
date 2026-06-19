'use client';

import Button from '@/components/ui/Button';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';
import type { PedidoDetailActionHandlers } from '../pedidoDetail.types';

interface PedidoDetailActionBarProps {
  actions: WebPedidoActions;
  busy: boolean;
  handlers: PedidoDetailActionHandlers;
}

type ButtonVariant =
  | 'primary'
  | 'black'
  | 'blackOutline'
  | 'grayOutline'
  | 'redOutline';

interface ActionItem {
  id: string;
  show: boolean;
  label: string;
  busyLabel?: string;
  variant: ButtonVariant;
  onClick: () => void;
}

export function PedidoDetailActionBar({ actions, busy, handlers }: PedidoDetailActionBarProps) {
  const primaryActions: ActionItem[] = [
    {
      id: 'confirm',
      show: actions.canConfirmWeb,
      label: actions.confirmLabel,
      busyLabel: 'Procesando...',
      variant: 'primary',
      onClick: handlers.confirmWeb,
    },
    {
      id: 'aprobar-sfactory',
      show: actions.canAprobarEnSfactory,
      label: 'Aprobar en SFactory',
      busyLabel: 'Procesando...',
      variant: 'primary',
      onClick: handlers.aprobarSfactory,
    },
    {
      id: 'crear-envio',
      show: actions.canCrearEnvioPostal,
      label: actions.crearEnvioPostalLabel,
      busyLabel: 'Procesando...',
      variant: 'black',
      onClick: handlers.crearEnvioPostal,
    },
    {
      id: 'reject',
      show: actions.canReject,
      label: 'Rechazar / cancelar',
      variant: 'redOutline',
      onClick: handlers.reject,
    },
  ];

  const secondaryActions: ActionItem[] = [
    {
      id: 'reintentar',
      show: actions.canReintentarSfactory,
      label: 'Reintentar envío a SFactory',
      variant: 'blackOutline',
      onClick: handlers.reintentar,
    },
    {
      id: 'enviar-aviso',
      show: actions.canEnviarListoRetiro,
      label: 'Enviar aviso: listo para retirar',
      variant: 'blackOutline',
      onClick: handlers.enviarListoRetiro,
    },
    {
      id: 'marcar-retirado',
      show: actions.canMarcarRetirado,
      label: 'Marcar como retirado',
      variant: 'grayOutline',
      onClick: handlers.marcarRetirado,
    },
    {
      id: 'sync',
      show: actions.canSyncSfactory,
      label: 'Sincronizar estado',
      variant: 'grayOutline',
      onClick: handlers.sync,
    },
  ];

  const visibleActions = [
    ...primaryActions.filter((a) => a.show),
    ...secondaryActions.filter((a) => a.show),
  ];

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant}
          disabled={busy}
          onClick={action.onClick}
        >
          {busy && action.busyLabel ? action.busyLabel : action.label}
        </Button>
      ))}
    </div>
  );
}
