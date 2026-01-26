"use client";
import React from 'react';

interface CategorySectionProps {
    title: string;
    items: string[];
    onItemClick: (value: string) => void;
    type: 'rubro' | 'subrubro' | 'genero';
    isMobile?: boolean;
    hasMaxHeight?: boolean;
}

/**
 * Componente de Sección de Categorías
 * Responsabilidad: Renderizar una sección de categorías (género, rubro o subrubro)
 */
export const CategorySection: React.FC<CategorySectionProps> = ({
    title,
    items,
    onItemClick,
    type,
    isMobile = false,
    hasMaxHeight = false
}) => {
    if (!items || items.length === 0) return null;

    if (isMobile) {
        return (
            <div className={title === 'GÉNERO' ? 'mb-4 sm:mb-5' : 'mb-3 sm:mb-4 border-t border-gray-200 pt-3 sm:pt-3.5'}>
                <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 sm:mb-2">
                    {title}
                </h3>
                <div className="overflow-x-auto -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex gap-2 sm:gap-2.5 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {items.map((item) => (
                            <button
                                key={item}
                                onClick={() => onItemClick(type === 'genero' ? item.toLowerCase() : item)}
                                className="flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[12px] text-gray-700 hover:text-[#Ed3237] hover:bg-white rounded transition-all duration-200 whitespace-nowrap border border-gray-200"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-1.5 border-b border-gray-200">
                {title}
            </h3>
            <div className={`flex flex-wrap gap-2 ${hasMaxHeight ? 'max-h-48 overflow-y-auto' : ''}`}>
                {items.map((item) => (
                    <button
                        key={item}
                        onClick={() => onItemClick(type === 'genero' ? item.toLowerCase() : item)}
                        className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-[#Ed3237] hover:bg-gray-50 rounded transition-all duration-200 whitespace-nowrap"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

