"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryData } from './types';
import { CategorySection } from './CategorySection';
import { useRouter } from 'next/navigation';

interface ShopDesktopSubmenuProps {
    isOpen: boolean;
    categories: CategoryData | null;
    categoriesLoading: boolean;
    onCategoryClick: (type: 'rubro' | 'subrubro' | 'genero', value: string) => void;
    onClose: () => void;
}

/**
 * Componente Submenú Desktop de Shop
 * Responsabilidad: Renderizar el submenú horizontal de categorías para desktop
 */
export const ShopDesktopSubmenu: React.FC<ShopDesktopSubmenuProps> = ({
    isOpen,
    categories,
    categoriesLoading,
    onCategoryClick,
    onClose
}) => {
    const router = useRouter();

    const hasCategories = categories && 
        Array.isArray(categories.rubros) && 
        Array.isArray(categories.subrubros) && 
        Array.isArray(categories.generos) && 
        (categories.rubros.length > 0 || categories.subrubros.length > 0 || categories.generos.length > 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50"
                    style={{ top: '100%' }}
                >
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
                        {categoriesLoading ? (
                            <div className="text-center py-4 text-gray-500 text-sm">Cargando categorías...</div>
                        ) : hasCategories ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {categories?.generos && categories.generos.length > 0 && (
                                        <CategorySection
                                            title="GÉNERO"
                                            items={categories.generos}
                                            onItemClick={(value) => onCategoryClick('genero', value)}
                                            type="genero"
                                        />
                                    )}

                                    {categories?.rubros && categories.rubros.length > 0 && (
                                        <CategorySection
                                            title="RUBROS"
                                            items={categories.rubros}
                                            onItemClick={(value) => onCategoryClick('rubro', value)}
                                            type="rubro"
                                        />
                                    )}

                                    {categories?.subrubros && categories.subrubros.length > 0 && (
                                        <CategorySection
                                            title="CATEGORÍAS"
                                            items={categories.subrubros}
                                            onItemClick={(value) => onCategoryClick('subrubro', value)}
                                            type="subrubro"
                                            hasMaxHeight
                                        />
                                    )}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                                    <button
                                        onClick={() => {
                                            router.push('/shoponline');
                                            onClose();
                                        }}
                                        className="px-4 py-2 text-xs font-semibold text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white rounded transition-all duration-200"
                                    >
                                        VER TODO
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                {categoriesLoading ? (
                                    'Cargando categorías...'
                                ) : (
                                    <>
                                        No hay categorías disponibles
                                        {process.env.NODE_ENV === 'development' && (
                                            <div className="mt-2 text-xs text-gray-400">
                                                Debug: rubros={categories?.rubros?.length || 0}, 
                                                subrubros={categories?.subrubros?.length || 0}, 
                                                generos={categories?.generos?.length || 0}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

