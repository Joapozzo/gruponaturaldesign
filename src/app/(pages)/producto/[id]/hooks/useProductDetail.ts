import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GroupedProduct } from '@/app/types/producto';
import { useGroupedProducts } from '@/app/hooks/useGroupedProducts';
import { nombreToSlug } from '../helpers/productHelpers';

interface OutfitRelations {
    // Palabras clave que identifican el tipo de producto
    keywords: string[];
    // Tipos de productos complementarios que deberían mostrarse
    complementaryTypes: string[];
    // Rubros complementarios
    complementaryRubros?: string[];
    // Subrubros complementarios
    complementarySubrubros?: string[];
}

// Configuración de relaciones para armar outfits
const OUTFIT_RELATIONS: OutfitRelations[] = [
    {
        keywords: ['camisa', 'shirt', 'remera', 'chomba'],
        complementaryTypes: ['pantalón', 'pantalon', 'jean', 'pantalones', 'abrigo', 'buzo', 'camisa', 'remera', 'chomba'],
        complementaryRubros: undefined, // Si es undefined, busca en todos los rubros
    },
    {
        keywords: ['pantalón', 'pantalon', 'jean', 'pantalones'],
        complementaryTypes: ['camisa', 'remera', 'chomba', 'shirt', 'abrigo', 'buzo', 'pantalón', 'pantalon'],
        complementaryRubros: undefined,
    },
    {
        keywords: ['buzo', 'abrigo', 'sweater', 'pullover'],
        complementaryTypes: ['camisa', 'remera', 'chomba', 'pantalón', 'pantalon', 'jean', 'buzo', 'abrigo'],
        complementaryRubros: undefined,
    },
    {
        keywords: ['chaleco', 'vest'],
        complementaryTypes: ['camisa', 'remera', 'chomba', 'pantalón', 'pantalon'],
        complementaryRubros: undefined,
    },
];


