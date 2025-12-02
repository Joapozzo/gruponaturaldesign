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
        // Buscar el producto por slug o por nombre original
        const foundProduct = groupedProducts.find(g => {
            const slug = g.skuBaseSlug || nombreToSlug(g.skuBase);
            return slug === skuBase || g.skuBase === skuBase;
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

