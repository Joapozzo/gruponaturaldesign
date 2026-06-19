import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 sm:mt-12"
        >
            <div className="text-center mb-3 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-500">
                    Mostrando <span className="text-gray-900">{showingFrom}</span> a{' '}
                    <span className="text-gray-900">{showingTo}</span> de{' '}
                    <span className="text-gray-900">{totalProducts}</span> productos
                </p>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                    type="button"
                    aria-label="P?gina anterior"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    {visiblePages.map((page, index) =>
                        page === 'ellipsis' ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-8 w-8 items-center justify-center"
                                aria-hidden
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-300" />
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => onPageChange(page)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={cn(
                                    'min-w-8 h-8 px-1 text-xs sm:text-sm transition-colors',
                                    currentPage === page
                                        ? 'font-semibold text-gray-900'
                                        : 'text-gray-500 hover:text-gray-800'
                                )}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                <button
                    type="button"
                    aria-label="P?gina siguiente"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 text-gray-500 transition-colors hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
                <select
                    value={currentPage}
                    onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
                    className="border-0 border-b border-gray-300 bg-transparent py-1 text-xs text-gray-900 outline-none focus:border-gray-500"
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <option key={page} value={page}>
                            P?gina {page}
                        </option>
                    ))}
                </select>
                <span className="text-xs text-gray-500">de {totalPages}</span>
            </div>
        </motion.div>
    );
};

export default Pagination;
