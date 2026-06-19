import type { AdminPedidoDetalle } from '@/app/types/adminPedidoDetalle.types';
import type { WebPedidoActions } from '@/app/utils/pedidoWebActions';

export interface PedidoDetailActionHandlers {
  confirmWeb: () => void;
  aprobarSfactory: () => void;
  reintentar: () => void;
  sync: () => void;
  reject: () => void;
  crearEnvioPostal: () => void;
  enviarListoRetiro: () => void;
  marcarRetirado: () => void;
}

export interface PedidoWebDetalleViewProps {
  pedido: AdminPedidoDetalle;
  actions: WebPedidoActions;
  busy: boolean;
  motivoRechazo: string;
  onMotivoChange: (value: string) => void;
  handlers: PedidoDetailActionHandlers;
  onOpenTracking: () => void;
  onDownloadLabel: () => void;
  isDownloadingLabel: boolean;
}
