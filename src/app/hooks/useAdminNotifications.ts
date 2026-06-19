import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminNotificationsService } from '@/app/services/adminNotifications.service';
import type { AdminNotificationListParams } from '@/app/types/admin-notification.types';

export const adminNotificationsKeys = {
  all: ['admin-notifications'] as const,
  lists: () => [...adminNotificationsKeys.all, 'list'] as const,
  list: (params?: AdminNotificationListParams) =>
    [...adminNotificationsKeys.lists(), params ?? null] as const,
  unreadCount: () => [...adminNotificationsKeys.all, 'unread-count'] as const,
};

export function useAdminNotifications(params?: AdminNotificationListParams) {
  return useQuery({
    queryKey: adminNotificationsKeys.list(params),
    queryFn: () => adminNotificationsService.list(params),
    staleTime: 1000 * 30,
  });
}

export function useAdminUnreadNotificationsCount() {
  return useQuery({
    queryKey: adminNotificationsKeys.unreadCount(),
    queryFn: () => adminNotificationsService.unreadCount(),
    staleTime: 1000 * 20,
  });
}

export function useAdminNotificationActions() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.all });
  };

  const markRead = useMutation({
    mutationFn: (id: number) => adminNotificationsService.markRead(id),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: () => adminNotificationsService.markAllRead(),
    onSuccess: invalidate,
  });

  return { markRead, markAllRead };
}

