import { useState, useMemo } from 'react';
import { GroupedProduct } from '../../types/producto';
import { FilterState } from './useCatalogFilters';
import { hasProductImages } from '@/app/(pages)/producto/[id]/helpers/productHelpers';

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

// Lista blanca de productos permitidos por categoría
// Si dice "HOMBRE Y DAMA" son dos productos distintos
const ALLOWED_PRODUCTS = {
    WORKWEAR: [
        'CAMISA DRILL HOMBRE',
        'CAMISA DRILL DAMA',
        'BUZO STANDARD UNISEX',
        'CARGO BALANCE HOMBRE',
        'CARGO BALANCE DAMA',
        'CARGO BOLT HOMBRE',
        'CARGO IMPACTED UNISEX',
        'CHOMBA RIVET UNISEX',
        'REMERA BASE UNISEX',
        'JEAN FLOW HOMBRE',
        'JEAN FLOW DAMA',
        'ROMPEVIENTO RANGER UNISEX'
    ],
    BASIC: [
        'CAMISA EXECUTIVE HOMBRE',
        'CAMISA EXECUTIVE DAMA',
        'REMERA GENTLE',
        'CARDIGAN CHARM',
        'SWEATER ESSENCE',
        'CHINO CONFORT FIT HOMBRE',
        'CHINO CONFORT FIT DAMA',
        'CHOMBA FLOWING HOMBRE'
    ]
};

