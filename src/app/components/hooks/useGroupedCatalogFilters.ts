import { useState, useMemo } from 'react';
import { GroupedProductV2 } from '../../types/producto-v2';
import { FilterState } from './useCatalogFilters';
import { hasProductImages } from '@/app/(pages)/producto/[id]/helpers/productHelpers';

export interface UseGroupedCatalogFiltersProps {
    products: GroupedProductV2[];
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
// ACTUALIZADA para coincidir con los productos reales del Excel
const ALLOWED_PRODUCTS = {
    WORKWEAR: [
        'CAMISA DRILL',
        'BUZO STANDARD',
        'CARGO BALANCE',
        'CARGO BOLT',
        'CARGO IMPACTED',
        'CHOMBA RIVET',
        'REMERA BASE',
        'JEAN FLOW',
        'ROMPEVIENTO RANGER'
    ],
    BASIC: [
        'CAMISA EXECUTIVE',
        'REMERA GENTLE',
        'CARDIGAN CHARM',
        'CHINO SIGNATURE',  // Era "CHINO CONFORT FIT" en la lista anterior
        'CHOMBA FLOWING',
        'BOMBER ESSENCE'    // Era "SWEATER ESSENCE" en la lista anterior
    ]
};

// Función para verificar si un producto está en la lista blanca
// TEMPORALMENTE DESHABILITADA - No se usa actualmente
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        // Matching por palabras clave principales (MÁS FLEXIBLE)
        // Extraer las primeras 2 palabras significativas del nombre permitido
        const allowedWords = normalizedAllowed.split(' ').filter(w => w.length > 2);
        const productWords = normalizedName.split(' ').filter(w => w.length > 2);

        // Si ambos tienen al menos 2 palabras, verificar que las primeras 2 coincidan
        if (allowedWords.length >= 2 && productWords.length >= 2) {
            const allowedFirstTwo = allowedWords.slice(0, 2);
            const productFirstTwo = productWords.slice(0, 2);

            // Verificar que las 2 primeras palabras del permitido estén en las primeras palabras del producto
            const match = allowedFirstTwo.every(word => productFirstTwo.includes(word));
            if (match) return true;
        }

        // Fallback: si el nombre permitido tiene al menos 2 palabras, verificar que estén en el producto
        if (allowedWords.length >= 2) {
            const firstTwoWords = allowedWords.slice(0, 2);
            const allWordsPresent = firstTwoWords.every(word => normalizedName.includes(word));
            if (allWordsPresent) return true;
        }

        return false;
    });

    // Debug temporal: mostrar productos que no coinciden
    if (!isAllowed && process.env.NODE_ENV === 'development') {
        console.log(`❌ Producto no permitido: "${productName}" (categoría: ${category})`);
    }

    return isAllowed;
};

