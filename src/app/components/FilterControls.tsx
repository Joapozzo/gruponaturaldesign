import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import Button from './ui/Button';
import { FilterState } from './hooks/useCatalogFilters';
import FilterModal from './FilterModal';

interface FilterControlsProps {
    filters: FilterState;
    availableOptions: {
        colores: string[];
        talles: string[];
    };
    totalProducts: number;
    showingFrom: number;
    showingTo: number;
    onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
    onToggleColor: (color: string) => void;
    onToggleTalle: (talle: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    rubros?: string[];
    subrubros?: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
    filters,
    availableOptions,
    totalProducts,
    showingFrom,
    showingTo,
    onUpdateFilter,
    onToggleColor,
    onToggleTalle,
    onClearFilters,
    hasActiveFilters,
    rubros = [],
    subrubros = [],
}) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const activeFiltersCount = 
        (filters.categoriaTipo !== 'TODOS' ? 1 : 0) +
        (filters.subrubro !== 'TODOS' ? 1 : 0) +
        (filters.genero !== 'TODOS' ? 1 : 0) +
        filters.colores.length +
        filters.talles.length +
        (filters.sortBy !== 'alfabetico-asc' ? 1 : 0);

    const getSortByLabel = (sortBy: FilterState['sortBy']): string => {
        switch (sortBy) {
            case 'alfabetico-asc':
                return 'A - Z';
            case 'alfabetico-desc':
                return 'Z - A';
            case 'precio-asc':
                return 'Precio: Menor a Mayor';
            case 'precio-desc':
                return 'Precio: Mayor a Menor';
            case 'destacados':
                return 'Destacados';
            default:
                return 'A - Z';
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8"
            >
                {/* Header con estadísticas */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Filtrar Productos</h3>
                        <p className="text-sm text-gray-600">
                            Mostrando {showingFrom}-{showingTo} de {totalProducts} productos
                        </p>
                    </div>

                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                variant="grayOutline"
                                size="sm"
                                onClick={onClearFilters}
                                className="inline-flex items-center space-x-2"
                            >
                                <X size={16} />
                                <span>Limpiar Filtros</span>
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Controles de búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={filters.searchTerm}
                                onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg placeholder-gray-400 text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Ordenar por */}
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ordenar por
                        </label>
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            <select
                                value={filters.sortBy}
                                onChange={(e) => onUpdateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="alfabetico-asc">A - Z</option>
                                <option value="alfabetico-desc">Z - A</option>
                                <option value="precio-asc">Precio: Menor a Mayor</option>
                                <option value="precio-desc">Precio: Mayor a Menor</option>
                                <option value="destacados">Destacados</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Botón de filtros */}
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
                            Filtros
                        </label>
                        <Button
                            variant="grayOutline"
                            size="md"
                            onClick={() => setIsFilterModalOpen(true)}
                            className="inline-flex items-center space-x-2 w-full sm:w-auto"
                        >
                            <Filter size={18} />
                            <span>Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-gray-900 text-white text-xs font-bold rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Filtros activos */}
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                    >
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>

                            {filters.searchTerm && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Búsqueda: &quot;{filters.searchTerm}&quot;
                                    <button
                                        onClick={() => onUpdateFilter('searchTerm', '')}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.categoriaTipo !== 'TODOS' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {filters.categoriaTipo}
                                    <button
                                        onClick={() => onUpdateFilter('categoriaTipo', 'TODOS')}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.subrubro !== 'TODOS' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                    {filters.subrubro}
                                    <button
                                        onClick={() => onUpdateFilter('subrubro', 'TODOS')}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.genero !== 'TODOS' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                    {filters.genero}
                                    <button
                                        onClick={() => onUpdateFilter('genero', 'TODOS')}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.colores.map((color) => (
                                <span
                                    key={color}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize"
                                >
                                    {color}
                                    <button
                                        onClick={() => onToggleColor(color)}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}

                            {filters.talles.map((talle) => (
                                <span
                                    key={talle}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                    Talle: {talle}
                                    <button
                                        onClick={() => onToggleTalle(talle)}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}

                            {filters.sortBy !== 'alfabetico-asc' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Orden: {getSortByLabel(filters.sortBy)}
                                    <button
                                        onClick={() => onUpdateFilter('sortBy', 'alfabetico-asc')}
                                        className="ml-2 hover:text-gray-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Modal de filtros */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                availableOptions={availableOptions}
                onUpdateFilter={onUpdateFilter}
                onToggleColor={onToggleColor}
                onToggleTalle={onToggleTalle}
                onClearFilters={onClearFilters}
                hasActiveFilters={hasActiveFilters}
                rubros={rubros}
                subrubros={subrubros}
            />
        </>
    );
};

export default FilterControls;