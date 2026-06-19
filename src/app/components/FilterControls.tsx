import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Select from './ui/Select';
import SearchInput from './ui/SearchInput';
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
    /** Opciones de subrubro con value=id para filtrar por subrubroId (sincronizado con API) */
    subrubroOptions?: Array<{ value: string; label: string }>;
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
    subrubroOptions = [],
}) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const subrubroLabel = filters.subrubro !== 'TODOS'
        ? (subrubroOptions.find((o) => o.value === filters.subrubro)?.label ?? filters.subrubro)
        : '';
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
                return 'Precio: Menor a mayor';
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
                className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm border border-gray-100 mb-3 sm:mb-4 lg:mb-6"
            >
                {/* Header con estadísticas */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-1.5 sm:mb-2 lg:mb-0">
                        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-0.5">Filtrar Productos</h3>
                        <p className="text-[10px] sm:text-xs text-gray-600" suppressHydrationWarning>
                            {mounted
                                ? `Mostrando ${showingFrom}-${showingTo} de ${totalProducts} productos`
                                : 'Mostrando — de — productos'}
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
                                size="xs"
                                onClick={onClearFilters}
                                className="inline-flex items-center space-x-2 mb-3"
                            >
                                <X size={14} />
                                <span>Limpiar filtros</span>
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Controles de búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-end">
                    {/* Botón de filtros */}
                    <div className="relative w-full sm:w-auto">
                        <label className="text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1 h-[14px] sm:h-[16px] flex items-end">
                            <span className="invisible">Filtros</span>
                        </label>
                        <Button
                            variant={activeFiltersCount > 0 ? 'ash' : 'ghost'}
                            size="md"
                            onClick={() => setIsFilterModalOpen(true)}
                            className="inline-flex items-center justify-center space-x-1 w-full sm:w-auto h-[32px] sm:h-[36px] text-[11px] sm:text-xs px-3 sm:px-4 rounded-sm"
                        >
                            <Filter size={12} />
                            {activeFiltersCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-gray-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>
                    {/* Búsqueda */}
                    <SearchInput
                        // label="Buscar"
                        placeholder="Buscar productos..."
                        value={filters.searchTerm}
                        onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
                        variant="lightGrayOutline"
                        size="sm"
                        fullWidth
                        leftIcon={<Search size={12} />}
                        showClearButton={false}
                        className="w-full sm:min-w-0"
                    />

                    {/* Ordenar por */}
                    <Select
                        label="Ordenar por"
                        options={[
                            { value: 'alfabetico-asc', label: 'A - Z' },
                            { value: 'alfabetico-desc', label: 'Z - A' },
                            { value: 'precio-asc', label: 'Precio: Menor a mayor' },
                            { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
                            { value: 'destacados', label: 'Destacados' },
                        ]}
                        value={filters.sortBy}
                        onChange={(e) => onUpdateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                        variant="lightGrayOutline"
                        size="sm"
                        fullWidth
                        leftIcon={<ArrowUpDown size={12} />}
                        className="w-full sm:w-auto"
                    />
                </div>

                {/* Filtros activos */}
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-1.5 sm:mt-2 lg:mt-3 pt-1.5 sm:pt-2 lg:pt-3 border-t border-gray-100"
                    >
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            <span className="text-[10px] sm:text-xs font-medium text-gray-600">Filtros activos:</span>

                            {filters.searchTerm && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800">
                                    Búsqueda: &quot;{filters.searchTerm}&quot;
                                    <button
                                        onClick={() => onUpdateFilter('searchTerm', '')}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            )}

                            {filters.categoriaTipo !== 'TODOS' && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800">
                                    {filters.categoriaTipo}
                                    <button
                                        onClick={() => onUpdateFilter('categoriaTipo', 'TODOS')}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            )}

                            {filters.subrubro !== 'TODOS' && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800 capitalize">
                                    {subrubroLabel}
                                    <button
                                        onClick={() => onUpdateFilter('subrubro', 'TODOS')}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            )}

                            {filters.genero !== 'TODOS' && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800 capitalize">
                                    {filters.genero}
                                    <button
                                        onClick={() => onUpdateFilter('genero', 'TODOS')}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            )}

                            {filters.colores.map((color) => (
                                <span
                                    key={color}
                                    className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800 capitalize"
                                >
                                    {color}
                                    <button
                                        onClick={() => onToggleColor(color)}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            ))}

                            {filters.talles.map((talle) => (
                                <span
                                    key={talle}
                                    className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800"
                                >
                                    Talle: {talle}
                                    <button
                                        onClick={() => onToggleTalle(talle)}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
                                    </button>
                                </span>
                            ))}

                            {filters.sortBy !== 'alfabetico-asc' && (
                                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-100 text-gray-800">
                                    Orden: {getSortByLabel(filters.sortBy)}
                                    <button
                                        onClick={() => onUpdateFilter('sortBy', 'alfabetico-asc')}
                                        className="ml-1 hover:text-gray-600"
                                    >
                                        <X size={9} />
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
                subrubroOptions={subrubroOptions}
            />
        </>
    );
};

export default FilterControls;