// Función para extraer género del código o nombre del producto
const extractGender = (product: GroupedProductV2): string | null => {
    const nombre = normalizeString(product.displayProduct.nombreBase || product.displayProduct.item || '');
    const codigo = normalizeString(product.displayProduct.codigo || '');
    
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

export const useGroupedCatalogFilters = ({ products, itemsPerPage = 12 }: UseGroupedCatalogFiltersProps) => {
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
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 INICIANDO FILTRADO - Total productos:', products.length);
        }
        let filtered = [...products];

        // PRIMERO: Filtro por categoría tipo (BASIC/WORKWEAR)
        filtered = filtered.filter(product => {
            const productName = product.displayProduct.nombreBase || product.skuBase || product.displayProduct.item || '';
            const rubroNormalizado = product.displayProduct.rubroNormalizado; // Ya viene normalizado: 'WORKWEAR' o 'BASIC'

            if (filters.categoriaTipo !== 'TODOS') {
                // Comparación directa (case-insensitive) ya que ambos deberían ser 'WORKWEAR' o 'BASIC'
                const categoriaTipoUpper = filters.categoriaTipo.toUpperCase();
                const rubroNormalizadoUpper = (rubroNormalizado || '').toUpperCase();

                // Verificar si el rubro coincide exactamente con la categoría
                const rubroMatches = rubroNormalizadoUpper === categoriaTipoUpper;

                if (!rubroMatches) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`❌ Producto rechazado (rubro no coincide): "${productName}" - Rubro normalizado: "${rubroNormalizado}" - Categoría filtro: "${filters.categoriaTipo}"`);
                    }
                    return false;
                }

                return true;
            } else {
                // Si es TODOS, verificar que el rubro sea workwear o basic
                const isValidRubro = rubroNormalizado === 'WORKWEAR' || rubroNormalizado === 'BASIC';
                if (!isValidRubro && process.env.NODE_ENV === 'development') {
                    console.log(`⚠️ Producto con rubro inválido: "${productName}" - Rubro normalizado: "${rubroNormalizado}"`);
                }
                return isValidRubro;
            }
        });

        if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development') {
            console.log('✅ Después de filtro de categoría:', filtered.length);
        }
        }

        // Filtro por término de búsqueda (insensible a acentos)
        if (filters.searchTerm) {
            const normalizedSearchTerm = normalizeString(filters.searchTerm);
            filtered = filtered.filter(product => {
                const nombre = normalizeString(product.displayProduct.nombreBase || product.displayProduct.item || '');
                const descripcion = normalizeString(product.displayProduct.item || '');
                const rubro = normalizeString(product.displayProduct.rubro || '');
                const subrubro = normalizeString(product.displayProduct.subrubro || '');
                
                return nombre.includes(normalizedSearchTerm) ||
                       descripcion.includes(normalizedSearchTerm) ||
                       rubro.includes(normalizedSearchTerm) ||
                       subrubro.includes(normalizedSearchTerm);
            });
        }

        // FILTRO: Temporalmente deshabilitado - mostrar todos los productos aunque no tengan imágenes
        // (Las imágenes se agregarán después cuando se renombren las carpetas)
        // filtered = filtered.filter(product => {
        //     const productName = product.displayProduct.nombreBase || product.skuBase || product.displayProduct.item || '';
        //     const hasImages = product.displayProduct.imagenes && product.displayProduct.imagenes.length > 0;
        //     if (!hasImages && process.env.NODE_ENV === 'development') {
        //         console.log(`❌ Producto rechazado (sin imágenes): "${productName}" - Imágenes: ${product.displayProduct.imagenes?.length || 0}`);
        //     }
        //     return hasImages;
        // });

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Después de filtro de imágenes:', filtered.length);
        }

        // Filtro por subrubro
        if (filters.subrubro !== 'TODOS') {
            filtered = filtered.filter(product => {
                const subrubro = normalizeString(product.displayProduct.subrubro || '');
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
                    const nombreA = (a.displayProduct.nombreBase || a.displayProduct.item || '').toLowerCase();
                    const nombreB = (b.displayProduct.nombreBase || b.displayProduct.item || '').toLowerCase();
                    return nombreA.localeCompare(nombreB);
                });
                break;
            case 'alfabetico-desc':
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.nombreBase || a.displayProduct.item || '').toLowerCase();
                    const nombreB = (b.displayProduct.nombreBase || b.displayProduct.item || '').toLowerCase();
                    return nombreB.localeCompare(nombreA);
                });
                break;
            case 'precio-asc':
                // Ordenar por precio ascendente (menor a mayor)
                filtered.sort((a, b) => {
                    const precioA = a.displayProduct.precioLista || 0;
                    const precioB = b.displayProduct.precioLista || 0;
                    if (precioA === 0 && precioB === 0) {
                        const nombreA = (a.displayProduct.nombreBase || a.displayProduct.item || '').toLowerCase();
                        const nombreB = (b.displayProduct.nombreBase || b.displayProduct.item || '').toLowerCase();
                        return nombreA.localeCompare(nombreB);
                    }
                    return precioA - precioB;
                });
                break;
            case 'precio-desc':
                // Ordenar por precio descendente (mayor a menor)
                filtered.sort((a, b) => {
                    const precioA = a.displayProduct.precioLista || 0;
                    const precioB = b.displayProduct.precioLista || 0;
                    if (precioA === 0 && precioB === 0) {
                        const nombreA = (a.displayProduct.nombreBase || a.displayProduct.item || '').toLowerCase();
                        const nombreB = (b.displayProduct.nombreBase || b.displayProduct.item || '').toLowerCase();
                        return nombreB.localeCompare(nombreA);
                    }
                    return precioB - precioA;
                });
                break;
            case 'destacados':
                // Por ahora no hay campo destacado, mantener orden alfabético
                filtered.sort((a, b) => {
                    const nombreA = (a.displayProduct.nombreBase || a.displayProduct.item || '').toLowerCase();
                    const nombreB = (b.displayProduct.nombreBase || b.displayProduct.item || '').toLowerCase();
                    return nombreA.localeCompare(nombreB);
                });
                break;
        }

        return filtered;
    }, [products, filters]);

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
        
        products.forEach(product => {
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
    }, [products]);

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

