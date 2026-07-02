import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';
import { filterTallesForWebSelector } from '@/app/utils/webTalles.util';

const SIZE_ORDER: { [key: string]: number } = {
    '2xs': 1,
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

function normalizeSizeForOrder(size: string): string {
    const normalized = size.toLowerCase().trim();
    if (normalized === 'xxs') return '2xs';
    if (normalized === 'xxl') return '2xl';
    if (normalized === 'xxxl') return '3xl';
    if (normalized === 'xxxxl') return '4xl';
    return normalized;
}

function sortSizes(sizes: string[]): string[] {
    return [...sizes].sort((a, b) => {
        const aLower = a.toLowerCase().trim();
        const bLower = b.toLowerCase().trim();
        const aIsNumber = /^\d+$/.test(aLower);
        const bIsNumber = /^\d+$/.test(bLower);

        if (aIsNumber && bIsNumber) {
            return parseInt(aLower, 10) - parseInt(bLower, 10);
        }
        if (aIsNumber && !bIsNumber) return -1;
        if (!aIsNumber && bIsNumber) return 1;

        const aOrder = SIZE_ORDER[normalizeSizeForOrder(aLower)] || 999;
        const bOrder = SIZE_ORDER[normalizeSizeForOrder(bLower)] || 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return aLower.localeCompare(bLower);
    });
}

function hasStock(variant: ProductVariant): boolean {
    return (variant.stock ?? 0) > 0;
}

function hasVariantImages(variant: ProductVariant): boolean {
    const imagenes =
        variant.producto.imagenes?.filter(
            (img) => img?.trim() && !img.includes('producto-placeholder'),
        ) ?? [];
    const imagen = variant.producto.imagen?.trim();
    return (
        imagenes.length > 0 ||
        Boolean(imagen && !imagen.includes('producto-placeholder'))
    );
}

function hasProductLevelImages(groupedProduct: GroupedProduct): boolean {
    const imagenes =
        groupedProduct.displayProduct.imagenes?.filter(
            (img) => img?.trim() && !img.includes('producto-placeholder'),
        ) ?? [];
    const imagen = groupedProduct.displayProduct.imagen?.trim();
    return (
        imagenes.length > 0 ||
        Boolean(imagen && !imagen.includes('producto-placeholder'))
    );
}

function hasColorImages(groupedProduct: GroupedProduct, color: string): boolean {
    const colorLower = color.toLowerCase();
    return groupedProduct.variants.some(
        (v) =>
            v.color?.toLowerCase() === colorLower && hasVariantImages(v),
    );
}

function isValidSelectableVariant(
    variant: ProductVariant,
    requireStock: boolean,
    groupedProduct?: GroupedProduct | null,
): boolean {
    const skipImageCheck =
        groupedProduct != null &&
        !productHasColors(groupedProduct) &&
        hasProductLevelImages(groupedProduct);

    if (!skipImageCheck) {
        if (
            variant.color &&
            groupedProduct &&
            productHasColors(groupedProduct)
        ) {
            if (!hasColorImages(groupedProduct, variant.color)) return false;
        } else if (!hasVariantImages(variant)) {
            return false;
        }
    }
    if (requireStock && !hasStock(variant)) return false;
    if (!variant.talle && groupedProduct?.availableSizes?.length) return false;
    return true;
}

function getProductColors(groupedProduct: GroupedProduct): string[] {
    return Array.from(
        new Set(
            groupedProduct.variants
                .map((v) => v.color)
                .filter((c): c is string => Boolean(c)),
        ),
    );
}

function productHasColors(groupedProduct: GroupedProduct): boolean {
    const fromAvailable = groupedProduct.availableColors?.length ?? 0;
    if (fromAvailable > 0) return true;
    return getProductColors(groupedProduct).length > 0;
}

function colorsMatch(
    variantColor: string | null | undefined,
    selectedColor: string | null,
): boolean {
    if (selectedColor) {
        return variantColor?.toLowerCase() === selectedColor.toLowerCase();
    }
    return variantColor == null || variantColor === '';
}

function getAllTalles(groupedProduct: GroupedProduct): string[] {
    if (groupedProduct.availableSizes && groupedProduct.availableSizes.length > 0) {
        return groupedProduct.availableSizes;
    }
    return Array.from(
        new Set(
            groupedProduct.variants
                .map((v) => v.talle)
                .filter((t): t is string => Boolean(t)),
        ),
    );
}

function findBestVariantForTalle(
    groupedProduct: GroupedProduct,
    talle: string,
    selectedColor: string | null,
    requireStock: boolean,
): ProductVariant | undefined {
    const matches = groupedProduct.variants.filter(
        (v) => colorsMatch(v.color, selectedColor) && v.talle === talle,
    );
    if (matches.length === 0) return undefined;

    const withStock = matches.filter((v) => !requireStock || hasStock(v));
    const pool = withStock.length > 0 ? withStock : requireStock ? [] : matches;
    if (pool.length === 0) return undefined;

    return pool.reduce((best, v) => {
        if ((v.stock ?? 0) > (best.stock ?? 0)) return v;
        if ((v.stock ?? 0) < (best.stock ?? 0)) return best;
        return (v.productoWebId ?? 0) > (best.productoWebId ?? 0) ? v : best;
    });
}

function findDefaultForTalleOnlyProduct(
    groupedProduct: GroupedProduct,
    preferredTalle?: string | null,
): { variant: ProductVariant; color: string | null; size: string | null } | null {
    const talles = sortSizes(getAllTalles(groupedProduct));

    if (preferredTalle) {
        const exact = findBestVariantForTalle(groupedProduct, preferredTalle, null, true)
            ?? findBestVariantForTalle(groupedProduct, preferredTalle, null, false);
        if (exact) {
            return { variant: exact, color: null, size: exact.talle ?? null };
        }
    }

    for (const talle of talles) {
        const v = findBestVariantForTalle(groupedProduct, talle, null, true);
        if (v) return { variant: v, color: null, size: talle };
    }

    for (const talle of talles) {
        const v = findBestVariantForTalle(groupedProduct, talle, null, false);
        if (v) return { variant: v, color: null, size: talle };
    }

    return null;
}

function findBestSelectableVariantForColor(
    groupedProduct: GroupedProduct,
    color: string,
    preferredTalle?: string | null,
    requireStock = true,
): ProductVariant | undefined {
    const colorLower = color.toLowerCase();
    const colorVariants = groupedProduct.variants.filter(
        (v) => v.color?.toLowerCase() === colorLower,
    );

    if (preferredTalle) {
        const exact = colorVariants.find(
            (v) =>
                v.talle?.toLowerCase() === preferredTalle.toLowerCase() &&
                isValidSelectableVariant(v, requireStock, groupedProduct),
        );
        if (exact) return exact;
    }

    const sizes = sortSizes(
        colorVariants
            .filter((v) => !!v.talle && isValidSelectableVariant(v, requireStock, groupedProduct))
            .map((v) => v.talle!)
            .filter((talle, index, self) => self.indexOf(talle) === index),
    );

    for (const talle of sizes) {
        const variant = colorVariants.find(
            (v) => v.talle === talle && isValidSelectableVariant(v, requireStock, groupedProduct),
        );
        if (variant) return variant;
    }

    return colorVariants.find((v) => isValidSelectableVariant(v, requireStock, groupedProduct));
}

function getColorUnselectableReason(
    groupedProduct: GroupedProduct,
    color: string,
): string | null {
    if (
        findBestSelectableVariantForColor(groupedProduct, color, null, true) ||
        findBestSelectableVariantForColor(groupedProduct, color, null, false)
    ) {
        return null;
    }

    const colorLower = color.toLowerCase();
    const colorVariants = groupedProduct.variants.filter(
        (v) => v.color?.toLowerCase() === colorLower,
    );

    if (colorVariants.length === 0) return 'No disponible';

    const withStock = colorVariants.filter((v) => hasStock(v));
    if (withStock.length === 0) return 'Sin stock';

    const withStockAndImage = withStock.filter((v) =>
        isValidSelectableVariant(v, false, groupedProduct),
    );
    if (withStockAndImage.length === 0) return 'Sin imagen para este color';

    return 'No disponible';
}

export type ColorSelectability = {
    selectable: boolean;
    reason?: string;
};

function findDefaultSelectableVariant(
    groupedProduct: GroupedProduct,
    preferredTalle?: string | null,
): { variant: ProductVariant; color: string } | null {
    const colors =
        groupedProduct.availableColors && groupedProduct.availableColors.length > 0
            ? groupedProduct.availableColors
            : getProductColors(groupedProduct);

    for (const color of colors) {
        const variant = findBestSelectableVariantForColor(
            groupedProduct,
            color,
            preferredTalle,
            true,
        );
        if (variant) return { variant, color };
    }

    for (const color of colors) {
        const variant = findBestSelectableVariantForColor(
            groupedProduct,
            color,
            preferredTalle,
            false,
        );
        if (variant) return { variant, color };
    }

    return null;
}

function buildProductUrl(color: string | null, talle: string | null, pathname: string): string {
    const params = new URLSearchParams();
    if (color) params.set('color', color.toLowerCase());
    if (talle) params.set('talle', talle);
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
}

function urlMatchesSelection(
    searchParams: URLSearchParams | null,
    color: string | null,
    size: string | null,
): boolean {
    const urlColor = searchParams?.get('color')?.toLowerCase() ?? null;
    const urlTalle = searchParams?.get('talle') ?? null;
    const expectedColor = color?.toLowerCase() ?? null;
    const expectedTalle = size ?? null;
    return urlColor === expectedColor && urlTalle === (expectedTalle ?? null);
}

function findBestVariantForColor(
    groupedProduct: GroupedProduct,
    color: string,
    preferredTalle?: string | null,
    requireStock = true,
): ProductVariant | undefined {
    const colorLower = color.toLowerCase();

    if (preferredTalle) {
        const exact = groupedProduct.variants.find(
            (v) =>
                v.color?.toLowerCase() === colorLower &&
                v.talle?.toLowerCase() === preferredTalle.toLowerCase() &&
                (!requireStock || hasStock(v)),
        );
        if (exact) return exact;
    }

    const sizes = sortSizes(
        groupedProduct.variants
            .filter(
                (v) =>
                    v.color?.toLowerCase() === colorLower &&
                    !!v.talle &&
                    (!requireStock || hasStock(v)),
            )
            .map((v) => v.talle!)
            .filter((talle, index, self) => self.indexOf(talle) === index),
    );

    for (const talle of sizes) {
        const variant = groupedProduct.variants.find(
            (v) =>
                v.color?.toLowerCase() === colorLower &&
                v.talle === talle &&
                (!requireStock || hasStock(v)),
        );
        if (variant) return variant;
    }

    if (!requireStock) {
        return groupedProduct.variants.find((v) => v.color?.toLowerCase() === colorLower);
    }
    return undefined;
}

function getInitialVariantFromProduct(
    groupedProduct: GroupedProduct | null,
    searchParams: URLSearchParams | null,
): { variant: ProductVariant | null; color: string | null; size: string | null } {
    if (!groupedProduct || groupedProduct.variants.length === 0) {
        return { variant: null, color: null, size: null };
    }

    const urlColor = searchParams?.get('color') ?? null;
    const urlTalle = searchParams?.get('talle') ?? null;
    const allColors = getProductColors(groupedProduct);

    if (urlColor) {
        const matchingColor = allColors.find(
            (c) => c.toLowerCase() === urlColor.toLowerCase(),
        );
        if (matchingColor) {
            const variant = findBestSelectableVariantForColor(
                groupedProduct,
                matchingColor,
                urlTalle,
                true,
            );
            if (variant) {
                return {
                    variant,
                    color: matchingColor,
                    size: variant.talle || null,
                };
            }
        }
    }

    if (!productHasColors(groupedProduct)) {
        const tallePick = findDefaultForTalleOnlyProduct(groupedProduct, urlTalle);
        if (tallePick) return tallePick;
    }

    const defaultPick = findDefaultSelectableVariant(groupedProduct, urlTalle);
    if (defaultPick) {
        return {
            variant: defaultPick.variant,
            color: defaultPick.color,
            size: defaultPick.variant.talle || null,
        };
    }

    const selectableColors = groupedProduct.availableColors ?? allColors;
    const fallbackColor = selectableColors[0] ?? groupedProduct.variants[0]?.color;
    if (fallbackColor) {
        const variant = findBestVariantForColor(groupedProduct, fallbackColor, urlTalle, false);
        if (variant) {
            return {
                variant,
                color: fallbackColor,
                size: variant.talle || null,
            };
        }
    }

    const talleOnlyFallback = findDefaultForTalleOnlyProduct(groupedProduct, urlTalle);
    if (talleOnlyFallback) return talleOnlyFallback;

    const firstWithStock = groupedProduct.variants.find((v) => hasStock(v));
    const firstVariant = firstWithStock ?? groupedProduct.variants[0];
    return {
        variant: firstVariant,
        color: firstVariant.color || null,
        size: firstVariant.talle || null,
    };
}

export function useProductVariants(groupedProduct: GroupedProduct | null) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initial = getInitialVariantFromProduct(groupedProduct, searchParams);
    const [selectedColor, setSelectedColor] = useState<string | null>(initial.color);
    const [selectedSize, setSelectedSize] = useState<string | null>(initial.size);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initial.variant);

    const updateURL = useCallback(
        (color: string | null, talle: string | null) => {
            const newUrl = buildProductUrl(color, talle, window.location.pathname);
            router.replace(newUrl, { scroll: false });
        },
        [router],
    );

    useEffect(() => {
        if (!groupedProduct || groupedProduct.variants.length === 0) {
            setSelectedVariant(null);
            setSelectedColor(null);
            setSelectedSize(null);
            return;
        }

        const next = getInitialVariantFromProduct(groupedProduct, searchParams);
        setSelectedVariant(next.variant);
        setSelectedColor(next.color);
        setSelectedSize(next.size);

        if (!urlMatchesSelection(searchParams, next.color, next.size)) {
            updateURL(next.color, next.size);
        }
    }, [groupedProduct, searchParams, updateURL]);

    const getAvailableSizesForColor = (color: string): string[] => {
        if (!groupedProduct || !color) return [];

        const sizes = groupedProduct.variants
            .filter(
                (v) =>
                    v.color?.toLowerCase() === color.toLowerCase() &&
                    !!v.talle,
            )
            .map((v) => v.talle!)
            .filter((talle, index, self) => self.indexOf(talle) === index);

        if (groupedProduct.availableSizes && groupedProduct.availableSizes.length > 0) {
            return filterTallesForWebSelector(
                sizes.filter((t) => groupedProduct.availableSizes!.includes(t)),
            );
        }

        return filterTallesForWebSelector(sizes);
    };

    const hasColors = groupedProduct ? productHasColors(groupedProduct) : false;

    const availableSizes = useMemo(() => {
        if (!groupedProduct) return [];
        if (selectedColor) return getAvailableSizesForColor(selectedColor);
        if (!hasColors) return sortSizes(getAllTalles(groupedProduct));
        return [];
    }, [groupedProduct, selectedColor, hasColors]);

    const orderedAvailableSizes = availableSizes;

    const colorSelectability = useMemo((): Record<string, ColorSelectability> => {
        if (!groupedProduct?.availableColors?.length) return {};

        const map: Record<string, ColorSelectability> = {};
        for (const color of groupedProduct.availableColors) {
            const reason = getColorUnselectableReason(groupedProduct, color);
            map[color] = {
                selectable: reason === null,
                reason: reason ?? undefined,
            };
        }
        return map;
    }, [groupedProduct]);

    const handleColorSelect = (color: string) => {
        if (!groupedProduct) return;

        const variantWithStock = findBestSelectableVariantForColor(
            groupedProduct,
            color,
            selectedSize,
            true,
        );
        const variantWithColor =
            variantWithStock ??
            findBestSelectableVariantForColor(groupedProduct, color, selectedSize, false);

        if (!variantWithColor) return;

        setSelectedColor(color);
        setSelectedVariant(variantWithColor);
        setSelectedSize(variantWithColor.talle || null);
        updateURL(color, variantWithColor.talle || null);
    };

    const handleSizeSelect = (size: string) => {
        if (!groupedProduct) return;

        const variant = findBestVariantForTalle(
            groupedProduct,
            size,
            selectedColor,
            false,
        );

        if (variant) {
            setSelectedSize(size);
            setSelectedVariant(variant);
            updateURL(selectedColor, size);
        }
    };

    return {
        selectedColor,
        selectedSize,
        selectedVariant,
        orderedAvailableSizes,
        hasColors,
        colorSelectability,
        handleColorSelect,
        handleSizeSelect,
    };
}
