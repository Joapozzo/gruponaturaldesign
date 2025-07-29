import { useState, useMemo } from 'react';
import { ProductType, CategoriaIndumentaria } from '../../types/producto'

export interface FilterState {
    searchTerm: string;
    selectedCategory: CategoriaIndumentaria | 'TODOS';
    onlyFeatured: boolean;
    sortBy: 'alfabetico' | 'categoria' | 'destacados';
}

export interface UseCatalogFiltersProps {
    productos: ProductType[];
    itemsPerPage?: number;
}

export const useCatalogFilters = ({ productos, itemsPerPage = 12 }: UseCatalogFiltersProps) => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        selectedCategory: 'TODOS',
        onlyFeatured: false,
        sortBy: 'alfabetico',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Productos filtrados
    const filteredProducts = useMemo(() => {
        let filtered = [...productos];

        // Filtro por término de búsqueda
        if (filters.searchTerm) {
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                product.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                product.categoria.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        // Filtro por categoría
        if (filters.selectedCategory !== 'TODOS') {
            filtered = filtered.filter(product =>
                product.categoriaIndumentaria === filters.selectedCategory
            );
        }

        // Filtro por destacados
        if (filters.onlyFeatured) {
            filtered = filtered.filter(product => product.destacado);
        }

        // Ordenamiento
        switch (filters.sortBy) {
            case 'alfabetico':
                filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'categoria':
                filtered.sort((a, b) => a.categoriaIndumentaria.localeCompare(b.categoriaIndumentaria));
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

    // Obtener categorías únicas
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
            selectedCategory: 'TODOS',
            onlyFeatured: false,
            sortBy: 'alfabetico',
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