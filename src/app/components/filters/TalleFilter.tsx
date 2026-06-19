import React from 'react';

interface TalleFilterProps {
    talles: string[];
    selectedTalles: string[];
    onToggleTalle: (talle: string) => void;
}

const TalleFilter: React.FC<TalleFilterProps> = ({ talles, selectedTalles, onToggleTalle }) => {
    if (talles.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xs sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-2 uppercase tracking-wide">
                Talle
            </h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                {talles.map((talle) => {
                    const isSelected = selectedTalles.includes(talle);
                    return (
                        <label
                            key={talle}
                            className={`flex items-center justify-center p-2.5 sm:p-2 border rounded-lg transition-colors cursor-pointer ${
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
                            <span className="text-xs sm:text-xs font-medium">
                                {talle}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default TalleFilter;

