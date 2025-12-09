import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { useCart } from '@/app/components/hooks/useCart';
import { createProductId, createProductSpecs, nombreToSlug, getProductImages } from '../helpers/productHelpers';

/**
 * Hook para manejar la lógica del carrito
 */
export function useProductCart(
    groupedProduct: GroupedProduct | null,
    displayProduct: any,
    selectedVariant: ProductVariant | null
) {
    const router = useRouter();
    const { addToCart, isInCart, canAddToCart, getProductQuantity, updateQuantity, itemCount } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (!selectedVariant || !groupedProduct) return;

        const productId = createProductId(selectedVariant.codigo);
        
        // Validar límites antes de agregar
        const validation = canAddToCart(productId, 1);
        
        if (!validation.canAdd) {
            // Redirigir a página mayorista
            router.push('/mayorista');
            return;
        }

        setIsAdding(true);

        const product = selectedVariant.producto;
        const specs = createProductSpecs(
            selectedVariant.color,
            selectedVariant.talle,
            selectedVariant.codigo,
            selectedVariant.variantNumber
        );

        // Obtener la imagen correcta basada en el color seleccionado
        // Usar la misma lógica que useProductImages para obtener la imagen actual
        const productName = groupedProduct.skuBase || displayProduct.NOMBRE || '';
        const currentImages = getProductImages(
            product.imagenes,
            product.imagen,
            1, // Solo necesitamos la primera imagen
            productName,
            selectedVariant.color,
            groupedProduct.availableColors
        );
        
        // Usar la primera imagen de las imágenes actuales (ya filtradas por color)
        const productImage = currentImages && currentImages.length > 0 
            ? currentImages[0] 
            : product.imagen || (product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : '') || '';

        addToCart(
            {
                id: productId,
                nombre: groupedProduct.skuBase || displayProduct.NOMBRE || 'Sin nombre',
                descripcion: displayProduct.Descripcion || displayProduct.DescripcionCorta || '',
                imagen: productImage,
                precio: product.PrecioVenta || 0,
                categoria: product.Rubro || 'Sin categoría',
                skuBaseSlug: groupedProduct.skuBaseSlug || nombreToSlug(groupedProduct.skuBase),
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
    const currentQuantity = getProductQuantity(productId);

    // Calcular canAddMore y maxReached
    const handleIncrement = () => {
        if (!selectedVariant || !groupedProduct) return;

        const validation = canAddToCart(productId, 1);
        if (!validation.canAdd) {
            return;
        }

        if (currentQuantity === 0) {
            handleAddToCart();
        } else {
            updateQuantity(productId, currentQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (currentQuantity <= 1) {
            return;
        }
        updateQuantity(productId, currentQuantity - 1);
    };

    const validation = canAddToCart(productId, 1);
    const canAddMore = validation.canAdd;
    const maxReached = itemCount >= 20;

    return {
        handleAddToCart,
        handleIncrement,
        handleDecrement,
        isAdding,
        inCart,
        currentQuantity,
        canAddMore,
        maxReached,
        productId,
    };
}

