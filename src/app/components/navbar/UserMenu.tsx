"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useUserSession } from '../../hooks/useUserSession';


export const UserMenu: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isLoading, isAuthenticated } = useUserSession();

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center animate-pulse">
                <User className="w-4 h-4 text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                onMouseEnter={() => setShowUserMenu(true)}
                disabled={!isAuthenticated}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label={isAuthenticated ? "Menú de usuario" : "Iniciar sesión"}
            >
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center group-hover:bg-neutral-300 transition-colors">
                    <User className="w-4 h-4 text-neutral-700" />
                </div>
                {isAuthenticated ? (
                    <span className="hidden md:block text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                        {user?.name || user?.email || 'Usuario'}
                    </span>
                ) : (
                    <span className="hidden md:block text-sm font-medium text-neutral-700">
                        Iniciar sesión
                    </span>
                )}
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
                            onMouseLeave={() => setShowUserMenu(false)}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                        >
                            <div className="p-2">
                                {isAuthenticated ? (
                                    <>
                                        <div className="px-3 py-2 border-b border-neutral-200">
                                            <p className="text-sm font-medium text-neutral-900">
                                                {user?.name || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/auth/logout"
                                            className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors block"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Cerrar Sesión
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors block"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

