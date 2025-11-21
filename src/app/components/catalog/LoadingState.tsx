import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
                <p className="text-gray-600">Cargando productos...</p>
            </div>
        </div>
    );
};

export default LoadingState;

