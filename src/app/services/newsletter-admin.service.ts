import { apiClient } from '@/lib/apiClient';

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface EmailLog {
  id: string;
  type: string;
  to: string;
  status: string;
  messageId: string | null;
  createdAt: string;
}

export interface NewsletterPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubscribersResponse {
  data: Subscriber[];
  pagination: NewsletterPagination;
}

export interface EmailLogsResponse {
  data: EmailLog[];
  pagination: NewsletterPagination;
}

function unwrap<T>(value: T | undefined, fallbackMessage: string): T {
  if (value == null) throw new Error(fallbackMessage);
  return value;
}

export const newsletterAdminService = {
  async getSubscribers(params: {
    page?: number;
    limit?: number;
    active?: boolean | 'all';
  }): Promise<SubscribersResponse> {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    if (typeof params.active === 'boolean') qs.set('active', String(params.active));

    const res = await apiClient.get<SubscribersResponse>(
      `/admin/newsletter/subscribers?${qs.toString()}`
    );
    if (!res.success) throw new Error(res.message || 'Error');
    return unwrap(res.data, 'Error al obtener suscriptores');
  },

  async getEmailLogs(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<EmailLogsResponse> {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.type) qs.set('type', params.type);
    if (params.status) qs.set('status', params.status);

    const res = await apiClient.get<EmailLogsResponse>(
      `/admin/newsletter/email-logs?${qs.toString()}`
    );
    if (!res.success) throw new Error(res.message || 'Error');
    return unwrap(res.data, 'Error al obtener historial de emails');
  },

  async sendNewsletter(data: {
    subject: string;
    htmlBody: string;
    recipientList?: string[];
  }) {
    const res = await apiClient.post('/admin/newsletter/send', {
      subject: data.subject,
      content: data.htmlBody,
      recipientList: data.recipientList,
    });
    if (!res.success) throw new Error(res.message || res.error || 'Error');
    return res.data as { messageId?: string; recipients?: number } | undefined;
  },
};
