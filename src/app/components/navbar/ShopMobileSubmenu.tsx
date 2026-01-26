"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryData } from './types';
import { CategorySection } from './CategorySection';
import { useRouter } from 'next/navigation';

interface ShopMobileSubmenuProps {
    isOpen: boolean;
    categories: CategoryData | null;
    categoriesLoading: boolean;
    onCategoryClick: (type: 'rubro' | 'subrubro' | 'genero', value: string) => void;
    onClose: () => void;
    onMenuToggle?: () => void;
}

/**
 * Componente Submenú Mobile de Shop
 * Responsabilidad: Renderizar el submenú de categorías para mobile
 */
export const ShopMobileSubmenu: React.FC<ShopMobileSubmenuProps> = ({
    isOpen,
    categories,
    categoriesLoading,
    onCategoryClick,
    onClose,
    onMenuToggle
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
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="pl-4 sm:pl-5 pr-3 py-2.5 sm:py-3 bg-gray-50 rounded-lg mt-1.5">
                        {categoriesLoading ? (
                            <div className="text-center py-3 sm:py-4 text-gray-500 text-sm sm:text-base">Cargando categorías...</div>
                        ) : hasCategories ? (
                            <>
                                {categories?.generos && categories.generos.length > 0 && (
                                    <CategorySection
                                        title="GÉNERO"
                                        items={categories.generos}
                                        onItemClick={(value) => onCategoryClick('genero', value)}
                                        type="genero"
                                        isMobile
                                    />
                                )}

                                {categories?.rubros && categories.rubros.length > 0 && (
                                    <CategorySection
                                        title="RUBROS"
                                        items={categories.rubros}
                                        onItemClick={(value) => onCategoryClick('rubro', value)}
                                        type="rubro"
                                        isMobile
                                    />
                                )}

                                {categories?.subrubros && categories.subrubros.length > 0 && (
                                    <CategorySection
                                        title="CATEGORÍAS"
                                        items={categories.subrubros}
                                        onItemClick={(value) => onCategoryClick('subrubro', value)}
                                        type="subrubro"
                                        isMobile
                                    />
                                )}

                                <div className="border-t border-gray-200 pt-3 sm:pt-3.5">
                                    <button
                                        onClick={() => {
                                            router.push('/shoponline');
                                            onClose();
                                            if (onMenuToggle) onMenuToggle();
                                        }}
                                        className="w-full text-center px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-semibold text-[#Ed3237] hover:bg-[#Ed3237] hover:text-white rounded transition-all duration-200"
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

