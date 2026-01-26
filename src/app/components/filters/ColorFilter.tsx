import React from 'react';
import { getColorHex } from '../product-card/utils/colorUtils';

interface ColorFilterProps {
    colores: string[];
    selectedColores: string[];
    onToggleColor: (color: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ colores, selectedColores, onToggleColor }) => {
    if (colores.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xs sm:text-xs font-semibold text-gray-900 mb-2 sm:mb-2 uppercase tracking-wide">
                Color
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-1.5 max-h-48 sm:max-h-64 overflow-y-auto">
                {colores.map((color) => {
                    const isSelected = selectedColores.includes(color);
                    return (
                        <label
                            key={color}
                            className={`flex items-center space-x-2 sm:space-x-2 p-2.5 sm:p-2 border rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleColor(color)}
                                className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-600 accent-gray-600"
                            />
                            <div
                                className="w-4 h-4 sm:w-3.5 sm:h-3.5 rounded border border-gray-300"
                                style={{ backgroundColor: getColorHex(color) }}
                            />
                            <span className="text-xs sm:text-xs font-medium text-gray-700 flex-1 capitalize">
                                {color}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorFilter;

