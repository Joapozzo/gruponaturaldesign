'use client';

import { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

export default function Header() {
  const { isCollapsed } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Nuevo pedido recibido', time: 'Hace 5 min' },
    { id: 2, title: 'Producto agotado', time: 'Hace 1 hora' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-30 shadow-sm transition-all duration-300",
        isCollapsed ? "lg:left-20" : "lg:left-64"
      )}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Breadcrumb/Título (vacío por ahora) */}
        <div className="flex-1 hidden lg:block">
          {/* Espacio para breadcrumb futuro */}
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar productos, pedidos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 text-neutral-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#Ed3237] rounded-full"></span>
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
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-4 border-b border-neutral-200">
                      <h3 className="font-semibold text-neutral-900">Notificaciones</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <ul className="divide-y divide-neutral-200">
                          {notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                            >
                              <p className="text-sm font-medium text-neutral-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">{notification.time}</p>
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

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Menú de usuario"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-700" />
              </div>
              <span className="hidden md:block text-sm font-medium text-neutral-700">
                Admin
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">Admin User</p>
                        <p className="text-xs text-neutral-500">admin@ntds.com</p>
                      </div>
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                        onClick={() => {
                          // Lógica de logout
                        }}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
