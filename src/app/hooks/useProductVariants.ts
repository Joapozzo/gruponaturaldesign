import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GroupedProduct, ProductVariant } from '@/app/types/producto';

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

    return groupedProduct.variants.find((v) => v.color?.toLowerCase() === colorLower);
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
    const selectableColors = groupedProduct.availableColors ?? [];

    if (urlColor) {
        const matchingColor = selectableColors.find(
            (c) => c.toLowerCase() === urlColor.toLowerCase(),
        );
        if (matchingColor) {
            const variant = findBestVariantForColor(groupedProduct, matchingColor, urlTalle);
            if (variant) {
                return {
                    variant,
                    color: matchingColor,
                    size: variant.talle || null,
                };
            }
        }
    }

    for (const color of selectableColors) {
        const variant = findBestVariantForColor(groupedProduct, color);
        if (variant && hasStock(variant)) {
            return {
                variant,
                color,
                size: variant.talle || null,
            };
        }
    }

    const fallbackColor = selectableColors[0] ?? groupedProduct.variants[0]?.color;
    if (fallbackColor) {
        const variant = findBestVariantForColor(groupedProduct, fallbackColor, null, false);
        if (variant) {
            return {
                variant,
                color: fallbackColor,
                size: variant.talle || null,
            };
        }
    }

    const firstVariant = groupedProduct.variants[0];
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

        return sizes;
    };

    const availableSizes = selectedColor ? getAvailableSizesForColor(selectedColor) : [];
    const orderedAvailableSizes = sortSizes(availableSizes);

    const handleColorSelect = (color: string) => {
        if (!groupedProduct) return;

        const variantWithStock = findBestVariantForColor(groupedProduct, color);
        const variantWithColor = variantWithStock
            ?? findBestVariantForColor(groupedProduct, color, null, false);

        if (!variantWithColor) return;

        setSelectedColor(color);
        setSelectedVariant(variantWithColor);
        setSelectedSize(variantWithColor.talle || null);
        updateURL(color, variantWithColor.talle || null);
    };

    const handleSizeSelect = (size: string) => {
        if (!selectedColor || !groupedProduct) return;

        const variant = groupedProduct.variants.find(
            (v) =>
                v.color?.toLowerCase() === selectedColor.toLowerCase() &&
                v.talle === size,
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
        handleColorSelect,
        handleSizeSelect,
    };
}
