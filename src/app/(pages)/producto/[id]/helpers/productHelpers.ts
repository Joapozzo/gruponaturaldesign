/**
 * Funciones helper para la página de producto
 */

/**
 * Simplifica el nombre del producto para generar el slug de las imágenes
 * Remueve frases descriptivas comunes que no están en los nombres de carpetas
 * Ejemplo: "REMERA GENTLE ESCOTE EN V DAMA" → "REMERA GENTLE DAMA"
 */
function simplifyProductNameForImages(nombre: string): string {
    let simplified = nombre;
    
    // Frases descriptivas comunes que se deben remover para las carpetas de imágenes
    const phrasesToRemove = [
        'ESCOTE EN V',
        'ESCOTE EN U',
        'MANGA CORTA',
        'MANGA LARGA',
        'CORTE',
        'ENTALLADO',
        'CLASICO',
        'SPORT',
        'BASIC',
        'PARA',
        'CON',
        'DE',
        'LA',
        'EL',
    ];
    
    // Remover frases descriptivas
    phrasesToRemove.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        simplified = simplified.replace(regex, '');
    });
    
    // Limpiar espacios múltiples
    simplified = simplified.replace(/\s+/g, ' ').trim();
    
    return simplified;
}

/**
 * Convierte un nombre a slug URL-friendly
 * Simplifica nombres largos removiendo frases descriptivas para coincidir con carpetas de imágenes
 */
