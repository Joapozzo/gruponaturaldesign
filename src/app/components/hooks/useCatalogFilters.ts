import { useState, useMemo } from 'react';
import { ProductType } from '../../types/producto'

export interface FilterState {
    searchTerm: string;
    categoriaTipo: string; // Acepta cualquier string para buscar en Rubro, 'TODOS' es el valor por defecto
    subrubro: string; // Acepta cualquier string para buscar en Subrubro, 'TODOS' es el valor por defecto
    genero: 'dama' | 'hombre' | 'unisex' | 'TODOS';
    colores: string[];
    talles: string[];
    onlyFeatured: boolean;
    sortBy: 'alfabetico-asc' | 'alfabetico-desc' | 'precio-asc' | 'precio-desc' | 'destacados';
}

export interface UseCatalogFiltersProps {
    productos: ProductType[];
    itemsPerPage?: number;
}

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

export const useCatalogFilters = ({ productos, itemsPerPage = 12 }: UseCatalogFiltersProps) => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        categoriaTipo: 'TODOS',
        subrubro: 'TODOS',
        genero: 'TODOS',
        colores: [],
        talles: [],
        onlyFeatured: false,
        sortBy: 'alfabetico-asc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Productos filtrados
    const filteredProducts = useMemo(() => {
        let filtered = [...productos];
        // Filtro por término de búsqueda (insensible a acentos)
        if (filters.searchTerm) {
            const normalizedSearchTerm = normalizeString(filters.searchTerm);
            filtered = filtered.filter(product =>
                normalizeString(product.nombre).includes(normalizedSearchTerm) ||
                normalizeString(product.descripcion).includes(normalizedSearchTerm) ||
                normalizeString(product.categoria).includes(normalizedSearchTerm)
            );
        }

        // Filtro por categoría tipo (BASIC/WORKWEAR) - mantener compatibilidad

        // Filtro por destacados
        if (filters.onlyFeatured) {
            filtered = filtered.filter(product => product.destacado);
        }

        // Ordenamiento
        switch (filters.sortBy) {
            case 'alfabetico-asc':
                filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'alfabetico-desc':
                filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case 'precio-asc':
                // Ordenar por precio ascendente (Menor a mayor)
                // Por ahora, si no hay precio numérico, mantener orden alfabético
                filtered.sort((a, b) => {
                    const precioA = parseFloat(a.precio) || 0;
                    const precioB = parseFloat(b.precio) || 0;
                    if (precioA === 0 && precioB === 0) {
                        return a.nombre.localeCompare(b.nombre);
                    }
                    return precioA - precioB;
                });
                break;
            case 'precio-desc':
                // Ordenar por precio descendente (mayor a menor)
                filtered.sort((a, b) => {
                    const precioA = parseFloat(a.precio) || 0;
                    const precioB = parseFloat(b.precio) || 0;
                    if (precioA === 0 && precioB === 0) {
                        return a.nombre.localeCompare(b.nombre);
                    }
                    return precioB - precioA;
                });
                break;
            case 'destacados':
                filtered.sort((a, b) => {
                    if (a.destacado && !b.destacado) return -1;
                    if (!a.destacado && b.destacado) return 1;
                    return a.nombre.localeCompare(b.nombre);
                });
                break;
        }

        return filtered;
    }, [productos, filters]);
    // Paginación
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Obtener categorías únicas (mantener compatibilidad)
    const availableCategories = useMemo(() => {
        const categories = productos.map(p => p.categoriaIndumentaria);
        return Array.from(new Set(categories));
    }, [productos]);

    // Funciones para actualizar filtros
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset página al cambiar filtros
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            categoriaTipo: 'TODOS',
            subrubro: 'TODOS',
            genero: 'TODOS',
            colores: [],
            talles: [],
            onlyFeatured: false,
            sortBy: 'alfabetico-asc',
        });
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll al top cuando cambie de página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        filters,
        updateFilter,
        clearFilters,
        filteredProducts,
        paginatedProducts,
        currentPage,
        totalPages,
        goToPage,
        availableCategories,
        totalProducts: filteredProducts.length,
        showingFrom: (currentPage - 1) * itemsPerPage + 1,
        showingTo: Math.min(currentPage * itemsPerPage, filteredProducts.length),
    };
};