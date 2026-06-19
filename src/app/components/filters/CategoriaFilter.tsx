import React from 'react';
import { FilterState } from '../hooks/useCatalogFilters';

interface CategoriaFilterProps {
    categoriaOptions: Array<{ value: string; label: string }>;
    selectedValue: string;
    onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const CategoriaFilter: React.FC<CategoriaFilterProps> = ({ categoriaOptions, selectedValue, onUpdateFilter }) => {
    if (categoriaOptions.length <= 1) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xs sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-2 uppercase tracking-wide">
                Categoría
            </h3>
            <div className="space-y-2 sm:space-y-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                {categoriaOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center space-x-2 sm:space-x-2 p-2.5 sm:p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="subrubro"
                            checked={selectedValue === option.value}
                            onChange={() => onUpdateFilter('subrubro', option.value)}
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                        />
                        <span className="text-xs sm:text-xs font-medium text-gray-700 capitalize">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CategoriaFilter;

