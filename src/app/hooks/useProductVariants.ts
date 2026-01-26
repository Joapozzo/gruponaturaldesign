import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';

/**
 * Orden estándar de talles en letras
 * IMPORTANTE: 2XS debe ir primero, luego XS, S, M, L, XL, 2XL, 3XL, 4XL
 */
const SIZE_ORDER: { [key: string]: number } = {
    '2xs': 1,      // 2XS debe ir primero
    'xxs': 1,      // XXS es lo mismo que 2XS
    'xs': 2,
    's': 3,
    'm': 4,
    'l': 5,
    'xl': 6,
    '2xl': 7,
    'xxl': 7,      // XXL es lo mismo que 2XL
    '3xl': 8,
    'xxxl': 8,     // XXXL es lo mismo que 3XL
    '4xl': 9,
    'xxxxl': 9,    // XXXXL es lo mismo que 4XL
    '5xl': 10,
};

/**
 * Función para normalizar el nombre del talle antes de buscar en SIZE_ORDER
 * Convierte variantes como "2XS", "XXS" a "2xs" para búsqueda consistente
 */
function normalizeSizeForOrder(size: string): string {
    const normalized = size.toLowerCase().trim();
    
    // Normalizar variantes comunes
    if (normalized === 'xxs') return '2xs';
    if (normalized === 'xxl') return '2xl';
    if (normalized === 'xxxl') return '3xl';
    if (normalized === 'xxxxl') return '4xl';
    
    return normalized;
}

/**
 * Función para ordenar talles de manera lógica
 * - Números: de Menor a mayor (36, 38, 40, 42)
 * - Letras: orden estándar (2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl)
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

        // Si ambos son letras, normalizar y usar el orden predefinido
        const aNormalized = normalizeSizeForOrder(aLower);
        const bNormalized = normalizeSizeForOrder(bLower);
        
        const aOrder = SIZE_ORDER[aNormalized] || 999;
        const bOrder = SIZE_ORDER[bNormalized] || 999;

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
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Inicializar con la primera variante cuando se carga el producto
    // Leer query params de la URL si existen
    useEffect(() => {
        if (groupedProduct && groupedProduct.variants.length > 0) {
            // Leer color y talle de los query params
            const urlColor = searchParams.get('color');
            const urlTalle = searchParams.get('talle');
            
            // Si hay color en la URL, buscar variante con ese color
            if (urlColor && groupedProduct.availableColors) {
                // Buscar color que coincida (case insensitive)
                const matchingColor = groupedProduct.availableColors.find(
                    c => c.toLowerCase() === urlColor.toLowerCase()
                );
                
                if (matchingColor) {
                    // Si también hay talle en la URL, buscar variante exacta
                    if (urlTalle) {
                        const exactVariant = groupedProduct.variants.find(
                            v => v.color?.toLowerCase() === matchingColor.toLowerCase() && 
                                 v.talle?.toLowerCase() === urlTalle.toLowerCase()
                        );
                        if (exactVariant) {
                            setSelectedVariant(exactVariant);
                            setSelectedColor(matchingColor);
                            setSelectedSize(exactVariant.talle || null);
                            return;
                        }
                    }
                    
                    // Si solo hay color, seleccionar primera variante con ese color
                    const variantWithColor = groupedProduct.variants.find(
                        v => v.color?.toLowerCase() === matchingColor.toLowerCase()
                    );
                    if (variantWithColor) {
                        setSelectedVariant(variantWithColor);
                        setSelectedColor(matchingColor);
                        setSelectedSize(variantWithColor.talle || null);
                        return;
                    }
                }
            }
            
            // Si hay colores disponibles pero no hay query params, seleccionar el primer color
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
    }, [groupedProduct, searchParams]);

    // Obtener talles disponibles para el color seleccionado
    // IMPORTANTE: Solo mostrar talles que realmente existen para ese color específico
    const getAvailableSizesForColor = (color: string): string[] => {
        if (!groupedProduct || !color) return [];
        
        // Filtrar variantes por color y extraer talles únicos
        // Solo incluir variantes que tienen stock > 0 o que existen físicamente
        const sizes = groupedProduct.variants
            .filter(v => {
                // Filtrar por color exacto (case insensitive)
                const colorMatch = v.color?.toLowerCase() === color.toLowerCase();
                // Solo incluir si tiene talle definido
                const hasTalle = !!v.talle;
                return colorMatch && hasTalle;
            })
            .map(v => v.talle!)
            .filter((talle, index, self) => self.indexOf(talle) === index); // Eliminar duplicados
        
        return sizes;
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
        
        // Actualizar URL con el nuevo color
        updateURL(color, null);
    };

    const handleSizeSelect = (size: string) => {
        // Verificar que el talle existe para el color seleccionado
        if (!selectedColor || !groupedProduct) return;
        
        // Buscar la variante exacta con color y talle
        const variant = groupedProduct.variants.find(
            v => v.color?.toLowerCase() === selectedColor.toLowerCase() && v.talle === size
        );
        
        // Solo actualizar si la variante existe
        if (variant) {
            setSelectedSize(size);
            setSelectedVariant(variant);
            // Actualizar URL con el nuevo talle
            updateURL(selectedColor, size);
        }
    };
    
    // Función para actualizar la URL sin recargar la página
    const updateURL = (color: string | null, talle: string | null) => {
        const params = new URLSearchParams();
        if (color) params.set('color', color.toLowerCase());
        if (talle) params.set('talle', talle);
        
        const queryString = params.toString();
        const newUrl = queryString 
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;
        
        // Actualizar URL sin recargar
        router.replace(newUrl, { scroll: false });
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