function findRelatedProductsForOutfit(
    currentProduct: GroupedProduct,
    allProducts: GroupedProduct[],
    maxResults: number = 4
): GroupedProduct[] {
    const productText = [
        currentProduct.displayProduct.Descripcion,
        currentProduct.displayProduct.NOMBRE,
        currentProduct.displayProduct.Rubro,
        currentProduct.displayProduct.Subrubro,
        currentProduct.skuBase,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    // Encontrar la relación que mejor coincida con el producto actual
    const matchingRelation = OUTFIT_RELATIONS.find(relation =>
        relation.keywords.some(keyword => productText.includes(keyword.toLowerCase()))
    );

    // Si no hay relación específica, usar lógica por defecto (mismo rubro)
    if (!matchingRelation) {
        return allProducts
            .filter(p => 
                p.displayProduct.Rubro === currentProduct.displayProduct.Rubro &&
                p.skuBase !== currentProduct.skuBase
            )
            .slice(0, maxResults);
    }

    // Buscar productos complementarios
    const relatedProducts: GroupedProduct[] = [];
    const usedSkus = new Set([currentProduct.skuBase]);

    // Prioridad 1: Productos con tipos complementarios (outfit matching)
    for (const product of allProducts) {
        if (relatedProducts.length >= maxResults) break;
        if (usedSkus.has(product.skuBase)) continue;

        const productTextToCheck = [
            product.displayProduct.Descripcion,
            product.displayProduct.NOMBRE,
            product.displayProduct.Rubro,
            product.displayProduct.Subrubro,
            product.skuBase,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const isComplementary = matchingRelation.complementaryTypes.some(type =>
            productTextToCheck.includes(type.toLowerCase())
        );

        const rubroMatch = !matchingRelation.complementaryRubros || 
            matchingRelation.complementaryRubros.length === 0 ||
            matchingRelation.complementaryRubros.some(rubro => 
                product.displayProduct.Rubro?.toLowerCase().includes(rubro.toLowerCase())
            );

        if (isComplementary && rubroMatch) {
            relatedProducts.push(product);
            usedSkus.add(product.skuBase);
        }
    }

    // Prioridad 2: Si no hay suficientes, agregar productos del mismo rubro
    if (relatedProducts.length < maxResults) {
        for (const product of allProducts) {
            if (relatedProducts.length >= maxResults) break;
            if (usedSkus.has(product.skuBase)) continue;

            if (product.displayProduct.Rubro === currentProduct.displayProduct.Rubro) {
                relatedProducts.push(product);
                usedSkus.add(product.skuBase);
            }
        }
    }

    // Prioridad 3: Si aún no hay suficientes, agregar productos del mismo subrubro
    if (relatedProducts.length < maxResults && currentProduct.displayProduct.Subrubro) {
        for (const product of allProducts) {
            if (relatedProducts.length >= maxResults) break;
            if (usedSkus.has(product.skuBase)) continue;

            if (product.displayProduct.Subrubro === currentProduct.displayProduct.Subrubro) {
                relatedProducts.push(product);
                usedSkus.add(product.skuBase);
            }
        }
    }

    return relatedProducts.slice(0, maxResults);
}

export function useProductDetail() {
    const params = useParams();
    const skuBase = decodeURIComponent(params.id as string);
    
    const [groupedProduct, setGroupedProduct] = useState<GroupedProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<GroupedProduct[]>([]);

    const { groupedProducts, isLoading: productsLoading, isError: productsError, isFetched: productsFetched } = useGroupedProducts();

    useEffect(() => {
        // Mientras los productos estén cargando O no se hayan fetcheado aún, no hacer nada
        if (productsLoading || !productsFetched) {
            return;
        }

        // Si hay un error o no hay productos después de que termine la carga, 
        // significa que no se encontró el producto o hubo un error
        if (productsError || groupedProducts.length === 0) {
            setGroupedProduct(null);
            setRelatedProducts([]);
            return;
        }

        // Una vez que los productos terminaron de cargar, buscar el producto
        // Normalizar el slug de búsqueda (sin query params)
        const normalizedSearchSlug = skuBase.toLowerCase().trim();
        
        // Remover posibles sufijos de color/talle del slug para búsqueda más flexible
        // Ej: "chomba-flowing-hombre-negro-2xl" -> "chomba-flowing-hombre"
        const removeColorSizeSuffix = (slug: string): string => {
            // Lista de colores y talles comunes para remover
            const suffixes = [
                'negro', 'blanco', 'azul', 'gris', 'rojo', 'verde', 'amarillo', 'naranja', 'rosa', 'violeta', 'beige', 'marron',
                'lavado-oscuro', 'lavado-claro', 'cemento', 'carbon', 'navy', 'khaki',
                '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', 'xxl', '3xl', 'xxxl', '4xl', 'xxxxl', '5xl',
                '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'
            ];
            
            let cleaned = slug;
            let previousLength = cleaned.length;
            
            // Remover sufijos de manera iterativa hasta que no haya más cambios
            do {
                previousLength = cleaned.length;
                for (const suffix of suffixes) {
                    // Remover el sufijo si está al final (con guión)
                    const regex = new RegExp(`-${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
                    cleaned = cleaned.replace(regex, '');
                }
            } while (cleaned.length < previousLength);
            
            return cleaned;
        };
        
        const cleanedSearchSlug = removeColorSizeSuffix(normalizedSearchSlug);
        
        // Buscar el producto por múltiples criterios para mayor flexibilidad
        // PRIORIDAD: Búsquedas exactas primero, luego búsquedas flexibles
        const foundProduct = groupedProducts.find(g => {
            const slug = g.skuBaseSlug || nombreToSlug(g.skuBase);
            const skuBaseLower = g.skuBase.toLowerCase();
            
            // 1. Buscar por slug exacto (coincidencia perfecta)
            if (slug.toLowerCase() === normalizedSearchSlug) return true;
            
            // 2. Buscar por skuBase exacto (coincidencia perfecta)
            if (skuBaseLower === normalizedSearchSlug) return true;
            
            // 3. Buscar por nombre del producto (NOMBRE) exacto
            if (g.displayProduct.NOMBRE) {
                const nombreSlug = nombreToSlug(g.displayProduct.NOMBRE);
                if (nombreSlug.toLowerCase() === normalizedSearchSlug) return true;
            }
            
            // 4. Búsquedas con slug limpiado (sin sufijos de color/talle)
            // Solo si el slug limpiado coincide exactamente
            if (slug.toLowerCase() === cleanedSearchSlug && cleanedSearchSlug !== normalizedSearchSlug) {
                return true;
            }
            
            if (skuBaseLower === cleanedSearchSlug && cleanedSearchSlug !== normalizedSearchSlug) {
                return true;
            }
            
            if (g.displayProduct.NOMBRE) {
                const nombreSlug = nombreToSlug(g.displayProduct.NOMBRE);
                if (nombreSlug.toLowerCase() === cleanedSearchSlug && cleanedSearchSlug !== normalizedSearchSlug) {
                    return true;
                }
            }
            
            // 5. Buscar por descripción (solo si coincide exactamente con el slug)
            if (g.displayProduct.Descripcion) {
                const descSlug = nombreToSlug(g.displayProduct.Descripcion);
                if (descSlug.toLowerCase() === normalizedSearchSlug) return true;
                if (descSlug.toLowerCase() === cleanedSearchSlug && cleanedSearchSlug !== normalizedSearchSlug) {
                    return true;
                }
            }
            
            // 6. Búsqueda por palabras clave: extraer palabras principales del slug
            // IMPORTANTE: "hombre" y "dama" son distintivos y NO deben filtrarse
            // Solo filtrar palabras realmente comunes que no son distintivas
            const commonWords = ['de', 'la', 'el', 'y', 'con', 'para', 'por', 'un', 'una', 'del', 'las', 'los'];
            const searchWords = cleanedSearchSlug.split('-')
                .filter(w => w.length > 2 && !commonWords.includes(w.toLowerCase()));
            const skuBaseWords = skuBaseLower.split(/\s+/)
                .filter(w => w.length > 2 && !commonWords.includes(w.toLowerCase()));
            const slugWords = slug.toLowerCase().split('-')
                .filter(w => w.length > 2 && !commonWords.includes(w.toLowerCase()));
            
            // Si no hay palabras distintivas, no hacer búsqueda por palabras clave
            if (searchWords.length === 0) {
                return false;
            }
            
            // Verificar que palabras distintivas como "hombre" o "dama" coincidan exactamente
            // Esto previene que "camisa-drill-dama" coincida con "camisa-drill-hombre"
            const genderWords = ['hombre', 'dama', 'unisex'];
            const searchHasGender = searchWords.some(w => genderWords.includes(w.toLowerCase()));
            const productHasGender = skuBaseWords.some(w => genderWords.includes(w.toLowerCase())) ||
                                    slugWords.some(w => genderWords.includes(w.toLowerCase()));
            
            // Si el slug de búsqueda tiene una palabra de género, el producto DEBE tener la misma
            if (searchHasGender && productHasGender) {
                const searchGender = searchWords.find(w => genderWords.includes(w.toLowerCase()));
                const productGender = skuBaseWords.find(w => genderWords.includes(w.toLowerCase())) ||
                                     slugWords.find(w => genderWords.includes(w.toLowerCase()));
                if (searchGender?.toLowerCase() !== productGender?.toLowerCase()) {
                    return false; // Géneros diferentes, no coinciden
                }
            } else if (searchHasGender && !productHasGender) {
                return false; // El slug tiene género pero el producto no
            } else if (!searchHasGender && productHasGender) {
                return false; // El producto tiene género pero el slug no
            }
            
            // Contar palabras que coinciden exactamente (no parcialmente)
            const exactMatches = searchWords.filter(word => 
                skuBaseWords.some(skuWord => skuWord === word) ||
                slugWords.some(slugWord => slugWord === word)
            );
            
            // Requerir que TODAS las palabras distintivas coincidan exactamente
            if (exactMatches.length === searchWords.length && searchWords.length >= 2) {
                return true;
            }
            
            // 7. Búsqueda inversa: verificar si el skuBase está contenido en el slug de búsqueda
            // Solo si es una coincidencia significativa (más de 10 caracteres)
            const skuBaseSlugClean = nombreToSlug(g.skuBase).toLowerCase();
            if (normalizedSearchSlug.includes(skuBaseSlugClean) || cleanedSearchSlug.includes(skuBaseSlugClean)) {
                // Verificar que no sea un match parcial muy corto y que sea una coincidencia significativa
                if (skuBaseSlugClean.length >= 10) {
                    // Verificar que no haya conflictos de género
                    const hasGenderConflict = (normalizedSearchSlug.includes('dama') && skuBaseSlugClean.includes('hombre')) ||
                                            (normalizedSearchSlug.includes('hombre') && skuBaseSlugClean.includes('dama'));
                    if (!hasGenderConflict) {
                        return true;
                    }
                }
            }
            
            return false;
        });

        if (foundProduct) {
            setGroupedProduct(foundProduct);

            // Obtener productos relacionados usando la función de outfit matching
            const related = findRelatedProductsForOutfit(
                foundProduct,
                groupedProducts,
                12
            );
            setRelatedProducts(related);
        } else {
            // Si no se encontró el producto, limpiar el estado
            setGroupedProduct(null);
            setRelatedProducts([]);
        }
    }, [skuBase, groupedProducts, productsLoading, productsError, productsFetched]);

    // isLoading es true mientras los productos estén cargando O no se hayan fetcheado aún
    const isLoading = productsLoading || !productsFetched;

    return {
        groupedProduct,
        relatedProducts,
        isLoading,
    };
}

// Exportar la función para que pueda ser usada en otros lugares si es necesario
export { findRelatedProductsForOutfit, OUTFIT_RELATIONS };

