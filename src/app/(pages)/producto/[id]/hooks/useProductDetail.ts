import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { useGroupedProducts } from '@/app/hooks/useGroupedProducts';
import { nombreToSlug } from '../helpers/productHelpers';

/**
 * Hook para manejar la lógica principal de la página de producto
 */
export function useProductDetail() {
    const params = useParams();
    const skuBase = decodeURIComponent(params.id as string);
    
    const [groupedProduct, setGroupedProduct] = useState<GroupedProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<GroupedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { groupedProducts, isLoading: productsLoading } = useGroupedProducts();

    useEffect(() => {
        if (!productsLoading && groupedProducts.length > 0) {
            // Buscar el producto por slug o por nombre original
            const foundProduct = groupedProducts.find(g => {
                const slug = g.skuBaseSlug || nombreToSlug(g.skuBase);
                return slug === skuBase || g.skuBase === skuBase;
            });

            if (foundProduct) {
                setGroupedProduct(foundProduct);

                // Obtener productos relacionados (misma categoría, excluyendo el actual)
                const related = groupedProducts
                    .filter(p =>
                        p.displayProduct.Rubro === foundProduct.displayProduct.Rubro &&
                        p.skuBase !== foundProduct.skuBase
                    )
                    .slice(0, 4);
                setRelatedProducts(related);
            }
            setIsLoading(false);
        }
    }, [skuBase, groupedProducts, productsLoading]);

    return {
        groupedProduct,
        relatedProducts,
        isLoading,
    };
}

