import React from 'react';
import { FilterState } from '../hooks/useCatalogFilters';

interface GeneroFilterProps {
    genero: FilterState['genero'];
    onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const GeneroFilter: React.FC<GeneroFilterProps> = ({ genero, onUpdateFilter }) => {
    return (
        <div>
            <h3 className="text-xs sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-2 uppercase tracking-wide">
                Género
            </h3>
            <div className="space-y-2 sm:space-y-1.5">
                {(['dama', 'hombre', 'unisex', 'TODOS'] as const).map((generoOption) => (
                    <label
                        key={generoOption}
                        className="flex items-center space-x-2 sm:space-x-2 p-2.5 sm:p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="genero"
                            checked={genero === generoOption}
                            onChange={() => onUpdateFilter('genero', generoOption)}
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                        />
                        <span className="text-xs sm:text-xs font-medium text-gray-700 capitalize">
                            {generoOption === 'TODOS' ? 'Todos' : generoOption}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default GeneroFilter;

