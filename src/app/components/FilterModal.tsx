import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowUpDown } from 'lucide-react';
import { FilterState } from './hooks/useCatalogFilters';
import { getColorHex } from './product-card/utils/colorUtils';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    availableOptions: {
        colores: string[];
        talles: string[];
    };
    onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    onToggleColor: (color: string) => void;
    onToggleTalle: (talle: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    rubros?: string[];
    subrubros?: string[];
}

// La función getColorHex se importa de colorUtils.ts para mantener consistencia

/**
 * Orden estándar de talles en letras
 * IMPORTANTE: 2XS debe ir primero, luego XS, S, M, L, XL, 2XL, 3XL, 4XL
 */
const SIZE_ORDER: { [key: string]: number } = {
    '2xs': 1,      // 2XS debe ir primero
    'xxs': 1,      // XXS es lo mismo que 2XS
    'xs': 2,
    's': 3,
    'm': 4,
    'l': 5,
    'xl': 6,
    '2xl': 7,
    'xxl': 7,      // XXL es lo mismo que 2XL
    '3xl': 8,
    'xxxl': 8,     // XXXL es lo mismo que 3XL
    '4xl': 9,
    'xxxxl': 9,    // XXXXL es lo mismo que 4XL
    '5xl': 10,
};

/**
 * Función para normalizar el nombre del talle antes de buscar en SIZE_ORDER
 */
function normalizeSizeForOrder(size: string): string {
    const normalized = size.toLowerCase().trim();
    
    // Normalizar variantes comunes
    if (normalized === 'xxs') return '2xs';
    if (normalized === 'xxl') return '2xl';
    if (normalized === 'xxxl') return '3xl';
    if (normalized === 'xxxxl') return '4xl';
    
    return normalized;
}

/**
 * Función para ordenar talles de manera lógica
 * - Números: de menor a mayor (36, 38, 40, 42)
 * - Letras: orden estándar (2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl)
 */