export function nombreToSlug(nombre: string): string {
    // Primero simplificar el nombre para que coincida con las carpetas de imágenes
    const simplified = simplifyProductNameForImages(nombre);
    
    return simplified
        .toLowerCase()
        .trim()
        .replace(/\brager\b/g, 'ranger')  // Normalizar "rager" a "ranger" para las carpetas de imágenes
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Crea un ID único desde un código de producto
 */
export function createProductId(codigo: string): number {
    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
        const char = codigo.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

import { IVA_RATE } from '@/app/utils/constants';

/**
 * Formatea el precio para mostrar
 */
export function formatPrice(precio: number | null | undefined): string {
    if (!precio || precio === 0) return 'Consultar';
    return `$${precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
}

/**
 * Calcula el precio sin IVA
 * @param precioConIva Precio con IVA incluido
 * @returns Precio sin IVA
 */
export function calculatePriceWithoutIVA(precioConIva: number | null | undefined): number {
    if (!precioConIva || precioConIva === 0) return 0;
    return precioConIva / (1 + IVA_RATE);
}

/**
 * Formatea el precio sin IVA para mostrar (texto pequeño)
 */
export function formatPriceWithoutIVA(precioConIva: number | null | undefined): string {
    if (!precioConIva || precioConIva === 0) return '';
    const precioSinIva = calculatePriceWithoutIVA(precioConIva);
    return `$${precioSinIva.toLocaleString('es-AR', { minimumFractionDigits: 2 })} sin impuestos nacionales`;
}

/**
 * Mapeo de colores para buscar en nombres de archivos
 * Según las reglas:
 * - gris = gris melange (buscar "gris" o "gris-melange")
 * - azul = todos los azules (buscar "azul", "azul-marino", "celeste", etc.)
 * - gristopo = gristopo (específico)
 * - blanco
 * - negro
 */
const COLOR_MAPPING: { [key: string]: string[] } = {
    // IMPORTANTE: Según la estructura real de archivos del CSV:
    // buzo-standard-unisex-azulmarino-1.jpg (para Azul Marino)
    // buzo-standard-unisex-grismelange-1.jpg (para Gris Melange) - SIN GUION entre gris y melange
    // buzo-standard-unisex-gristopo-1.jpg (para Gris Topo)
    // buzo-standard-unisex-negro-1.jpg (para Negro)
    'azul marino': ['azulmarino', 'marino'],
    'azul-marino': ['azulmarino', 'marino'],
    'azul mar': ['azulmarino', 'marino'],
    'gris melange': ['grismelange', 'melange'], // Buscar tanto "grismelange" como "melange"
    'gris-melange': ['grismelange', 'melange'],
    'gris mel': ['grismelange', 'melange'],
    'gris-mel': ['grismelange', 'melange'],
    'gris mel cl': ['grismelange', 'melange'],
    'gris topo': ['gristopo'],
    'gris-topo': ['gristopo'],
    'gristopo': ['gristopo'],
    'gris t': ['gristopo'],
    'topo': ['gristopo'], // Mapear "topo" a "gristopo"
    'negro': ['negro'],
    'neg': ['negro'],
    'blanco': ['blanco'],
    'celeste': ['celeste', 'azul'],
    'azul': ['azul'],
    'lavado oscuro': ['oscuro'],
    'lavado-oscuro': ['oscuro'],
    'lavado claro': ['claro'],
    'lavado-claro': ['claro'],
    'lavado medio': ['medio'],
    'lavado-medio': ['medio'],
    'arena': ['arena'],
    'cemento': ['cemento'],
    'tostado': ['tostado'],
    'gris': ['gris'], // Para camisas drill que solo dicen "Gris"
};

/**
 * Normaliza el nombre del color para buscar en archivos
 * Si el color no está en el mapeo, lo convierte a slug directamente
 */
function normalizeColorForFile(color: string | null | undefined): string[] {
    if (!color) return [];
    const colorLower = color.toLowerCase().trim();
    // Si está en el mapeo, usar esos valores
    if (COLOR_MAPPING[colorLower]) {
        return COLOR_MAPPING[colorLower];
    }
    // Si no está, convertir a slug y buscar ese color directamente
    const colorSlug = colorLower.replace(/\s+/g, '-');
    return [colorSlug];
}

/**
 * Construye las rutas de imagen basadas en el nombre del producto y el color
 * Retorna solo las rutas posibles (el componente verificará cuáles existen)
 * Formato esperado: {productSlug}/{productSlug}-{color}-{numero}.jpg
 * IMPORTANTE: Genera hasta 20 imágenes (el componente verificará cuáles existen realmente)
 */
export function getProductImagesByColor(
    productName: string,
    color: string | null | undefined,
    basePath: string = '/imgs/products'
): string[] {
    const productSlug = nombreToSlug(productName);
    const colorVariants = normalizeColorForFile(color);
    
    const images: string[] = [];
    
    // Si hay color, buscar imágenes con ese color
    if (colorVariants.length > 0) {
        // Priorizar la primera variante de color (la más específica)
        const primaryColor = colorVariants[0];
        
        // Buscar imágenes con el patrón: {productSlug}-{color}-{numero}.jpg
        // Generar hasta 20 imágenes (el componente verificará cuáles existen)
        for (let i = 1; i <= 20; i++) {
            const imagePath = `${basePath}/${productSlug}/${productSlug}-${primaryColor}-${i}.jpg`;
            images.push(imagePath);
        }
    } else {
        // Si no hay color, buscar imágenes genéricas (sin color en el nombre)
        for (let i = 1; i <= 20; i++) {
            const imagePath = `${basePath}/${productSlug}/${productSlug}-${i}.jpg`;
            images.push(imagePath);
        }
    }
    
    return images;
}

/**
 * Obtiene la primera imagen disponible de cualquier color para mostrar en el catálogo
 * Prioriza: negro, azul, celeste, gris, blanco, gristopo
 */
export function getFirstProductImage(
    productName: string,
    basePath: string = '/imgs/products'
): string {
    const productSlug = nombreToSlug(productName);
    
    // Colores comunes para buscar (en orden de prioridad)
    const commonColors = ['negro', 'azul', 'celeste', 'gris', 'blanco', 'gristopo'];
    
    // Buscar la primera imagen disponible de cualquier color
    for (const color of commonColors) {
        const imagePath = `${basePath}/${productSlug}/${productSlug}-${color}-1.jpg`;
        return imagePath;
    }
    
    // Si no encuentra, intentar sin color
    return `${basePath}/${productSlug}/${productSlug}-1.jpg`;
}

/**
 * Obtiene todas las imágenes de todos los colores disponibles para un producto
 */
export function getAllProductImagesByColors(
    productName: string,
    availableColors: string[] | undefined,
    basePath: string = '/imgs/products'
): string[] {
    const productSlug = nombreToSlug(productName);
    const images: string[] = [];
    
    if (availableColors && availableColors.length > 0) {
        // Para cada color disponible, buscar sus imágenes
        for (const color of availableColors) {
            const colorVariants = normalizeColorForFile(color);
            if (colorVariants.length > 0) {
                const primaryColor = colorVariants[0];
                // Generar hasta 20 imágenes por color (el componente verificará cuáles existen)
                for (let i = 1; i <= 20; i++) {
                    const imagePath = `${basePath}/${productSlug}/${productSlug}-${primaryColor}-${i}.jpg`;
                    images.push(imagePath);
                }
            }
        }
    } else {
        // Si no hay colores, buscar imágenes genéricas
        for (let i = 1; i <= 20; i++) {
            const imagePath = `${basePath}/${productSlug}/${productSlug}-${i}.jpg`;
            images.push(imagePath);
        }
    }
    
    return images;
}

/**
 * Verifica si un producto tiene al menos una imagen disponible
 * Retorna true si hay colores disponibles (asumimos que si hay colores, hay imágenes)
 * El componente se encargará de filtrar las imágenes que no existen (404)
 */
export function hasProductImages(
    productName: string,
    availableColors: string[] | undefined,
    basePath: string = '/imgs/products'
): boolean {
    if (!productName) return false;
    
    // Si hay colores disponibles, asumimos que hay imágenes
    // El componente filtrará las que no existen
    if (availableColors && availableColors.length > 0) {
        return true;
    }
    
    // Si no hay colores, también retornamos true
    // El componente verificará si existe imagen genérica
    return true;
}

/**
 * Obtiene las imágenes del producto
 * IMPORTANTE: SOLO usa las imágenes que vienen del CSV, NO genera imágenes dinámicamente
 * Si hay color, filtra las imágenes del CSV que correspondan a ese color
 */
export function getProductImages(
    imagenes: string[] | undefined,
    imagen: string | null | undefined,
    maxImages: number = 5,
    productName?: string,
    color?: string | null,
    availableColors?: string[]
): string[] {
    const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.png';
    
    // PRIMERO: Usar SOLO las imágenes que vienen del CSV
    const productImages = imagenes && imagenes.length > 0
        ? imagenes.filter(img => img && img.trim() !== '')
        : imagen && imagen.trim() !== ''
            ? [imagen]
            : [];
    
    // Si no hay imágenes del CSV, retornar placeholder
    if (productImages.length === 0) {
        return [PLACEHOLDER_IMAGE];
    }
    
    // Si hay color seleccionado, filtrar las imágenes del CSV que correspondan a ese color
    if (color) {
        const colorVariants = normalizeColorForFile(color);
        if (colorVariants.length > 0) {
            // Buscar TODAS las variantes del color (ej: "grismelange" y "melange" para "gris melange")
            const filteredImages = productImages.filter(img => {
                if (!img) return false;
                const imgLower = img.toLowerCase();
                
                // Buscar cada variante del color en la ruta de la imagen
                for (const colorVariant of colorVariants) {
                    // Buscar el color en la ruta de la imagen de múltiples formas:
                    // - "/imgs/products/buzo-standard-unisex/buzo-standard-unisex-grismelange-1.jpg"
                    // - "buzo-standard-unisex-grismelange-1"
                    // Puede estar como: -color- o -color. o -color/ o al final -color
                    if (imgLower.includes(`-${colorVariant}-`) || 
                        imgLower.includes(`-${colorVariant}.`) ||
                        imgLower.includes(`-${colorVariant}/`) ||
                        imgLower.endsWith(`-${colorVariant}`) ||
                        imgLower.endsWith(`-${colorVariant}.jpg`)) {
                        return true;
                    }
                }
                return false;
            });
            
            // Si encontramos imágenes del color, retornarlas (ordenadas por número si es posible)
            if (filteredImages.length > 0) {
                // Ordenar por número de imagen si es posible (para mantener orden 1, 2, 3, 4)
                return filteredImages.sort((a, b) => {
                    const numA = parseInt(a.match(/-(\d+)\./)?.[1] || '0', 10);
                    const numB = parseInt(b.match(/-(\d+)\./)?.[1] || '0', 10);
                    return numA - numB;
                });
            }
        }
    }
    
    // Si no hay color o no se encontraron imágenes del color, retornar todas las imágenes del CSV
    return productImages;
}

/**
 * Crea las especificaciones del producto para el carrito
 */
export function createProductSpecs(
    color: string | null | undefined,
    talle: string | null | undefined,
    codigo: string,
    variantNumber: number
): string {
    const hasColorSize = color && talle;
    return hasColorSize
        ? `Color: ${color} | Talle: ${talle} | Código: ${codigo}`
        : `Variante #${variantNumber} | Código: ${codigo}`;
}

/**
 * Parsea las especificaciones del carrito para extraer color y talle
 */
export function parseProductSpecs(especificaciones?: string): { color?: string; talle?: string; codigo?: string } {
    if (!especificaciones) return {};
    
    const result: { color?: string; talle?: string; codigo?: string } = {};
    
    // Formato: "Color: LAVADO OSCURO | Talle: 50 | Código: L-WW-PAN-JFL8"
    const colorMatch = especificaciones.match(/Color:\s*([^|]+)/i);
    const talleMatch = especificaciones.match(/Talle:\s*([^|]+)/i);
    const codigoMatch = especificaciones.match(/Código:\s*([^|]+)/i);
    
    if (colorMatch) result.color = colorMatch[1].trim();
    if (talleMatch) result.talle = talleMatch[1].trim();
    if (codigoMatch) result.codigo = codigoMatch[1].trim();
    
    return result;
}

/**
 * Obtiene el nombre del producto para mostrar
 */
export function getProductDisplayName(
    skuBase: string | undefined,
    nombre: string | null | undefined
): string {
    return skuBase || nombre || 'Sin nombre';
}