// Función para verificar si un producto está en la lista blanca
const isProductAllowed = (productName: string, category: string): boolean => {
    if (!productName) return false;
    
    const normalizedName = normalizeString(productName);
    
    // Obtener lista de productos permitidos
    let allowedList: string[] = [];
    if (category === 'TODOS') {
        // Si es TODOS, verificar en ambas listas
        const workwearList = ALLOWED_PRODUCTS.WORKWEAR || [];
        const basicList = ALLOWED_PRODUCTS.BASIC || [];
        allowedList = [...workwearList, ...basicList];
    } else {
        allowedList = ALLOWED_PRODUCTS[category as keyof typeof ALLOWED_PRODUCTS] || [];
    }
    
    // Verificar coincidencia: el nombre del producto debe contener el nombre permitido
    // o el nombre permitido debe contener el nombre del producto (para manejar variaciones)
    const isAllowed = allowedList.some(allowed => {
        const normalizedAllowed = normalizeString(allowed);
        
        // Coincidencia exacta
        if (normalizedName === normalizedAllowed) return true;
        
        // El nombre del producto contiene el permitido (ej: "CAMISA DRILL HOMBRE" contiene "CAMISA DRILL")
        if (normalizedName.includes(normalizedAllowed)) return true;
        
        // El nombre permitido contiene el nombre del producto (ej: para nombres más cortos en el Excel)
        if (normalizedAllowed.includes(normalizedName)) return true;
        
        // Matching por palabras clave principales (más flexible)
        // Extraer palabras clave del nombre permitido (primera y segunda palabra)
        const allowedWords = normalizedAllowed.split(' ').filter(w => w.length > 2);
        if (allowedWords.length >= 2) {
            const firstTwoWords = allowedWords.slice(0, 2).join(' ');
            if (normalizedName.includes(firstTwoWords)) return true;
        }
        
        return false;
    });
    
    // Debug temporal: mostrar productos que no coinciden
    if (!isAllowed && process.env.NODE_ENV === 'development') {
        console.log(`Producto no permitido: "${productName}" (categoría: ${category})`);
    }
    
    return isAllowed;
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
        sortBy: 'alfabetico-asc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Productos filtrados
    const filteredProducts = useMemo(() => {
        let filtered = [...groupedProducts];

        // PRIMERO: Filtro por categoría tipo (BASIC/WORKWEAR) con lista blanca de productos
        // Esto debe ir ANTES del filtro de imágenes para no perder productos válidos
        filtered = filtered.filter(product => {
            const productName = product.displayProduct.NOMBRE || product.skuBase || product.displayProduct.Descripcion || '';
            const rubro = normalizeString(product.displayProduct.Rubro || '');
            
            // Normalizar "office" a "basic" en el rubro
            const rubroNormalized = rubro === 'office' ? 'basic' : rubro;
            
            if (filters.categoriaTipo !== 'TODOS') {
                const categoriaTipoNormalized = normalizeString(filters.categoriaTipo);
                
                // Verificar si el rubro coincide con la categoría
                const rubroMatches = rubroNormalized.includes(categoriaTipoNormalized) || categoriaTipoNormalized.includes(rubroNormalized);
                
                if (!rubroMatches) return false;
                
                // Verificar si el producto está en la lista blanca de la categoría seleccionada
                return isProductAllowed(productName, filters.categoriaTipo);
            } else {
                // Si es TODOS, verificar que el producto esté en alguna lista blanca
                // y que el rubro sea workwear o basic/office
                const isWorkwear = rubroNormalized.includes('workwear');
                const isBasic = rubroNormalized.includes('basic') || rubro === 'office';
                
                if (!isWorkwear && !isBasic) return false;
                
                // Verificar si el producto está en la lista blanca
                return isProductAllowed(productName, 'TODOS');
            }
        });

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

        // FILTRO: Solo mostrar productos que tienen imágenes disponibles
        // Este filtro va al final para no interferir con la lista blanca
        // Si el producto está en la lista blanca, ser más permisivo con las imágenes
        filtered = filtered.filter(product => {
            const productName = product.displayProduct.NOMBRE || product.skuBase || product.displayProduct.Descripcion || '';
            const rubro = normalizeString(product.displayProduct.Rubro || '');
            const rubroNormalized = rubro === 'office' ? 'basic' : rubro;
            const isWorkwear = rubroNormalized.includes('workwear');
            const isBasic = rubroNormalized.includes('basic') || rubro === 'office';
            
            // Si está en la lista blanca, ser más permisivo
            if (isWorkwear || isBasic) {
                const category = isWorkwear ? 'WORKWEAR' : 'BASIC';
                if (isProductAllowed(productName, category)) {
                    // Si está en la lista blanca, siempre mostrar (incluso sin imágenes)
                    return true;
                }
            }
            
            // Para otros productos, verificar imágenes normalmente
            return hasProductImages(productName, product.availableColors);
        });

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
            case 'alfabetico-asc':
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                    const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                    return nombreA.localeCompare(nombreB);
                });
                break;
            case 'alfabetico-desc':
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                    const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                    return nombreB.localeCompare(nombreA);
                });
                break;
            case 'precio-asc':
                // Ordenar por precio ascendente (menor a mayor)
                filtered.sort((a, b) => {
                    const precioA = a.displayProduct.PrecioVenta || 0;
                    const precioB = b.displayProduct.PrecioVenta || 0;
                    if (precioA === 0 && precioB === 0) {
                        const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                        const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                        return nombreA.localeCompare(nombreB);
                    }
                    return precioA - precioB;
                });
                break;
            case 'precio-desc':
                // Ordenar por precio descendente (mayor a menor)
                filtered.sort((a, b) => {
                    const precioA = a.displayProduct.PrecioVenta || 0;
                    const precioB = b.displayProduct.PrecioVenta || 0;
                    if (precioA === 0 && precioB === 0) {
                        const nombreA = (a.displayProduct.NOMBRE || a.displayProduct.Descripcion || '').toLowerCase();
                        const nombreB = (b.displayProduct.NOMBRE || b.displayProduct.Descripcion || '').toLowerCase();
                        return nombreA.localeCompare(nombreB);
                    }
                    return precioB - precioA;
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

    const hasActiveFilters = useMemo(() => {
        return filters.searchTerm !== '' ||
               filters.categoriaTipo !== 'TODOS' ||
               filters.subrubro !== 'TODOS' ||
               filters.genero !== 'TODOS' ||
               filters.colores.length > 0 ||
               filters.talles.length > 0 ||
               filters.onlyFeatured ||
               filters.sortBy !== 'alfabetico-asc';
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

