
'use client';

import React, { useState, Suspense, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductosPublicadosAll } from '@/app/hooks/useProductosPublicadosAll';
import { useCatalogFiltersPublicados } from '@/app/hooks/useCatalogFiltersPublicados';
import { useCatalogSearchParams } from '@/app/hooks/useCatalogSearchParams';
import { useDebounce } from '@/app/components/hooks/useDebounce';
import FilterControls from '@/app/components/FilterControls';
import ProductsGridPublicados from './ProductsGridPublicados';
import EmptyState from './EmptyState';
import Pagination from '@/app/components/Pagination';
import Section from '@/app/components/Section';
import CatalogCategoriesHero from '@/app/components/CatalogCategoriesHero';
import AnnouncementBanner from '@/app/components/AnnouncementBanner';
import ProductsGridSkeleton from '../skeleton/ProductsGridSkeleton';
import { DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS } from '@/app/types/producto-publicado.types';
import { getRubroDisplayName, getWorkwearRubroId, getBasicRubroId } from '@/app/utils/rubroDisplay';
import { useSubrubros } from '@/app/hooks/useSubrubros';
import { getEmpresaId } from '@/app/utils/getEmpresaId';

const CatalogContentInner = () => {
  const [mounted, setMounted] = useState(false);
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => setMounted(true), []);

  // Filtros iniciales desde URL (mismo criterio que page.tsx) para que el filtrado coincida
  const initialRubroId = useMemo(() => {
    const id = searchParams.get('rubroId');
    return id ? parseInt(id, 10) : null;
  }, [searchParams]);
  const initialSubrubroId = useMemo(() => {
    const id = searchParams.get('subrubroId');
    return id ? parseInt(id, 10) : null;
  }, [searchParams]);
  const initialGenero = useMemo(() => {
    const g = searchParams.get('genero')?.toLowerCase();
    return g && ['dama', 'hombre', 'unisex'].includes(g) ? g : 'TODOS';
  }, [searchParams]);

  const empresaId = getEmpresaId();
  const { data: subrubrosData } = useSubrubros({ empresaId, visibleWeb: true });
  const { productos, isLoading, isError, error } =
    useProductosPublicadosAll(DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS);

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
      searchTerm: searchParams.get('search') ?? '',
      rubroId: Number.isNaN(initialRubroId) ? null : initialRubroId,
      subrubroId: Number.isNaN(initialSubrubroId) ? null : initialSubrubroId,
      genero: initialGenero,
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

  // Mapeo rubroId -> nombre para UI (OFFICE se muestra como "BASIC")
  const rubroIdToDisplayName = useMemo(() => {
    const map = new Map<number, string>();
    availableOptions.rubros.forEach((r) => {
      map.set(r.id, getRubroDisplayName(r.nombre));
    });
    return map;
  }, [availableOptions.rubros]);

  // Rubros para el filtro: TODOS + nombres de UI (OFFICE -> Basic, WORKWEAR)
  const rubros = useMemo(() => {
    const list = availableOptions.rubros.map((r) => rubroIdToDisplayName.get(r.id) || r.nombre);
    return ['TODOS', ...Array.from(new Set(list)).sort()];
  }, [availableOptions.rubros, rubroIdToDisplayName]);

  // Subrubros desde API con value=id para filtrar correctamente (evita duplicados por nombre)
  const subrubroOptions = useMemo(() => {
    const list = subrubrosData?.data ?? [];
    const nameCount = new Map<string, number>();
    list.forEach((s) => {
      const n = (s.nombre || '').toUpperCase();
      nameCount.set(n, (nameCount.get(n) || 0) + 1);
    });
    return [
      { value: 'TODOS', label: 'Todas' },
      ...list
        .map((s) => {
          const nombre = s.nombre || '';
          const rubroNombre = s.rubro ? getRubroDisplayName(s.rubro.nombre) : '';
          const label =
            (nameCount.get(nombre.toUpperCase()) ?? 0) > 1 && rubroNombre
              ? `${nombre} (${rubroNombre})`
              : nombre;
          return { value: String(s.id), label };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [subrubrosData?.data]);

  // Obtener el nombre normalizado del rubro seleccionado
  const selectedRubroNombre = useMemo(() => {
    if (!filters.rubroId) return 'TODOS';
    const displayName = rubroIdToDisplayName.get(filters.rubroId);
    return displayName || 'TODOS';
  }, [filters.rubroId, rubroIdToDisplayName]);

  // IDs de categorías hero (WORKWEAR y BASIC/OFFICE) desde la misma lista de rubros
  const workwearRubroId = getWorkwearRubroId(availableOptions.rubros);
  const basicRubroId = getBasicRubroId(availableOptions.rubros);

  return (
    <div className="bg-white min-h-screen pb-12">
      <AnnouncementBanner />
      <CatalogCategoriesHero
        onCategorySelect={(rubroId) => updateFilter('rubroId', rubroId)}
        selectedRubroId={filters.rubroId}
        rubros={availableOptions.rubros}
        workwearRubroId={workwearRubroId}
        basicRubroId={basicRubroId}
      />

      {/* Contenido principal */}
      <Section
        id="catalog-content"
        className="overflow-visible"
        contentClassName="w-full px-4 lg:px-15 pb-8"
      >
        {/* Controles de filtro */}
        <FilterControls
          filters={{
            searchTerm: filters.searchTerm,
            categoriaTipo: selectedRubroNombre,
            subrubro: filters.subrubroId ? String(filters.subrubroId) : 'TODOS',
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
                const id = parseInt(valueStr, 10);
                updateFilter('subrubroId', Number.isNaN(id) ? null : id);
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
          subrubroOptions={subrubroOptions}
        />

        {/* Grid de productos: mismo output en server y primer paint del cliente para evitar hydration mismatch */}
        {!mounted ? (
          <ProductsGridSkeleton />
        ) : isError ? (
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

