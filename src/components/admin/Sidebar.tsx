'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge: number | null;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    badge: null,
  },
  {
    name: 'Productos',
    icon: Package,
    href: '/admin/productos',
    badge: null,
  },
  {
    name: 'Pedidos',
    icon: ShoppingCart,
    href: '/admin/pedidos',
    badge: 5,
  },
  {
    name: 'Clientes',
    icon: Users,
    href: '/admin/clientes',
    badge: null,
  },
];

interface SidebarProps {}

export default function Sidebar({}: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        style={{ backgroundColor: '#FFFFFF' }}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6 text-[#000000]" />
      </button>

      {/* Backdrop Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 shadow-sm',
          'flex flex-col',
          'lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 flex-1"
              >
                <Link href="/admin" className="flex items-center gap-3">
                  <Image
                    src="/logos/logo-1.svg"
                    alt="NTDS Natural Design Logo"
                    width={50}
                    height={22}
                    className="object-contain"
                    priority
                  />
                  <span className="font-semibold text-sm text-[#000000] tracking-wide">ADMIN</span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full"
              >
                <Link href="/admin">
                  <Image
                    src="/logos/logo-1.svg"
                    alt="NTDS Logo"
                    width={40}
                    height={18}
                    className="object-contain mx-auto"
                    priority
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[#000000] hover:text-[#Ed3237]"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={closeMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-[#000000] hover:text-[#Ed3237]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              // Lógica especial para Dashboard: solo activo en /admin o /admin/
              let isActive = false;
              if (item.href === '/admin') {
                // Dashboard solo activo cuando el path es exactamente /admin o /admin/
                isActive = pathname === '/admin' || pathname === '/admin/';
              } else {
                // Para otras rutas, activo cuando coincide exactamente o empieza con la ruta + /
                isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              }
              
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300',
                      'text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50',
                      isActive && 'text-[#Ed3237] bg-gray-50 font-semibold',
                      isCollapsed && 'justify-center relative'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors duration-300',
                      isActive ? 'text-[#Ed3237]' : 'text-[#000000]'
                    )} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 flex items-center justify-between text-xs font-medium tracking-wide"
                        >
                          <span>{item.name.toUpperCase()}</span>
                          {item.badge !== null && (
                            <span className="bg-[#Ed3237] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                              {item.badge}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isCollapsed && item.badge !== null && (
                      <span className="absolute -top-1 -right-1 bg-[#Ed3237] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <span className="text-[#000000] font-semibold text-xs">AD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#000000] truncate tracking-wide">Admin User</p>
                    <p className="text-xs text-gray-500 truncate">Administrador</p>
                  </div>
                </div>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50 transition-all duration-300 text-xs font-medium tracking-wide"
                  onClick={() => {
                    // Aquí iría la lógica de logout
                    console.log('Logout');
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>CERRAR SESIÓN</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-[#000000] font-semibold text-xs">AD</span>
                </div>
                <button
                  className="p-2 rounded-lg text-[#000000] hover:text-[#Ed3237] hover:bg-gray-50 transition-all duration-300"
                  onClick={() => {
                    // Aquí iría la lógica de logout
                    console.log('Logout');
                  }}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
