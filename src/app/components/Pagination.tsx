import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from './ui/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showingFrom: number;
    showingTo: number;
    totalProducts: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showingFrom,
    showingTo,
    totalProducts,
}) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para páginas con ellipsis
            if (currentPage <= 4) {
                // Cerca del inicio
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Cerca del final
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // En el medio
                pages.push(1);
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
        >
            {/* Información de resultados */}
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    Mostrando <span className="font-semibold text-gray-900">{showingFrom}</span> a{' '}
                    <span className="font-semibold text-gray-900">{showingTo}</span> de{' '}
                    <span className="font-semibold text-gray-900">{totalProducts}</span> productos
                </p>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center justify-center space-x-2">
                {/* Botón anterior */}
                <Button
                    variant="grayOutline"
                    size="md"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Anterior</span>
                </Button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === 'ellipsis' ? (
                                <div className="flex items-center justify-center w-10 h-10">
                                    <MoreHorizontal size={16} className="text-gray-400" />
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${currentPage === page
                                            ? 'bg-gray-900 text-white shadow-lg'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    {page}
                                </motion.button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Botón siguiente */}
                <Button
                    variant="grayOutline"
                    size="md"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-2"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight size={16} />
                </Button>
            </div>

            {/* Navegación rápida (móvil) */}
            <div className="mt-4 flex items-center justify-center space-x-4 sm:hidden">
                <select
                    value={currentPage}
                    onChange={(e) => onPageChange(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:border-gray-500 outline-none"
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>
                            Página {page}
                        </option>
                    ))}
                </select>
                <span className="text-sm text-gray-600">de {totalPages}</span>
            </div>
        </motion.div>
    );
};

export default Pagination;