import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { useCart } from '@/app/components/hooks/useCart';
import { createProductId, createProductSpecs, nombreToSlug, getProductImages } from '../helpers/productHelpers';
import { canAddQuantity } from '@/app/services/stockService';

/**
 * Hook para manejar la lógica del carrito
 */
export function useProductCart(
    groupedProduct: GroupedProduct | null,
    displayProduct: any,
    selectedVariant: ProductVariant | null,
    onWholesaleLimitReached?: () => void
) {
    const router = useRouter();
    const { addToCart, isInCart, canAddToCart, getProductQuantity, updateQuantity, itemCount } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (!selectedVariant || !groupedProduct) return;

        const productId = createProductId(selectedVariant.codigo);
        
        // Validar límite de 20 artículos totales
        const validation = canAddToCart(productId, 1);
        
        if (!validation.canAdd) {
            // Si hay callback, llamarlo; sino redirigir directamente (comportamiento anterior)
            if (onWholesaleLimitReached) {
                onWholesaleLimitReached();
            } else {
                router.push('/mayorista');
            }
            return;
        }
        
        // Validar stock disponible (lógica separada y delicada)
        const stock = selectedVariant.stock;
        const currentQuantity = getProductQuantity(productId);
        if (!canAddQuantity(stock, currentQuantity, 1)) {
            // No mostrar mensaje aquí, se maneja en el componente
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

        // Asegurar que el precio sea un número válido
        const precio = product.PrecioVenta 
            ? (typeof product.PrecioVenta === 'number' ? product.PrecioVenta : parseFloat(String(product.PrecioVenta).replace(/[^0-9.-]+/g, '')) || 0)
            : 0;
        
        addToCart(
            {
                id: productId,
                nombre: groupedProduct.skuBase || displayProduct.NOMBRE || 'Sin nombre',
                descripcion: displayProduct.Descripcion || displayProduct.DescripcionCorta || '',
                imagen: productImage,
                precio: precio,
                categoria: product.Rubro || 'Sin categoría',
                stock: stock, // Pasar stock al carrito para validaciones
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

        // Validar límite de 20 artículos totales
        const validation = canAddToCart(productId, 1);
        if (!validation.canAdd) {
            // Si hay callback, llamarlo; sino no hacer nada (comportamiento anterior)
            if (onWholesaleLimitReached) {
                onWholesaleLimitReached();
            }
            return;
        }
        
        // Validar stock disponible (lógica separada y delicada)
        const stock = selectedVariant.stock;
        if (!canAddQuantity(stock, currentQuantity, 1)) {
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

    // Validar límite de 20 artículos totales (mayorista)
    const validation = canAddToCart(productId, 1);
    const canAddMoreByLimit = validation.canAdd;
    const maxReachedLimit = itemCount >= 20; // Solo límite de 20 artículos totales
    
    // Validar stock disponible (lógica separada y delicada)
    const stock = selectedVariant?.stock;
    const canAddMoreByStock = canAddQuantity(stock, currentQuantity, 1);
    const maxReachedStock = !canAddMoreByStock; // Solo límite de stock
    
    // Se puede agregar más solo si cumple ambos: límite de 20 Y stock disponible
    const canAddMore = canAddMoreByLimit && canAddMoreByStock;
    
    // maxReached solo para el límite de 20 artículos (mayorista), NO para stock
    const maxReached = maxReachedLimit;

    return {
        handleAddToCart,
        handleIncrement,
        handleDecrement,
        isAdding,
        inCart,
        currentQuantity,
        canAddMore,
        maxReached,
        maxReachedStock, // Agregar información de stock alcanzado
        productId,
    };
}