function sortSizes(sizes: string[]): string[] {
    return [...sizes].sort((a, b) => {
        const aLower = a.toLowerCase().trim();
        const bLower = b.toLowerCase().trim();

        // Verificar si ambos son números puros
        const aIsNumber = /^\d+$/.test(aLower);
        const bIsNumber = /^\d+$/.test(bLower);

        // Si ambos son números, ordenar numéricamente
        if (aIsNumber && bIsNumber) {
            return parseInt(aLower, 10) - parseInt(bLower, 10);
        }

        // Si uno es número y el otro no, los números van primero
        if (aIsNumber && !bIsNumber) return -1;
        if (!aIsNumber && bIsNumber) return 1;

        // Si ambos son letras, normalizar y usar el orden predefinido
        const aNormalized = normalizeSizeForOrder(aLower);
        const bNormalized = normalizeSizeForOrder(bLower);
        
        const aOrder = SIZE_ORDER[aNormalized] || 999;
        const bOrder = SIZE_ORDER[bNormalized] || 999;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        // Si no está en el orden predefinido, ordenar alfabéticamente
        return aLower.localeCompare(bLower);
    });
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    filters,
    availableOptions,
    onUpdateFilter,
    onToggleColor,
    onToggleTalle,
    onClearFilters,
    hasActiveFilters,
    rubros = [],
    subrubros = [],
}) => {
    // Valores dinámicos para categorías (siempre incluir TODOS, BASIC y WORKWEAR)
    // Los rubros ya vienen normalizados como 'WORKWEAR' o 'BASIC'
    const defaultCategorias = ['TODOS', 'BASIC', 'WORKWEAR'];
    const categoriaOptions = [...defaultCategorias, ...rubros].filter((value, index, self) => 
        index === self.indexOf(value) // Remover duplicados
    );
    
    // Valores dinámicos para subrubros (siempre incluir TODOS)
    const subrubroOptions = ['TODOS', ...subrubros].filter((value, index, self) => 
        index === self.indexOf(value) // Remover duplicados
    );
    
    // Ordenar colores alfabéticamente
    const sortedColores = useMemo(() => {
        return [...availableOptions.colores].sort((a, b) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
    }, [availableOptions.colores]);
    
    // Ordenar talles de menor a mayor usando la función sortSizes
    const sortedTalles = useMemo(() => {
        return sortSizes(availableOptions.talles);
    }, [availableOptions.talles]);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 pt-[24px] lg:pt-[24px]">
                            <div className="flex items-center justify-between p-3 sm:p-4">
                                <div className="flex items-center space-x-1.5 sm:space-x-2">
                                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                    <h2 className="text-sm sm:text-base font-bold text-gray-900">Filtrar por</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {/* Ordenar por */}
                            <div>
                                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                    Ordenar por
                                </h3>
                                <div className="relative">
                                    <ArrowUpDown className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => onUpdateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                                        className="w-full pl-7 pr-7 py-1.5 sm:py-2 text-[10px] sm:text-xs border border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg text-gray-900 appearance-none cursor-pointer"
                                    >
                                        <option value="alfabetico-asc">A - Z</option>
                                        <option value="alfabetico-desc">Z - A</option>
                                        <option value="precio-asc">Precio: Menor a Mayor</option>
                                        <option value="precio-desc">Precio: Mayor a Menor</option>
                                        <option value="destacados">Destacados</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Categoría Tipo */}
                            <div>
                                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                    Categoría
                                </h3>
                                <div className="space-y-1 sm:space-y-1.5">
                                    {categoriaOptions.map((tipo) => (
                                        <label
                                            key={tipo}
                                            className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="categoriaTipo"
                                                checked={filters.categoriaTipo === tipo}
                                                onChange={() => onUpdateFilter('categoriaTipo', tipo)}
                                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                                            />
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                                                {tipo === 'TODOS' ? 'Todas' : tipo}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Subrubro */}
                            {subrubroOptions.length > 1 && (
                                <div>
                                    <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                        Tipo de Prenda
                                    </h3>
                                    <div className="space-y-1 sm:space-y-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                                        {subrubroOptions.map((subrubro) => (
                                            <label
                                                key={subrubro}
                                                className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="subrubro"
                                                    checked={filters.subrubro === subrubro}
                                                    onChange={() => onUpdateFilter('subrubro', subrubro)}
                                                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                                                />
                                                <span className="text-[10px] sm:text-xs font-medium text-gray-700 capitalize">
                                                    {subrubro === 'TODOS' ? 'Todos' : subrubro}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Género */}
                            <div>
                                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                    Género
                                </h3>
                                <div className="space-y-1 sm:space-y-1.5">
                                    {(['dama', 'hombre', 'unisex', 'TODOS'] as const).map((genero) => (
                                        <label
                                            key={genero}
                                            className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="genero"
                                                checked={filters.genero === genero}
                                                onChange={() => onUpdateFilter('genero', genero)}
                                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                                            />
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-700 capitalize">
                                                {genero === 'TODOS' ? 'Todos' : genero}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colores */}
                            {sortedColores.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                        Color
                                    </h3>
                                    <div className="grid grid-cols-2 gap-1 sm:gap-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                                        {sortedColores.map((color) => {
                                            const isSelected = filters.colores.includes(color);
                                            return (
                                                <label
                                                    key={color}
                                                    className={`flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 border rounded-lg transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => onToggleColor(color)}
                                                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                                                    />
                                                    <div
                                                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border border-gray-300"
                                                        style={{ backgroundColor: getColorHex(color) }}
                                                    />
                                                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 flex-1 capitalize">
                                                        {color}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Talles */}
                            {sortedTalles.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                        Talle
                                    </h3>
                                    <div className="grid grid-cols-4 gap-1 sm:gap-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                                        {sortedTalles.map((talle) => {
                                            const isSelected = filters.talles.includes(talle);
                                            return (
                                                <label
                                                    key={talle}
                                                    className={`flex items-center justify-center p-1.5 sm:p-2 border rounded-lg transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? 'border-gray-900 bg-gray-900 text-white'
                                                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => onToggleTalle(talle)}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-[10px] sm:text-xs font-medium">
                                                        {talle}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-3 sm:pt-4 pb-3 sm:pb-4 px-3 sm:px-4 space-y-1 sm:space-y-1.5">
                                {hasActiveFilters && (
                                    <button
                                        onClick={onClearFilters}
                                        className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-[10px] sm:text-xs border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full py-1.5 sm:py-2 px-2 sm:px-3 text-[10px] sm:text-xs bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterModal;

