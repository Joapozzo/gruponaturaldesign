import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { FilterState } from '../hooks/useCatalogFilters';

interface SortFilterProps {
    sortBy: FilterState['sortBy'];
    onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onUpdateFilter }) => {
    return (
        <div>
            <h3 className="text-xs sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-2 uppercase tracking-wide">
                Ordenar por
            </h3>
            <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                <select
                    value={sortBy}
                    onChange={(e) => onUpdateFilter('sortBy', e.target.value as FilterState['sortBy'])}
                    className="w-full pl-9 pr-8 py-2 sm:py-2 text-xs sm:text-xs border border-gray-200 focus:border-gray-500 outline-none transition-colors bg-white rounded-lg text-gray-900 appearance-none cursor-pointer"
                >
                    <option value="alfabetico-asc">A - Z</option>
                    <option value="alfabetico-desc">Z - A</option>
                    <option value="precio-asc">Precio: Menor a mayor</option>
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
    );
};

export default SortFilter;

