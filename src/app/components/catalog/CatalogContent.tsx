
'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useProductosPublicadosAll } from '@/app/hooks/useProductosPublicadosAll';
import { useCatalogFiltersPublicados } from '@/app/hooks/useCatalogFiltersPublicados';
import { useCatalogSearchParams } from '@/app/hooks/useCatalogSearchParams';
import { useDebounce } from '@/app/components/hooks/useDebounce';
import FilterControls from '@/app/components/FilterControls';
import ProductsGridPublicados from './ProductsGridPublicados';
import EmptyState from './EmptyState';
// import LoadingState from './LoadingState';
import Pagination from '@/app/components/Pagination';
import Section from '@/app/components/Section';
import CatalogCategoriesHero from '@/app/components/CatalogCategoriesHero';
import ProductsGridSkeleton from '../skeleton/ProductsGridSkeleton';

const CatalogContentInner = () => {
  // Estado para productos expandidos
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  
// Fetch de productos publicados (solo una vez)
const { productos, isLoading, isError, error } =
  useProductosPublicadosAll({
    searchTerm: '',
    rubroId: undefined,
    subrubroId: undefined,
    genero: 'TODOS',
    destacado: false,
    tieneStock: false,
    sortBy: 'orden',
    sortOrder: 'asc',
  });

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
  } = useCatalogFiltersPublicados(productos, {
    itemsPerPage: 12,
    initialFilters: {
      searchTerm: '',
      rubroId: null,
      subrubroId: null,
      genero: 'TODOS',
      destacado: false,
      tieneStock: false,
      sortBy: 'orden',
      sortOrder: 'asc',
    },
  });

  // Debounce del searchTerm
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 400);

  // Sincronizar con URL
  const { clearFiltersAndURL } = useCatalogSearchParams({
    filters,
    updateFilter,
    clearFilters,
    debouncedSearchTerm,
  });

  // Mapeo de rubroId a nombre normalizado para UI
  // rubroId 17 = BASIC (aunque en BD pueda tener otro nombre como "PRODUCTO OFFICE")
  const rubroIdToDisplayName = useMemo(() => {
    const map = new Map<number, string>();
    availableOptions.rubros.forEach((r) => {
      // Si es el rubroId 17, mostrar "BASIC" en la UI
      if (r.id === 17) {
        map.set(r.id, 'BASIC');
      } else {
        // Para otros rubros, verificar si es WORKWEAR
        const nombreUpper = r.nombre.toUpperCase();
        if (nombreUpper.includes('WORKWEAR') || nombreUpper.includes('WORK') || nombreUpper.includes('WEAR')) {
          map.set(r.id, 'WORKWEAR');
        } else {
          // Para otros rubros, usar el nombre original
          map.set(r.id, r.nombre);
        }
      }
    });
    return map;
  }, [availableOptions.rubros]);

  // Rubros derivados con nombres normalizados para UI
  const rubros = useMemo(
    () => {
      const rubrosList = availableOptions.rubros.map((r) => {
        const displayName = rubroIdToDisplayName.get(r.id) || r.nombre;
        return displayName;
      });
      // Remover duplicados y ordenar
      return Array.from(new Set(rubrosList)).sort();
    },
    [availableOptions.rubros, rubroIdToDisplayName]
  );

  // Subrubros derivados desde productos
  const subrubros = useMemo(
    () => Array.from(
      new Set(
        productos.map((p) => p.subrubro?.nombre).filter((nombre): nombre is string => Boolean(nombre))
      )
    ),
    [productos]
  );

  // Obtener el nombre normalizado del rubro seleccionado
  const selectedRubroNombre = useMemo(() => {
    if (!filters.rubroId) return 'TODOS';
    const displayName = rubroIdToDisplayName.get(filters.rubroId);
    return displayName || 'TODOS';
  }, [filters.rubroId, rubroIdToDisplayName]);

  // Crear mapeo de rubroId a nombre para detectar WORKWEAR automáticamente
  const rubroIdToNombre = useMemo(() => {
    const map = new Map<number, string>();
    availableOptions.rubros.forEach((r) => {
      map.set(r.id, r.nombre);
    });
    return map;
  }, [availableOptions.rubros]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Categorías Hero */}
      <CatalogCategoriesHero
        onCategorySelect={(rubroId) => {
          updateFilter('rubroId', rubroId);
        }}
        selectedRubroId={filters.rubroId}
        rubroIdToNombre={rubroIdToNombre}
      />

      {/* Contenido principal */}
      <Section
        id="catalog-content"
        className=""
        contentClassName="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-20"
      >
        {/* Controles de filtro */}
        <FilterControls
          filters={{
            searchTerm: filters.searchTerm,
            categoriaTipo: selectedRubroNombre,
            subrubro: filters.subrubroId
              ? availableOptions.subrubros.find((s) => s.id === filters.subrubroId)
                ?.nombre || 'TODOS'
              : 'TODOS',
            genero: filters.genero === 'dama' || filters.genero === 'hombre' || filters.genero === 'unisex' || filters.genero === 'TODOS'
              ? filters.genero
              : 'TODOS',
            colores: filters.colores,
            talles: filters.talles,
            onlyFeatured: filters.destacado,
            sortBy:
              filters.sortBy === 'destacado'
                ? 'destacados'
                : filters.sortBy === 'nombre'
                  ? filters.sortOrder === 'desc'
                    ? 'alfabetico-desc'
                    : 'alfabetico-asc'
                  : filters.sortBy === 'precio'
                    ? filters.sortOrder === 'desc'
                      ? 'precio-desc'
                      : 'precio-asc'
                    : 'alfabetico-asc',
          }}
          availableOptions={{
            colores: availableOptions.colores,
            talles: availableOptions.talles,
          }}
          totalProducts={totalProducts}
          showingFrom={showingFrom}
          showingTo={showingTo}
          onUpdateFilter={(key, value) => {
            if (key === 'categoriaTipo') {
              const valueStr = typeof value === 'string' ? value : 'TODOS';
              if (valueStr === 'TODOS') {
                updateFilter('rubroId', null);
              } else {
                // Buscar el rubro por nombre normalizado (BASIC o WORKWEAR)
                // Primero buscar por nombre normalizado en el mapeo
                let rubro = null;
                for (const [id, displayName] of rubroIdToDisplayName.entries()) {
                  if (displayName === valueStr) {
                    rubro = availableOptions.rubros.find((r) => r.id === id);
                    break;
                  }
                }
                // Si no se encuentra por nombre normalizado, buscar por nombre original
                if (!rubro) {
                  rubro = availableOptions.rubros.find((r) => r.nombre === valueStr);
                }
                updateFilter('rubroId', rubro?.id ?? null);
              }
            } else if (key === 'subrubro') {
              const valueStr = typeof value === 'string' ? value : 'TODOS';
              if (valueStr === 'TODOS') {
                updateFilter('subrubroId', null);
              } else {
                const subrubro = availableOptions.subrubros.find((s) => s.nombre === valueStr);
                updateFilter('subrubroId', subrubro?.id ?? null);
              }
            } else if (key === 'genero') {
              const valueStr = typeof value === 'string' ? value : 'TODOS';
              if (valueStr === 'dama' || valueStr === 'hombre' || valueStr === 'unisex' || valueStr === 'TODOS') {
                updateFilter('genero', valueStr);
              }
            } else if (key === 'searchTerm') {
              updateFilter('searchTerm', typeof value === 'string' ? value : '');
            } else if (key === 'onlyFeatured') {
              updateFilter('destacado', typeof value === 'boolean' ? value : false);
            } else if (key === 'sortBy') {
              if (value === 'destacados') {
                updateFilter('sortBy', 'destacado');
                updateFilter('sortOrder', 'desc');
              } else if (value === 'alfabetico-asc' || value === 'alfabetico-desc') {
                updateFilter('sortBy', 'nombre');
                updateFilter('sortOrder', value === 'alfabetico-desc' ? 'desc' : 'asc');
              } else if (value === 'precio-asc' || value === 'precio-desc') {
                updateFilter('sortBy', 'precio');
                updateFilter('sortOrder', value === 'precio-desc' ? 'desc' : 'asc');
              }
            }
          }}
          onToggleColor={toggleColor}
          onToggleTalle={toggleTalle}
          onClearFilters={clearFiltersAndURL}
          hasActiveFilters={hasActiveFilters}
          rubros={rubros}
          subrubros={subrubros}
        />

        {/* Grid de productos */}
        {isError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error al cargar productos</p>
            <p className="text-gray-600 text-sm">
              {error?.message || 'Error desconocido'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        ) : isLoading ? (
          <ProductsGridSkeleton />
        ) : paginatedProducts.length === 0 ? (
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFiltersAndURL}
          />
        ) : (
          <ProductsGridPublicados
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
      </Section>
    </div>
  );
};

const CatalogContent = () => {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <CatalogContentInner />
    </Suspense>
  );
};

export default CatalogContent;

