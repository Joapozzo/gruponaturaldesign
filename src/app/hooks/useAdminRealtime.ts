'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { realtimeService } from '@/app/services/realtime.service';
import { dashboardKeys } from '@/app/utils/dashboardKeys';
import { pedidosKeys } from '@/app/utils/pedidosKeys';
import { adminNotificationsKeys } from '@/app/hooks/useAdminNotifications';
import type { AdminNotification } from '@/app/types/admin-notification.types';

function shouldToast(notification: AdminNotification): boolean {
  return notification.severity === 'warning' || notification.severity === 'error';
}

export function useAdminRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;

    realtimeService
      .connect()
      .then((socket) => {
        if (!mounted) return;

        const onNotification = (notification: AdminNotification) => {
          queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
          queryClient.invalidateQueries({ queryKey: pedidosKeys.all });
          queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.all });

          if (shouldToast(notification)) {
            const show = notification.severity === 'error' ? toast.error : toast;
            show(notification.title, { duration: 6000 });
          }
        };

        socket.on('admin.notification.created', onNotification);
        cleanup = () => socket.off('admin.notification.created', onNotification);
      })
      .catch((error) => {
        console.warn('[admin-realtime] No se pudo conectar Socket.IO:', error);
      });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [queryClient]);
}

