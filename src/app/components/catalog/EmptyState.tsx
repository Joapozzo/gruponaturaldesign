import React from 'react';
import { Grid3X3 } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    hasActiveFilters,
    onClearFilters,
}) => {
    return (
        <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-6">
                Intentá cambiar los filtros o realizar una búsqueda diferente.
            </p>
            {hasActiveFilters && (
                <Button variant="black" size="md" onClick={onClearFilters}>
                    Limpiar Filtros
                </Button>
            )}
        </div>
    );
};

export default EmptyState;

