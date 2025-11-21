/**
 * Funciones helper para la página de producto
 */

/**
 * Convierte un nombre a slug URL-friendly
 */
export function nombreToSlug(nombre: string): string {
    return nombre
        .toLowerCase()
        .trim()
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
 * Obtiene las imágenes del producto
 */
export function getProductImages(
    imagenes: string[] | undefined,
    imagen: string | null | undefined,
    maxImages: number = 5
): string[] {
    const PLACEHOLDER_IMAGE = '/imgs/producto-placeholder.jpg';
    
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
 * Obtiene el nombre del producto para mostrar
 */
export function getProductDisplayName(
    skuBase: string | undefined,
    nombre: string | null | undefined
): string {
    return skuBase || nombre || 'Sin nombre';
}

