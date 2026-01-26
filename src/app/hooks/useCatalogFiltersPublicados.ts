/**
 * Hook para filtros de catálogo con productos publicados
 * Maneja filtrado, paginación y sincronización con URL
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ProductoPublicado } from '../types/producto-publicado.types';

export interface CatalogFilters {
  searchTerm: string;
  rubroId: number | null;
  subrubroId: number | null;
  genero: string; // 'dama' | 'hombre' | 'unisex' | 'TODOS'
  colores: string[];
  talles: string[];
  destacado: boolean;
  tieneStock: boolean;
  sortBy: 'destacado' | 'nombre' | 'precio' | 'orden';
  sortOrder: 'asc' | 'desc';
}

export interface UseCatalogFiltersPublicadosOptions {
  itemsPerPage?: number;
  initialFilters?: Partial<CatalogFilters>;
}

export interface UseCatalogFiltersPublicadosReturn {
  filters: CatalogFilters;
  updateFilter: <K extends keyof CatalogFilters>(
    key: K,
    value: CatalogFilters[K]
  ) => void;
  toggleColor: (color: string) => void;
  toggleTalle: (talle: string) => void;
  clearFilters: () => void;
  filteredProducts: ProductoPublicado[];
  paginatedProducts: ProductoPublicado[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  availableOptions: {
    colores: string[];
    talles: string[];
    rubros: Array<{ id: number; nombre: string }>;
    subrubros: Array<{ id: number; nombre: string }>;
  };
  totalProducts: number;
  showingFrom: number;
  showingTo: number;
  hasActiveFilters: boolean;
}

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export function useCatalogFiltersPublicados(
  products: ProductoPublicado[],
  options: UseCatalogFiltersPublicadosOptions = {}
): UseCatalogFiltersPublicadosReturn {
  const { itemsPerPage = 12, initialFilters = {} } = options;

  const [filters, setFilters] = useState<CatalogFilters>({
    searchTerm: '',
    rubroId: null,
    subrubroId: null,
    genero: 'TODOS',
    colores: [],
    talles: [],
    destacado: false,
    tieneStock: false,
    sortBy: 'orden',
    sortOrder: 'asc',
    ...initialFilters,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const normalizedSearchTerm = normalizeString(filters.searchTerm);
      filtered = filtered.filter((product) => {
        const nombre = normalizeString(product.nombre || '');
        const descripcion = normalizeString(product.descripcion || '');
        const descripcionCorta = normalizeString(product.descripcionCorta || '');
        const codigo = normalizeString(product.codigoAgrupacion || '');

        return (
          nombre.includes(normalizedSearchTerm) ||
          descripcion.includes(normalizedSearchTerm) ||
          descripcionCorta.includes(normalizedSearchTerm) ||
          codigo.includes(normalizedSearchTerm)
        );
      });
    }

    // Filtro por rubro
    if (filters.rubroId) {
      filtered = filtered.filter(
        (product) => product.rubro?.id === filters.rubroId
      );
    }

    // Filtro por subrubro
    if (filters.subrubroId) {
      filtered = filtered.filter(
        (product) => product.subrubro?.id === filters.subrubroId
      );
    }

    // Filtro por género
    if (filters.genero !== 'TODOS') {
      filtered = filtered.filter(
        (product) => product.sexo?.toLowerCase() === filters.genero.toLowerCase()
      );
    }

    // Filtro por colores
    if (filters.colores.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.colores || product.colores.length === 0) return false;
        return filters.colores.some((color) =>
          product.colores!.some((productColor) =>
            normalizeString(productColor).includes(normalizeString(color)) ||
            normalizeString(color).includes(normalizeString(productColor))
          )
        );
      });
    }

    // Filtro por talles
    if (filters.talles.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.talles || product.talles.length === 0) return false;
        return filters.talles.some((talle) => product.talles!.includes(talle));
      });
    }

    // Filtro por destacado
    if (filters.destacado) {
      filtered = filtered.filter((product) => product.destacado);
    }

    // Filtro por stock
    if (filters.tieneStock) {
      filtered = filtered.filter((product) => product.tieneStock);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'destacado':
          if (a.destacado !== b.destacado) {
            comparison = a.destacado ? -1 : 1;
          }
          break;
        case 'nombre':
          comparison = (a.nombre || '').localeCompare(b.nombre || '');
          break;
        case 'precio':
          const precioA = a.precioMin || a.precioLista || 0;
          const precioB = b.precioMin || b.precioLista || 0;
          comparison = precioA - precioB;
          break;
        case 'orden':
        default:
          comparison = a.orden - b.orden;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [
    products,
    filters.searchTerm,
    filters.rubroId,
    filters.subrubroId,
    filters.genero,
    filters.colores,
    filters.talles,
    filters.destacado,
    filters.tieneStock,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Obtener opciones disponibles para filtros
  const availableOptions = useMemo(() => {
    const colores = new Set<string>();
    const talles = new Set<string>();
    const rubrosMap = new Map<number, { id: number; nombre: string }>();
    const subrubrosMap = new Map<number, { id: number; nombre: string }>();

    products.forEach((product) => {
      // Colores
      if (product.colores) {
        product.colores.forEach((color) => colores.add(color));
      }

      // Talles
      if (product.talles) {
        product.talles.forEach((talle) => talles.add(talle));
      }

      // Rubros
      if (product.rubro) {
        rubrosMap.set(product.rubro.id, {
          id: product.rubro.id,
          nombre: product.rubro.nombre,
        });
      }

      // Subrubros
      if (product.subrubro) {
        subrubrosMap.set(product.subrubro.id, {
          id: product.subrubro.id,
          nombre: product.subrubro.nombre,
        });
      }
    });

    return {
      colores: Array.from(colores).sort(),
      talles: Array.from(talles).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      }),
      rubros: Array.from(rubrosMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
      subrubros: Array.from(subrubrosMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
    };
  }, [products]);

  // Funciones para actualizar filtros
  const updateFilter = useCallback(
    <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset página al cambiar filtros
    },
    []
  );

  const toggleColor = useCallback((color: string) => {
    setFilters((prev) => {
      const newColores = prev.colores.includes(color)
        ? prev.colores.filter((c) => c !== color)
        : [...prev.colores, color];
      return { ...prev, colores: newColores };
    });
    setCurrentPage(1);
  }, []);

  const toggleTalle = useCallback((talle: string) => {
    setFilters((prev) => {
      const newTalles = prev.talles.includes(talle)
        ? prev.talles.filter((t) => t !== talle)
        : [...prev.talles, talle];
      return { ...prev, talles: newTalles };
    });
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      rubroId: null,
      subrubroId: null,
      genero: 'TODOS',
      colores: [],
      talles: [],
      destacado: false,
      tieneStock: false,
      sortBy: 'orden',
      sortOrder: 'asc',
    });
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [totalPages]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.rubroId !== null ||
      filters.subrubroId !== null ||
      filters.genero !== 'TODOS' ||
      filters.colores.length > 0 ||
      filters.talles.length > 0 ||
      filters.destacado ||
      filters.tieneStock ||
      filters.sortBy !== 'orden' ||
      filters.sortOrder !== 'asc'
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleColor,
    toggleTalle,
    clearFilters,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    availableOptions,
    totalProducts: filteredProducts.length,
    showingFrom: (currentPage - 1) * itemsPerPage + 1,
    showingTo: Math.min(currentPage * itemsPerPage, filteredProducts.length),
    hasActiveFilters,
  };
}

