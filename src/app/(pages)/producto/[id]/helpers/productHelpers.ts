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

/**
 * Formatea el precio para mostrar
 */
export function formatPrice(precio: number | null | undefined): string {
    if (!precio || precio === 0) return 'Consultar';
    return `$${precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
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
    'gris': ['gris', 'gris-melange'],
    'gris melange': ['gris', 'gris-melange'],
    'gris-melange': ['gris', 'gris-melange'],
    'azul': ['azul'], // TODOS los azules están con "azul" en el nombre
    'azul marino': ['azul'], // Buscar solo "azul"
    'azul-marino': ['azul'], // Buscar solo "azul"
    'celeste': ['celeste'], // CELESTE tiene su propia carpeta/archivos
    'cemento': ['cemento'], // CEMENTO tiene su propia carpeta/archivos
    'gristopo': ['gristopo'], // "gristopo" (todo junto, sin guión)
    'gris topo': ['gristopo'], // También aceptar "gris topo" y buscar "gristopo"
    'gris-topo': ['gristopo'], // También aceptar "gris-topo" y buscar "gristopo"
    'lavado oscuro': ['oscuro'], // "lavado oscuro" busca "oscuro"
    'lavado-oscuro': ['oscuro'], // "lavado-oscuro" busca "oscuro"
    'lavado claro': ['claro'], // "lavado claro" busca "claro"
    'lavado-claro': ['claro'], // "lavado-claro" busca "claro"
    'lavado medio': ['medio'], // "lavado medio" busca "medio"
    'lavado-medio': ['medio'], // "lavado-medio" busca "medio"
    'blanco': ['blanco'],
    'negro': ['negro'],
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
 * Retorna solo las rutas posibles (el componente filtrará las que no existen)
 * Formato esperado: {productSlug}/{productSlug}-{color}-{numero}.jpg
 * Busca hasta 10 imágenes, pero el componente solo mostrará las que existen
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
        // Buscar hasta 10 imágenes por color (el componente filtrará las que no existen)
        for (let i = 1; i <= 10; i++) {
            const imagePath = `${basePath}/${productSlug}/${productSlug}-${primaryColor}-${i}.jpg`;
            images.push(imagePath);
        }
    } else {
        // Si no hay color, buscar imágenes genéricas (sin color en el nombre)
        for (let i = 1; i <= 10; i++) {
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
        // Para cada color disponible, buscar todas sus imágenes
        for (const color of availableColors) {
            const colorVariants = normalizeColorForFile(color);
            if (colorVariants.length > 0) {
                const primaryColor = colorVariants[0];
                // Buscar hasta 10 imágenes por color
                for (let i = 1; i <= 10; i++) {
                    const imagePath = `${basePath}/${productSlug}/${productSlug}-${primaryColor}-${i}.jpg`;
                    images.push(imagePath);
                }
            }
        }
    } else {
        // Si no hay colores, buscar imágenes genéricas
        for (let i = 1; i <= 10; i++) {
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
 * Si hay color, busca imágenes específicas de ese color
 * Si no hay color pero hay availableColors, muestra todas las imágenes de todos los colores
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
    
    // Si hay productName y color, buscar imágenes específicas de ese color
    if (productName && color) {
        const colorImages = getProductImagesByColor(productName, color);
        if (colorImages.length > 0) {
            return colorImages.slice(0, maxImages);
        }
    }
    
    // Si hay productName y availableColors pero no color seleccionado, mostrar todas las imágenes
    if (productName && availableColors && availableColors.length > 0 && !color) {
        const allImages = getAllProductImagesByColors(productName, availableColors);
        if (allImages.length > 0) {
            return allImages.slice(0, maxImages * 2); // Mostrar más imágenes si hay múltiples colores
        }
    }
    
    // Fallback: usar las imágenes del producto si existen
    const productImages = imagenes && imagenes.length > 0
        ? imagenes.filter(img => img && img.trim() !== '')
        : imagen && imagen.trim() !== ''
            ? [imagen]
            : [];

    return productImages.length > 0 
        ? productImages.slice(0, maxImages) 
        : [PLACEHOLDER_IMAGE];
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

