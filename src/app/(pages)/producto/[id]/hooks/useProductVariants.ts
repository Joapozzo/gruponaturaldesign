import { useState, useEffect } from 'react';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';

/**
 * Orden estándar de talles en letras
 */
const SIZE_ORDER: { [key: string]: number } = {
    'xxs': 1,
    'xs': 2,
    's': 3,
    'm': 4,
    'l': 5,
    'xl': 6,
    '2xl': 7,
    'xxl': 7,
    '3xl': 8,
    'xxxl': 8,
    '4xl': 9,
    'xxxxl': 9,
    '5xl': 10,
};

/**
 * Función para ordenar talles de manera lógica
 * - Números: de menor a mayor (36, 38, 40, 42)
 * - Letras: orden estándar (xs, s, m, l, xl, 2xl, 3xl)
 */
function sortSizes(sizes: string[]): string[] {
    return [...sizes].sort((a, b) => {
        const aLower = a.toLowerCase().trim();
        const bLower = b.toLowerCase().trim();

        // Verificar si ambos son números puros
        const aIsNumber = /^\d+$/.test(aLower);
        const bIsNumber = /^\d+$/.test(bLower);

        // Si ambos son números, ordenar numéricamente
        if (aIsNumber && bIsNumber) {
            return parseInt(aLower, 10) - parseInt(bLower, 10);
        }

        // Si uno es número y el otro no, los números van primero
        if (aIsNumber && !bIsNumber) return -1;
        if (!aIsNumber && bIsNumber) return 1;

        // Si ambos son letras, usar el orden predefinido
        const aOrder = SIZE_ORDER[aLower] || 999;
        const bOrder = SIZE_ORDER[bLower] || 999;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        // Si no está en el orden predefinido, ordenar alfabéticamente
        return aLower.localeCompare(bLower);
    });
}

/**
 * Hook para manejar la selección de variantes (color y talle)
 */
export function useProductVariants(groupedProduct: GroupedProduct | null) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Inicializar con la primera variante cuando se carga el producto
    // Si hay colores disponibles, seleccionar el primer color
    useEffect(() => {
        if (groupedProduct && groupedProduct.variants.length > 0) {
            // Si hay colores disponibles, seleccionar el primer color
            if (groupedProduct.availableColors && groupedProduct.availableColors.length > 0) {
                const firstColor = groupedProduct.availableColors[0];
                const firstVariantWithColor = groupedProduct.variants.find(v => v.color === firstColor);
                if (firstVariantWithColor) {
                    setSelectedVariant(firstVariantWithColor);
                    setSelectedColor(firstColor);
                    setSelectedSize(firstVariantWithColor.talle || null);
                    return;
                }
            }
            
            // Fallback: primera variante
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
    const orderedAvailableSizes = sortSizes(availableSizes);

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
        orderedAvailableSizes,
        handleColorSelect,
        handleSizeSelect,
    };
}

