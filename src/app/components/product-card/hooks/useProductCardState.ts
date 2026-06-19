import { useState, useEffect, useCallback } from 'react';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';

interface UseProductCardStateProps {
    group: GroupedProduct;
    expandedSku?: string | null;
    onExpandChange?: (sku: string | null) => void;
}

export function useProductCardState({
    group,
    expandedSku,
    onExpandChange,
}: UseProductCardStateProps) {
    // Función para encontrar la variante inicial usando el orden de availableColors
    // availableColors ya está ordenado por prioridad según el producto (incluye excepciones)
    const getInitialVariant = useCallback((): ProductVariant => {
        // Función helper para verificar si una variante tiene imágenes válidas
        const hasValidImages = (variant: ProductVariant): boolean => {
            const imagen = variant.producto.imagen?.trim();
            if (imagen && !imagen.includes('producto-placeholder')) {
                return true;
            }
            const imagenes =
                variant.producto.imagenes?.filter(
                    (img) => img?.trim() && !img.includes('producto-placeholder'),
                ) ?? [];
            return imagenes.length > 0;
        };
        
        // Usar el orden de availableColors que ya está ordenado por prioridad
        // Esto respeta las excepciones para productos específicos (Tostado, Cemento, Azul Marino)
        if (group.availableColors && group.availableColors.length > 0) {
            for (const priorityColor of group.availableColors) {
                const variantWithPriorityColor = group.variants.find(v => 
                    v.color && 
                    v.color.toLowerCase() === priorityColor.toLowerCase() &&
                    hasValidImages(v)
                );
                if (variantWithPriorityColor) {
                    return variantWithPriorityColor;
                }
            }
        }
        
        // Si no hay colores prioritarios con imágenes, buscar la primera variante CON IMÁGENES
        const variantWithImages = group.variants.find(v => hasValidImages(v));
        if (variantWithImages) {
            return variantWithImages;
        }
        
        // Si ninguna tiene imágenes, usar la primera variante disponible (fallback)
        return group.variants[0];
    }, [group.variants, group.availableColors]);

    const initialVariant = getInitialVariant();
    
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);
    const [selectedColor, setSelectedColor] = useState<string | null>(initialVariant.color || null);
    const [selectedSize, setSelectedSize] = useState<string | null>(initialVariant.talle || null);

    // Controlar expansión: si hay un callback, usar estado controlado
    const isExpanded = expandedSku === group.skuBase;

    // Detectar si es mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Sincronizar estado local con estado controlado
    useEffect(() => {
        if (onExpandChange) {
            setShowVariants(isExpanded);
        }
    }, [isExpanded, onExpandChange]);

    // Actualizar variante inicial cuando cambia el grupo (usando orden de availableColors)
    useEffect(() => {
        const newInitialVariant = getInitialVariant();
        // Verificar si la variante actual es de un color prioritario según availableColors
        const currentIsPriority = selectedVariant.color && 
            group.availableColors && 
            group.availableColors.length > 0 &&
            group.availableColors[0]?.toLowerCase() === selectedVariant.color.toLowerCase();
        
        // Solo actualizar si la variante actual no es el color prioritario
        if (!currentIsPriority) {
            setSelectedVariant(newInitialVariant);
            setSelectedColor(newInitialVariant.color || null);
            setSelectedSize(newInitialVariant.talle || null);
        }
    }, [group.variants, group.availableColors, getInitialVariant, selectedVariant.color]);

    // Detectar si tiene data de color/talle
    const hasColorSizeData: boolean = group.variants.some((v) => v.color && v.talle);

    // Obtener talles disponibles para el color seleccionado
    const getAvailableSizesForColor = (color: string): string[] => {
        const sizes = group.variants
            .filter((v) => v.color === color && v.talle)
            .map((v) => v.talle!);
        return Array.from(new Set(sizes));
    };

    const availableSizes = selectedColor ? getAvailableSizesForColor(selectedColor) : [];

    // Handlers
    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onExpandChange) {
            onExpandChange(isExpanded ? null : group.skuBase);
        } else {
            setShowVariants(!showVariants);
        }
    };

    const handleVariantSelect = (variant: ProductVariant, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    const handleColorSelect = (color: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedColor(color);
        setSelectedSize(null);

        const variantWithColor = group.variants.find((v) => v.color === color);
        if (variantWithColor) {
            setSelectedVariant(variantWithColor);
            setSelectedSize(variantWithColor.talle || null);
        }
    };

    const handleSizeSelect = (size: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSize(size);

        if (selectedColor) {
            const variant = group.variants.find((v) => v.color === selectedColor && v.talle === size);
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    };

    // Solo permitir hover en desktop
    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovered(false);
        }
    };

    return {
        isHovered,
        isMobile,
        isAdding,
        setIsAdding,
        isExpanded,
        selectedVariant,
        selectedColor,
        selectedSize,
        hasColorSizeData,
        availableSizes,
        handleToggleExpand,
        handleVariantSelect,
        handleColorSelect,
        handleSizeSelect,
        handleMouseEnter,
        handleMouseLeave,
    };
}

