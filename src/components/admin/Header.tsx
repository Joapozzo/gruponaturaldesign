'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';
import { UserMenu } from '@/app/components/navbar/UserMenu';
import { AdminSearchField } from '@/app/components/admin/AdminSearchField';
import {
  useAdminNotificationActions,
  useAdminNotifications,
  useAdminUnreadNotificationsCount,
} from '@/app/hooks/useAdminNotifications';
import type { AdminNotification } from '@/app/types/admin-notification.types';

function formatNotificationTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
}

function severityClass(notification: AdminNotification): string {
  if (notification.severity === 'error') return 'border-l-[#Ed3237]';
  if (notification.severity === 'warning') return 'border-l-amber-500';
  if (notification.severity === 'success') return 'border-l-emerald-500';
  return 'border-l-neutral-300';
}

export default function Header() {
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { data: notifications = [], isLoading } = useAdminNotifications({ limit: 10 });
  const { data: unreadCount = 0 } = useAdminUnreadNotificationsCount();
  const { markRead, markAllRead } = useAdminNotificationActions();

  const openNotification = async (notification: AdminNotification) => {
    if (!notification.readAt) {
      markRead.mutate(notification.id);
    }
    setShowNotifications(false);

    const pedidoId =
      notification.payload?.pedidoId ??
      (notification.entityType === 'pedido' ? notification.entityId : null);
    if (pedidoId != null) {
      router.push(`/admin/pedidos?search=${encodeURIComponent(String(pedidoId))}`);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-30 shadow-sm transition-all duration-300',
        isCollapsed ? 'lg:left-20' : 'lg:left-64'
      )}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex-1 hidden lg:block" />

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <AdminSearchField />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Buscar"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="w-5 h-5 text-neutral-600" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#Ed3237] text-white text-[10px] font-semibold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-4 border-b border-neutral-200 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-neutral-900">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllRead.mutate()}
                          disabled={markAllRead.isPending}
                          className="text-xs font-medium text-neutral-700 hover:text-black disabled:opacity-50"
                        >
                          Marcar todas
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-8 text-center text-neutral-500 text-sm">
                          Cargando notificaciones...
                        </div>
                      ) : notifications.length > 0 ? (
                        <ul className="divide-y divide-neutral-200">
                          {notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className={cn(
                                'border-l-4 transition-colors flex items-stretch',
                                severityClass(notification),
                                notification.readAt ? 'bg-white' : 'bg-neutral-50'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => openNotification(notification)}
                                className="min-w-0 flex-1 text-left p-4 hover:bg-neutral-100 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-2">
                                      {formatNotificationTime(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.readAt && (
                                    <span className="mt-1 w-2 h-2 shrink-0 rounded-full bg-[#Ed3237]" />
                                  )}
                                </div>
                              </button>
                              {!notification.readAt && (
                                <button
                                  type="button"
                                  onClick={() => markRead.mutate(notification.id)}
                                  disabled={markRead.isPending}
                                  className="w-10 shrink-0 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 disabled:opacity-50"
                                  aria-label="Marcar como leída"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center text-neutral-500 text-sm">
                          No hay notificaciones
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div onClick={() => setShowNotifications(false)}>
            <UserMenu />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="fixed inset-x-0 top-0 z-50 bg-white border-b border-neutral-200 p-4 md:hidden shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <AdminSearchField autoFocus />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100"
                  aria-label="Cerrar búsqueda"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
