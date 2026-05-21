import { apiClient } from '@/lib/apiClient';
import type {
  AdminNotification,
  AdminNotificationListParams,
} from '@/app/types/admin-notification.types';

function buildQuery(params?: AdminNotificationListParams): string {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set('limit', String(params.limit));
  if (params?.unreadOnly) search.set('unreadOnly', 'true');
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

class AdminNotificationsService {
  async list(params?: AdminNotificationListParams): Promise<AdminNotification[]> {
    const res = await apiClient.get<AdminNotification[]>(
      `/admin/notifications${buildQuery(params)}`
    );
    return res.data ?? [];
  }

  async unreadCount(): Promise<number> {
    const res = await apiClient.get<{ count: number }>('/admin/notifications/unread-count');
    return res.data?.count ?? 0;
  }

  async markRead(id: number): Promise<void> {
    await apiClient.patch(`/admin/notifications/${id}/read`, {});
  }

  async markAllRead(): Promise<void> {
    await apiClient.patch('/admin/notifications/read-all', {});
  }
}

export const adminNotificationsService = new AdminNotificationsService();

