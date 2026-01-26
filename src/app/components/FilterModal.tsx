import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { FilterState } from './hooks/useCatalogFilters';
import { sortSizes } from '../utils/productHelpers';
import SortFilter from './filters/SortFilter';
import RubroFilter from './filters/RubroFilter';
import CategoriaFilter from './filters/CategoriaFilter';
import GeneroFilter from './filters/GeneroFilter';
import ColorFilter from './filters/ColorFilter';
import TalleFilter from './filters/TalleFilter';
import FilterActions from './filters/FilterActions';

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
    // Categorías dinámicas (tipo de prenda = subrubros) - siempre incluir TODOS
    const categoriaOptions = ['TODOS', ...subrubros].filter((value, index, self) => 
        index === self.indexOf(value) // Remover duplicados
    );
    
    // Ordenar colores alfabéticamente
    const sortedColores = useMemo(() => {
        return [...availableOptions.colores].sort((a, b) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
    }, [availableOptions.colores]);
    
    // Ordenar talles de Menor a mayor usando la función sortSizes
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
                        className="fixed left-0 top-0 h-full w-full sm:max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 pt-[24px] lg:pt-[24px]">
                            <div className="flex items-center justify-between p-4 sm:p-4">
                                <div className="flex items-center space-x-2 sm:space-x-2">
                                    <Filter className="w-4 h-4 sm:w-4 sm:h-4 text-gray-700" />
                                    <h2 className="text-base sm:text-base font-bold text-gray-900">Filtrar por</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 sm:w-4 sm:h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                            <SortFilter
                                sortBy={filters.sortBy}
                                onUpdateFilter={onUpdateFilter}
                            />

                            <RubroFilter
                                rubros={rubros}
                                categoriaTipo={filters.categoriaTipo}
                                onUpdateFilter={onUpdateFilter}
                            />

                            <CategoriaFilter
                                categoriaOptions={categoriaOptions}
                                subrubro={filters.subrubro}
                                onUpdateFilter={onUpdateFilter}
                            />

                            <GeneroFilter
                                genero={filters.genero}
                                onUpdateFilter={onUpdateFilter}
                            />

                            <ColorFilter
                                colores={sortedColores}
                                selectedColores={filters.colores}
                                onToggleColor={onToggleColor}
                            />

                            <TalleFilter
                                talles={sortedTalles}
                                selectedTalles={filters.talles}
                                onToggleTalle={onToggleTalle}
                            />

                            <FilterActions
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={onClearFilters}
                                onClose={onClose}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterModal;

