"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useGroupedCatalogFilters } from '@/app/components/hooks/useGroupedCatalogFilters';
import { useDebounce } from '@/app/components/hooks/useDebounce';
import FilterControls from '@/app/components/FilterControls';
import ProductsGrid from '@/app/components/catalog/ProductsGrid';
import EmptyState from '@/app/components/catalog/EmptyState';
import LoadingState from '@/app/components/catalog/LoadingState';
import ScrollToTop from '@/app/components/catalog/ScrollToTop';
import Pagination from '@/app/components/Pagination';
import Section from '@/app/components/Section';
import CatalogCategoriesHero from '@/app/components/CatalogCategoriesHero';
import { useProductsV2 } from '@/app/hooks/useProductsV2';

const CatalogContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    // Cargar productos agrupados V2
    const { products, isLoading, isError, error, rubros, subrubros } = useProductsV2();
    
    
    // Estado para productos expandidos
    const [expandedSku, setExpandedSku] = useState<string | null>(null);

    // Ref para evitar loops infinitos al sincronizar URL <-> Filtros
    const isInitialized = useRef(false);
    const isUpdatingFromURL = useRef(false);
    
    // Hook de filtros
    const {
        filters,
        updateFilter,
        toggleColor,
        toggleTalle,
        clearFilters: originalClearFilters,
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
        products,
        itemsPerPage: 12,
    });

    // Función para normalizar rubro desde URL (puede venir como "PRODUCTO WORKWEAR", "PRODUCTO OFFICE", "WORKWEAR", "BASIC")
    const normalizeRubroFromURL = (rubro: string): string => {
        if (!rubro) return 'TODOS';
        
        const normalized = rubro.toUpperCase().trim();
        
        // Si contiene "WORKWEAR", retornar "WORKWEAR"
        if (normalized.includes('WORKWEAR')) {
            return 'WORKWEAR';
        }
        
        // Si contiene "OFFICE" o "BASIC", retornar "BASIC"
        if (normalized.includes('OFFICE') || normalized.includes('BASIC')) {
            return 'BASIC';
        }
        
        // Si es exactamente "WORKWEAR" o "BASIC", retornarlo
        if (normalized === 'WORKWEAR' || normalized === 'BASIC') {
            return normalized;
        }
        
        // Por defecto, retornar BASIC (ya que en el Excel la mayoría son OFFICE)
        return 'BASIC';
    };

    // Función para sincronizar filtros con URL
    const syncFiltersToURL = (newFilters: typeof filters) => {
        if (isUpdatingFromURL.current) return; // Evitar loop
        
        const params = new URLSearchParams();
        
        // Solo agregar parámetros si no son valores por defecto
        if (newFilters.categoriaTipo && newFilters.categoriaTipo !== 'TODOS') {
            // Normalizar el valor antes de agregarlo a la URL
            const normalizedRubro = normalizeRubroFromURL(newFilters.categoriaTipo);
            params.set('rubro', normalizedRubro);
        }
        if (newFilters.subrubro && newFilters.subrubro !== 'TODOS') {
            params.set('subrubro', newFilters.subrubro);
        }
        if (newFilters.genero && newFilters.genero !== 'TODOS') {
            params.set('genero', newFilters.genero.toLowerCase());
        }
        if (newFilters.searchTerm && newFilters.searchTerm.trim() !== '') {
            params.set('search', newFilters.searchTerm);
        }
        
        const newURL = params.toString() 
            ? `${pathname}?${params.toString()}`
            : pathname;
        
        // Usar replace para no agregar entrada al historial
        router.replace(newURL, { scroll: false });
    };

    // Aplicar filtros desde URL params cuando cambien los params (URL -> Filtros)
    useEffect(() => {
        // Evitar actualizar si estamos sincronizando desde filtros
        if (isUpdatingFromURL.current) return;
        
        const rubro = searchParams.get('rubro');
        const subrubro = searchParams.get('subrubro');
        const genero = searchParams.get('genero');
        const search = searchParams.get('search');

        isUpdatingFromURL.current = true;
        
        // Actualizar rubro
        if (rubro) {
            const normalizedRubro = normalizeRubroFromURL(rubro);
            updateFilter('categoriaTipo', normalizedRubro);
        } else {
            // Si no hay rubro en URL, limpiar solo si no es el valor inicial
            if (filters.categoriaTipo !== 'TODOS') {
                updateFilter('categoriaTipo', 'TODOS');
            }
        }
        
        // Actualizar subrubro
        if (subrubro) {
            updateFilter('subrubro', subrubro);
        } else {
            if (filters.subrubro !== 'TODOS') {
                updateFilter('subrubro', 'TODOS');
            }
        }
        
        // Actualizar género
        if (genero) {
            const validGenero = ['dama', 'hombre', 'unisex'].includes(genero.toLowerCase()) 
                ? genero.toLowerCase() as 'dama' | 'hombre' | 'unisex'
                : 'TODOS';
            updateFilter('genero', validGenero);
        } else {
            if (filters.genero !== 'TODOS') {
                updateFilter('genero', 'TODOS');
            }
        }
        
        // Actualizar búsqueda
        if (search) {
            updateFilter('searchTerm', search);
        } else {
            if (filters.searchTerm !== '') {
                updateFilter('searchTerm', '');
            }
        }
        
        // Resetear flag después de un pequeño delay
        setTimeout(() => {
            isUpdatingFromURL.current = false;
        }, 100);
        
        if (!isInitialized.current) {
            isInitialized.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]); // Solo cuando cambien los searchParams

    // Debounce del searchTerm para actualizar la URL solo después de que el usuario deje de escribir
    const debouncedSearchTerm = useDebounce(filters.searchTerm, 400);

    // Sincronizar filtros con URL cuando cambien (Filtros -> URL)
    // Para searchTerm usar el valor debounceado, para los demás filtros actualizar inmediatamente
    useEffect(() => {
        if (!isInitialized.current) return;
        if (isUpdatingFromURL.current) return;
        
        // Crear un objeto de filtros con el searchTerm debounceado para la URL
        const filtersForURL = {
            ...filters,
            searchTerm: debouncedSearchTerm,
        };
        syncFiltersToURL(filtersForURL);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.categoriaTipo, filters.subrubro, filters.genero, debouncedSearchTerm]);

    // Wrapper para clearFilters que también limpia la URL
    const clearFilters = () => {
        originalClearFilters();
        // Limpiar URL después de limpiar filtros
        router.replace(pathname, { scroll: false });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Categorías Hero - Reemplaza el HeroCatalogo */}
            <CatalogCategoriesHero 
                onCategorySelect={(category) => updateFilter('categoriaTipo', category)}
                selectedCategory={filters.categoriaTipo}
            />

            {/* Contenido principal */}
            <Section id="catalog-content" className="" contentClassName="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-20">
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
                    rubros={rubros.map(r => r.nombreNormalizado)}
                    subrubros={subrubros.map(s => s.nombre)}
                />

                {/* Grid de productos */}
                {isError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">Error al cargar productos</p>
                        <p className="text-gray-600 text-sm">{error?.message || 'Error desconocido'}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Recargar página
                        </button>
                    </div>
                ) : isLoading ? (
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

const CatalogPage = () => {
    return (
        <Suspense fallback={<LoadingState />}>
            <CatalogContent />
        </Suspense>
    );
};

export default CatalogPage;
