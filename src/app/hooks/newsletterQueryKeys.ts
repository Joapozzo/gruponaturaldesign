export const newsletterAdminKeys = {
  all: ['newsletter-admin'] as const,
  subscribers: () => [...newsletterAdminKeys.all, 'subscribers'] as const,
  emailLogs: () => [...newsletterAdminKeys.all, 'emailLogs'] as const,
};