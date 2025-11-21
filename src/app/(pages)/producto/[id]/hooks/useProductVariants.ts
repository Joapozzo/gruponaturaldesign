import { useState, useEffect } from 'react';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';

/**
 * Hook para manejar la selección de variantes (color y talle)
 */
export function useProductVariants(groupedProduct: GroupedProduct | null) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Inicializar con la primera variante cuando se carga el producto
    useEffect(() => {
        if (groupedProduct && groupedProduct.variants.length > 0) {
            const firstVariant = groupedProduct.variants[0];
            setSelectedVariant(firstVariant);
            setSelectedColor(firstVariant.color || null);
            setSelectedSize(firstVariant.talle || null);
        }
    }, [groupedProduct]);

    // Obtener talles disponibles para el color seleccionado
    const getAvailableSizesForColor = (color: string): string[] => {
        if (!groupedProduct) return [];
        const sizes = groupedProduct.variants
            .filter(v => v.color === color && v.talle)
            .map(v => v.talle!);
        return Array.from(new Set(sizes));
    };

    const availableSizes = selectedColor ? getAvailableSizesForColor(selectedColor) : [];

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setSelectedSize(null);

        // Buscar la primera variante con ese color
        const variantWithColor = groupedProduct?.variants.find(v => v.color === color);
        if (variantWithColor) {
            setSelectedVariant(variantWithColor);
            setSelectedSize(variantWithColor.talle || null);
        }
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);

        // Buscar la variante exacta con color y talle
        if (selectedColor && groupedProduct) {
            const variant = groupedProduct.variants.find(
                v => v.color === selectedColor && v.talle === size
            );
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    };

    return {
        selectedColor,
        selectedSize,
        selectedVariant,
        availableSizes,
        handleColorSelect,
        handleSizeSelect,
    };
}

