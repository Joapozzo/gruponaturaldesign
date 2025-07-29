// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Star, SortAsc } from 'lucide-react';
import { CategoriaIndumentaria } from '../types/producto'
import Button from './ui/Button';
import { FilterState } from './hooks/useCatalogFilters';

interface FilterControlsProps {
    filters: FilterState;
    availableCategories: CategoriaIndumentaria[];
    totalProducts: number;
    showingFrom: number;
    showingTo: number;
    onUpdateFilter: (key: keyof FilterState, value: string | boolean) => void;
    onClearFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
    filters,
    availableCategories,
    totalProducts,
    showingFrom,
    showingTo,
    onUpdateFilter,
    onClearFilters,
}) => {
    const hasActiveFilters =
        filters.searchTerm ||
        filters.selectedCategory !== 'TODOS' ||
        filters.onlyFeatured ||
        filters.sortBy !== 'alfabetico';

    return (
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

            {/* Controles de filtro */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="relative">
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

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                    </label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={filters.selectedCategory}
                            onChange={(e) => onUpdateFilter('selectedCategory', e.target.value as CategoriaIndumentaria | 'TODOS')}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg text-gray-900 appearance-none cursor-pointer"
                        >
                            <option value="TODOS">Todas las categorías</option>
                            {availableCategories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ordenamiento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordenar por
                    </label>
                    <div className="relative">
                        <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={filters.sortBy}
                            onChange={(e) => onUpdateFilter('sortBy', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg text-gray-900 appearance-none cursor-pointer"
                        >
                            <option value="alfabetico">Alfabético</option>
                            <option value="categoria">Categoría</option>
                            <option value="destacados">Destacados primero</option>
                        </select>
                    </div>
                </div>

                {/* Filtro destacados */}
                <div className="flex flex-col justify-end">
                    <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.onlyFeatured}
                            onChange={(e) => onUpdateFilter('onlyFeatured', e.target.checked)}
                            className="w-4 h-4 text-gray-600 accent-gray-600 rounded"
                        />
                        <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                            <span className="text-sm font-medium text-gray-700">Solo Destacados</span>
                        </div>
                    </label>
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
                            // eslint-disable-next-line react/no-unescaped-entities
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

                        {filters.selectedCategory !== 'TODOS' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {filters.selectedCategory}
                                <button
                                    onClick={() => onUpdateFilter('selectedCategory', 'TODOS')}
                                    className="ml-2 hover:text-gray-600"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        )}

                        {filters.onlyFeatured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star size={12} className="mr-1" fill="currentColor" />
                                Destacados
                                <button
                                    onClick={() => onUpdateFilter('onlyFeatured', false)}
                                    className="ml-2 hover:text-yellow-600"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        )}

                        {filters.sortBy !== 'alfabetico' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Orden: {filters.sortBy === 'categoria' ? 'Categoría' : 'Destacados'}
                                <button
                                    onClick={() => onUpdateFilter('sortBy', 'alfabetico')}
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
    );
};

export default FilterControls;