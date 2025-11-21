import { useState } from 'react';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { useCart } from '@/app/components/hooks/useCart';
import { createProductId, createProductSpecs } from '../helpers/productHelpers';

/**
 * Hook para manejar la lógica del carrito
 */
export function useProductCart(
    groupedProduct: GroupedProduct | null,
    displayProduct: any,
    selectedVariant: ProductVariant | null
) {
    const { addToCart, isInCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (!selectedVariant || !groupedProduct) return;

        setIsAdding(true);

        const product = selectedVariant.producto;
        const productId = createProductId(selectedVariant.codigo);
        const specs = createProductSpecs(
            selectedVariant.color,
            selectedVariant.talle,
            selectedVariant.codigo,
            selectedVariant.variantNumber
        );

        addToCart(
            {
                id: productId,
                nombre: groupedProduct.skuBase || displayProduct.NOMBRE || 'Sin nombre',
                descripcion: displayProduct.Descripcion || displayProduct.DescripcionCorta || '',
                imagen: product.imagen || (product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : '') || '',
                precio: product.PrecioVenta || 0,
                categoria: product.Rubro || 'Sin categoría',
            },
            1,
            specs
        );

        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const productId = selectedVariant ? createProductId(selectedVariant.codigo) : 0;
    const inCart = isInCart(productId);

    return {
        handleAddToCart,
        isAdding,
        inCart,
    };
}

