import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { FilterState } from './hooks/useCatalogFilters';

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
}

// Mapeo de colores a códigos hexadecimales aproximados
const colorMap: Record<string, string> = {
    'negro': '#000000',
    'black': '#000000',
    'blanco': '#FFFFFF',
    'white': '#FFFFFF',
    'rojo': '#FF0000',
    'red': '#FF0000',
    'azul': '#0000FF',
    'blue': '#0000FF',
    'verde': '#00FF00',
    'green': '#00FF00',
    'amarillo': '#FFFF00',
    'yellow': '#FFFF00',
    'naranja': '#FFA500',
    'orange': '#FFA500',
    'rosa': '#FFC0CB',
    'pink': '#FFC0CB',
    'violeta': '#8A2BE2',
    'violet': '#8A2BE2',
    'lila': '#C8A2C8',
    'lilac': '#C8A2C8',
    'gris': '#808080',
    'gray': '#808080',
    'gris claro': '#D3D3D3',
    'light gray': '#D3D3D3',
    'hueso': '#F5F5DC',
    'beige': '#F5F5DC',
    'marron': '#A52A2A',
    'brown': '#A52A2A',
};

const getColorHex = (colorName: string): string => {
    const normalized = colorName.toLowerCase().trim();
    return colorMap[normalized] || '#CCCCCC';
};

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
}) => {
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
                        className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-5 h-5 text-gray-700" />
                                    <h2 className="text-xl font-bold text-gray-900">Filtrar por</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* Categoría Tipo */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                    Categoría
                                </h3>
                                <div className="space-y-2">
                                    {(['BASIC', 'WORKWEAR', 'TODOS'] as const).map((tipo) => (
                                        <label
                                            key={tipo}
                                            className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="categoriaTipo"
                                                checked={filters.categoriaTipo === tipo}
                                                onChange={() => onUpdateFilter('categoriaTipo', tipo)}
                                                className="w-4 h-4 text-gray-600 accent-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {tipo === 'TODOS' ? 'Todas' : tipo}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Subrubro */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                    Tipo de Prenda
                                </h3>
                                <div className="space-y-2">
                                    {(['remera', 'pantalon', 'campera', 'sweater', 'camisa', 'buzo', 'TODOS'] as const).map((subrubro) => (
                                        <label
                                            key={subrubro}
                                            className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="subrubro"
                                                checked={filters.subrubro === subrubro}
                                                onChange={() => onUpdateFilter('subrubro', subrubro)}
                                                className="w-4 h-4 text-gray-600 accent-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {subrubro === 'TODOS' ? 'Todos' : subrubro}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Género */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                    Género
                                </h3>
                                <div className="space-y-2">
                                    {(['dama', 'hombre', 'unisex', 'TODOS'] as const).map((genero) => (
                                        <label
                                            key={genero}
                                            className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="genero"
                                                checked={filters.genero === genero}
                                                onChange={() => onUpdateFilter('genero', genero)}
                                                className="w-4 h-4 text-gray-600 accent-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {genero === 'TODOS' ? 'Todos' : genero}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colores */}
                            {availableOptions.colores.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                        Color
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                        {availableOptions.colores.map((color) => {
                                            const isSelected = filters.colores.includes(color);
                                            return (
                                                <label
                                                    key={color}
                                                    className={`flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => onToggleColor(color)}
                                                        className="w-4 h-4 text-gray-600 accent-gray-600"
                                                    />
                                                    <div
                                                        className="w-4 h-4 rounded border border-gray-300"
                                                        style={{ backgroundColor: getColorHex(color) }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 flex-1 capitalize">
                                                        {color}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Talles */}
                            {availableOptions.talles.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                        Talle
                                    </h3>
                                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                        {availableOptions.talles.map((talle) => {
                                            const isSelected = filters.talles.includes(talle);
                                            return (
                                                <label
                                                    key={talle}
                                                    className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors cursor-pointer ${
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
                                                    <span className="text-sm font-medium">
                                                        {talle}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-4 space-y-2">
                                {hasActiveFilters && (
                                    <button
                                        onClick={onClearFilters}
                                        className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Limpiar Filtros
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterModal;

