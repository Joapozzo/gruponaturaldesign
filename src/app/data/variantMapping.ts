/**
 * Mapeo manual de variantes a colores y talles
 *
 * Estructura:
 * - Clave: SKU base (ej: 'L-OF-BU-RCON')
 * - Valor: Array de variantes con color, talle y número
 *
 * INSTRUCCIONES:
 * 1. Identifica el SKU base de tu producto
 * 2. Agrega un array con todas las variantes
 * 3. Cada variante tiene: variantNumber, color, talle
 */

export interface VariantInfo {
    variantNumber: number;
    color: string;
    talle: string;
    colorHex?: string; // Opcional: código hexadecimal para mostrar círculo de color
}

export interface ProductVariantMapping {
    [skuBase: string]: VariantInfo[];
}

// Colores comunes para usar
export const COLORS = {
    NEGRO: { name: 'Negro', hex: '#000000' },
    BLANCO: { name: 'Blanco', hex: '#FFFFFF' },
    AZUL_MARINO: { name: 'Azul Marino', hex: '#001f3f' },
    AZUL: { name: 'Azul', hex: '#0074D9' },
    GRIS: { name: 'Gris', hex: '#AAAAAA' },
    ROJO: { name: 'Rojo', hex: '#FF4136' },
    VERDE: { name: 'Verde', hex: '#2ECC40' },
    AMARILLO: { name: 'Amarillo', hex: '#FFDC00' },
    NARANJA: { name: 'Naranja', hex: '#FF851B' },
    ROSA: { name: 'Rosa', hex: '#F012BE' },
    VIOLETA: { name: 'Violeta', hex: '#B10DC9' },
    BEIGE: { name: 'Beige', hex: '#F5F5DC' },
    MARRON: { name: 'Marrón', hex: '#8B4513' },
};

// Talles comunes
export const SIZES = {
    // Talles estándar
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: 'XXL',
    XXXL: 'XXXL',

    // Talles numéricos
    T38: '38',
    T40: '40',
    T42: '42',
    T44: '44',
    T46: '46',
    T48: '48',
    T50: '50',
    T52: '52',

    // Talles especiales
    UNICO: 'Único',
};

/**
 * Mapeo de variantes por SKU base
 *
 * TODO: Completar con tus productos reales
 */
