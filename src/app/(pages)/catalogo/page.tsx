"use client";
import React, { useState } from 'react';
import { useGroupedProducts } from '@/app/hooks/useGroupedProducts';
import { useGroupedCatalogFilters } from '@/app/components/hooks/useGroupedCatalogFilters';
import FilterControls from '@/app/components/FilterControls';
import ProductsGrid from '@/app/components/catalog/ProductsGrid';
import EmptyState from '@/app/components/catalog/EmptyState';
import LoadingState from '@/app/components/catalog/LoadingState';
import ScrollToTop from '@/app/components/catalog/ScrollToTop';
import Pagination from '@/app/components/Pagination';
import Section from '@/app/components/Section';
import HeroCatalogo from '@/app/components/HeroCatalogo';

const CatalogPage = () => {
    // Cargar productos agrupados
    const { groupedProducts, isLoading } = useGroupedProducts();

    // Estado para productos expandidos
    const [expandedSku, setExpandedSku] = useState<string | null>(null);

    // Hook de filtros
    const {
        filters,
        updateFilter,
        toggleColor,
        toggleTalle,
        clearFilters,
        paginatedProducts,
        currentPage,
        totalPages,
        goToPage,
        availableOptions,
        totalProducts,
        showingFrom,
        showingTo,
        hasActiveFilters,
    } = useGroupedCatalogFilters({
        groupedProducts,
        itemsPerPage: 12,
    });


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <HeroCatalogo 
                productCount={groupedProducts.length}
                isLoading={isLoading}
            />

            {/* Contenido principal */}
            <Section id="catalog-content" className="" contentClassName="max-w-7xl mx-auto px-4 mb-20">
                {/* Controles de filtro */}
                <FilterControls
                    filters={filters}
                    availableOptions={availableOptions}
                    totalProducts={totalProducts}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    onUpdateFilter={updateFilter}
                    onToggleColor={toggleColor}
                    onToggleTalle={toggleTalle}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Grid de productos */}
                {isLoading ? (
                    <LoadingState />
                ) : paginatedProducts.length === 0 ? (
                    <EmptyState
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={clearFilters}
                    />
                ) : (
                    <ProductsGrid
                        products={paginatedProducts}
                        expandedSku={expandedSku}
                        onExpandChange={setExpandedSku}
                    />
                )}

                {/* Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                    totalProducts={totalProducts}
                />

                {/* Botón volver arriba */}
                <ScrollToTop show={currentPage > 1} />
            </Section>
        </div>
    );
};

export default CatalogPage;
