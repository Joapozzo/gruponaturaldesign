import React from 'react';

interface FilterActionsProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onClose: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({ hasActiveFilters, onClearFilters, onClose }) => {
    return (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 sm:pt-4 pb-4 sm:pb-4 px-4 sm:px-4 space-y-2 sm:space-y-1.5">
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="w-full py-2.5 sm:py-2 px-3 sm:px-3 text-xs sm:text-xs border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Limpiar filtros
                </button>
            )}
            <button
                onClick={onClose}
                className="w-full py-2.5 sm:py-2 px-3 sm:px-3 text-xs sm:text-xs bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
                Aplicar Filtros
            </button>
        </div>
    );
};

export default FilterActions;

