import { useState, useMemo } from 'react';
import { GroupedProduct } from '../../types/producto';
import { FilterState } from './useCatalogFilters';

export interface UseGroupedCatalogFiltersProps {
    groupedProducts: GroupedProduct[];
    itemsPerPage?: number;
}

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

// Función para extraer género del código o nombre del producto
const extractGender = (product: GroupedProduct): string | null => {
    const nombre = normalizeString(product.displayProduct.NOMBRE || product.displayProduct.Descripcion || '');
    const codigo = normalizeString(product.displayProduct.Codigo || '');
    
    if (nombre.includes('dama') || codigo.includes('dama') || codigo.includes('d')) {
        return 'dama';
    }
    if (nombre.includes('hombre') || codigo.includes('hombre') || codigo.includes('h')) {
        return 'hombre';
    }
    if (nombre.includes('unisex') || codigo.includes('unisex') || codigo.includes('u')) {
        return 'unisex';
    }
    
    return null;
};

export const useGroupedCatalogFilters = ({ groupedProducts, itemsPerPage = 12 }: UseGroupedCatalogFiltersProps) => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        categoriaTipo: 'TODOS',
        subrubro: 'TODOS',
        genero: 'TODOS',
        colores: [],
        talles: [],
        onlyFeatured: false,
        sortBy: 'alfabetico',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Productos filtrados
    const filteredProducts = useMemo(() => {
        let filtered = [...groupedProducts];

        // Filtro por término de búsqueda (insensible a acentos)
        if (filters.searchTerm) {
            const normalizedSearchTerm = normalizeString(filters.searchTerm);
            filtered = filtered.filter(product => {
                const nombre = normalizeString(product.displayProduct.NOMBRE || product.displayProduct.Descripcion || '');
                const descripcion = normalizeString(product.displayProduct.Descripcion || '');
                const rubro = normalizeString(product.displayProduct.Rubro || '');
                const subrubro = normalizeString(product.displayProduct.Subrubro || '');
                
                return nombre.includes(normalizedSearchTerm) ||
                       descripcion.includes(normalizedSearchTerm) ||
                       rubro.includes(normalizedSearchTerm) ||
                       subrubro.includes(normalizedSearchTerm);
            });
        }

        // Filtro por categoría tipo (BASIC/WORKWEAR)
        if (filters.categoriaTipo !== 'TODOS') {
            filtered = filtered.filter(product => {
                const rubro = normalizeString(product.displayProduct.Rubro || '');
                return rubro.includes(normalizeString(filters.categoriaTipo));
            });
        }

        // Filtro por subrubro
        if (filters.subrubro !== 'TODOS') {
            filtered = filtered.filter(product => {
                const subrubro = normalizeString(product.displayProduct.Subrubro || '');
                return subrubro.includes(normalizeString(filters.subrubro));
            });
        }

        // Filtro por género
        if (filters.genero !== 'TODOS') {
            filtered = filtered.filter(product => {
                const gender = extractGender(product);
                return gender === filters.genero;
            });
        }

        // Filtro por colores
        if (filters.colores.length > 0) {
            filtered = filtered.filter(product => {
                if (!product.availableColors || product.availableColors.length === 0) return false;
                return filters.colores.some(color => 
                    product.availableColors!.some(availableColor => 
                        normalizeString(availableColor).includes(normalizeString(color)) ||
                        normalizeString(color).includes(normalizeString(availableColor))
                    )
                );
            });
        }

        // Filtro por talles
        if (filters.talles.length > 0) {
            filtered = filtered.filter(product => {
                if (!product.availableSizes || product.availableSizes.length === 0) return false;
                return filters.talles.some(talle => 
                    product.availableSizes!.includes(talle)
                );
            });
        }

        // Ordenamiento
        switch (filters.sortBy) {
            case 'alfabetico':
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                    const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                    return nombreA.localeCompare(nombreB);
                });
                break;
            case 'categoria':
                filtered.sort((a, b) => {
                    const rubroA = (a.displayProduct.Rubro || '').toLowerCase();
                    const rubroB = (b.displayProduct.Rubro || '').toLowerCase();
                    return rubroA.localeCompare(rubroB);
                });
                break;
            case 'destacados':
                // Por ahora no hay campo destacado en GroupedProduct, mantener orden alfabético
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                    const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                    return nombreA.localeCompare(nombreB);
                });
                break;
        }

        return filtered;
    }, [groupedProducts, filters]);

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
        
        groupedProducts.forEach(product => {
            if (product.availableColors) {
                product.availableColors.forEach(color => colores.add(color));
            }
            if (product.availableSizes) {
                product.availableSizes.forEach(talle => talles.add(talle));
            }
        });

        return {
            colores: Array.from(colores).sort(),
            talles: Array.from(talles).sort((a, b) => {
                // Ordenar talles numéricamente si es posible
                const numA = parseInt(a);
                const numB = parseInt(b);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a.localeCompare(b);
            }),
        };
    }, [groupedProducts]);

    // Funciones para actualizar filtros
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset página al cambiar filtros
    };

    const toggleColor = (color: string) => {
        setFilters(prev => {
            const newColores = prev.colores.includes(color)
                ? prev.colores.filter(c => c !== color)
                : [...prev.colores, color];
            return { ...prev, colores: newColores };
        });
        setCurrentPage(1);
    };

    const toggleTalle = (talle: string) => {
        setFilters(prev => {
            const newTalles = prev.talles.includes(talle)
                ? prev.talles.filter(t => t !== talle)
                : [...prev.talles, talle];
            return { ...prev, talles: newTalles };
        });
        setCurrentPage(1);
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

    const hasActiveFilters = useMemo(() => {
        return filters.searchTerm !== '' ||
               filters.categoriaTipo !== 'TODOS' ||
               filters.subrubro !== 'TODOS' ||
               filters.genero !== 'TODOS' ||
               filters.colores.length > 0 ||
               filters.talles.length > 0 ||
               filters.onlyFeatured ||
               filters.sortBy !== 'alfabetico';
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
};