export const VARIANT_MAPPING: ProductVariantMapping = {
    // Ejemplo 1: Remera básica con múltiples talles y colores
    'L-OF-REM-GEN': [
        { variantNumber: 19, color: COLORS.NEGRO.name, talle: SIZES.S, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 20, color: COLORS.NEGRO.name, talle: SIZES.M, colorHex: COLORS.NEGRO.hex },
    ],

    // Ejemplo 2: Buzo con variantes
    'L-OF-BU-RCON': [
        // Negro
        { variantNumber: 1, color: COLORS.NEGRO.name, talle: SIZES.XS, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 2, color: COLORS.NEGRO.name, talle: SIZES.S, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 3, color: COLORS.NEGRO.name, talle: SIZES.M, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 4, color: COLORS.NEGRO.name, talle: SIZES.L, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 5, color: COLORS.NEGRO.name, talle: SIZES.XL, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 6, color: COLORS.NEGRO.name, talle: SIZES.XXL, colorHex: COLORS.NEGRO.hex },

        // Azul Marino
        { variantNumber: 7, color: COLORS.AZUL_MARINO.name, talle: SIZES.XS, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 8, color: COLORS.AZUL_MARINO.name, talle: SIZES.S, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 9, color: COLORS.AZUL_MARINO.name, talle: SIZES.M, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 10, color: COLORS.AZUL_MARINO.name, talle: SIZES.L, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 11, color: COLORS.AZUL_MARINO.name, talle: SIZES.XL, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 12, color: COLORS.AZUL_MARINO.name, talle: SIZES.XXL, colorHex: COLORS.AZUL_MARINO.hex },

        // Gris
        { variantNumber: 13, color: COLORS.GRIS.name, talle: SIZES.XS, colorHex: COLORS.GRIS.hex },
        { variantNumber: 14, color: COLORS.GRIS.name, talle: SIZES.S, colorHex: COLORS.GRIS.hex },
        { variantNumber: 15, color: COLORS.GRIS.name, talle: SIZES.M, colorHex: COLORS.GRIS.hex },
        { variantNumber: 16, color: COLORS.GRIS.name, talle: SIZES.L, colorHex: COLORS.GRIS.hex },
        { variantNumber: 17, color: COLORS.GRIS.name, talle: SIZES.XL, colorHex: COLORS.GRIS.hex },
        { variantNumber: 18, color: COLORS.GRIS.name, talle: SIZES.XXL, colorHex: COLORS.GRIS.hex },

        // Rojo
        { variantNumber: 19, color: COLORS.ROJO.name, talle: SIZES.XS, colorHex: COLORS.ROJO.hex },
        { variantNumber: 20, color: COLORS.ROJO.name, talle: SIZES.S, colorHex: COLORS.ROJO.hex },
        { variantNumber: 21, color: COLORS.ROJO.name, talle: SIZES.M, colorHex: COLORS.ROJO.hex },
        { variantNumber: 22, color: COLORS.ROJO.name, talle: SIZES.L, colorHex: COLORS.ROJO.hex },
        { variantNumber: 23, color: COLORS.ROJO.name, talle: SIZES.XL, colorHex: COLORS.ROJO.hex },
        { variantNumber: 24, color: COLORS.ROJO.name, talle: SIZES.XXL, colorHex: COLORS.ROJO.hex },
    ],

    // Ejemplo 3: Tejido Cardigan
    'L-OF-TEJ-CAR-CHA': [
        // Puedes completar según tus necesidades
        { variantNumber: 1, color: COLORS.BEIGE.name, talle: SIZES.S, colorHex: COLORS.BEIGE.hex },
        { variantNumber: 2, color: COLORS.BEIGE.name, talle: SIZES.M, colorHex: COLORS.BEIGE.hex },
        { variantNumber: 3, color: COLORS.BEIGE.name, talle: SIZES.L, colorHex: COLORS.BEIGE.hex },
        { variantNumber: 4, color: COLORS.NEGRO.name, talle: SIZES.S, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 5, color: COLORS.NEGRO.name, talle: SIZES.M, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 6, color: COLORS.NEGRO.name, talle: SIZES.L, colorHex: COLORS.NEGRO.hex },
        // ... continúa hasta 18
    ],

    // Ejemplo 4: Pantalón Cozy
    'L-OF-PAN-CCOZY': [
        { variantNumber: 2, color: COLORS.NEGRO.name, talle: SIZES.T38, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 3, color: COLORS.NEGRO.name, talle: SIZES.T40, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 4, color: COLORS.NEGRO.name, talle: SIZES.T42, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 5, color: COLORS.NEGRO.name, talle: SIZES.T44, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 6, color: COLORS.AZUL_MARINO.name, talle: SIZES.T38, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 7, color: COLORS.AZUL_MARINO.name, talle: SIZES.T40, colorHex: COLORS.AZUL_MARINO.hex },
        // ... continúa
    ],

    // Ejemplo 5: Campera
    'L-OF-CA-BMBES': [
        { variantNumber: 8, color: COLORS.NEGRO.name, talle: SIZES.M, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 9, color: COLORS.NEGRO.name, talle: SIZES.L, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 10, color: COLORS.NEGRO.name, talle: SIZES.XL, colorHex: COLORS.NEGRO.hex },
        { variantNumber: 11, color: COLORS.AZUL_MARINO.name, talle: SIZES.M, colorHex: COLORS.AZUL_MARINO.hex },
        { variantNumber: 12, color: COLORS.AZUL_MARINO.name, talle: SIZES.L, colorHex: COLORS.AZUL_MARINO.hex },
        // ... continúa
    ],

    // TODO: Agregar más productos aquí
    // Copia el patrón de arriba y completa con tus SKUs
};

/**
 * Helper para obtener info de variante por SKU base y número
 * Si no existe mapping manual, genera uno automático
 */
export function getVariantInfo(skuBase: string, variantNumber: number): VariantInfo | null {
    const productVariants = VARIANT_MAPPING[skuBase];

    // Si existe mapping manual, usarlo
    if (productVariants) {
        return productVariants.find(v => v.variantNumber === variantNumber) || null;
    }

    // Si no existe mapping, generar automáticamente
    // Asignar colores y talles de forma cíclica
    const autoColors = [
        { name: 'Negro', hex: '#000000' },
        { name: 'Azul Marino', hex: '#001f3f' },
        { name: 'Gris', hex: '#AAAAAA' },
        { name: 'Blanco', hex: '#FFFFFF' },
    ];

    const autoSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // Calcular color y talle basado en el número de variante
    const colorIndex = Math.floor((variantNumber - 1) / autoSizes.length) % autoColors.length;
    const sizeIndex = (variantNumber - 1) % autoSizes.length;

    const selectedColor = autoColors[colorIndex];
    const selectedSize = autoSizes[sizeIndex];

    return {
        variantNumber,
        color: selectedColor.name,
        talle: selectedSize,
        colorHex: selectedColor.hex,
    };
}

/**
 * Helper para obtener colores únicos de un producto
 */
export function getAvailableColors(skuBase: string): string[] {
    const productVariants = VARIANT_MAPPING[skuBase];
    if (!productVariants) return [];

    const colors = new Set(productVariants.map(v => v.color));
    return Array.from(colors);
}

/**
 * Helper para obtener talles de un color específico
 */
export function getAvailableSizes(skuBase: string, color: string): string[] {
    const productVariants = VARIANT_MAPPING[skuBase];
    if (!productVariants) return [];

    return productVariants
        .filter(v => v.color === color)
        .map(v => v.talle);
}

/**
 * Helper para encontrar variante por color y talle
 */
export function findVariantByColorAndSize(
    skuBase: string,
    color: string,
    talle: string
): VariantInfo | null {
    const productVariants = VARIANT_MAPPING[skuBase];
    if (!productVariants) return null;

    return productVariants.find(v => v.color === color && v.talle === talle) || null;
}
