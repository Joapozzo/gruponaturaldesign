/**
 * Mapeo de productos a sus imágenes de indicaciones de bordados correspondientes
 *
 * Este archivo mapea los productos con sus respectivas imágenes de indicaciones de bordados
 * ubicadas en /public/imgs/bordados/
 *
 * Archivos disponibles:
 * - superiores.jpg (para remeras, camisas, chombas, buzos, cardigans, etc.)
 * - pantalon-cargo.jpg
 * - pantalon-chino.jpg
 * - pantalon-jean.jpg
 * - 20.jpg (genérico)
 */

export interface BordadoMapping {
    // Palabras clave para identificar el producto
    keywords: string[];
    // Ruta de la imagen de indicaciones de bordados
    imageUrl: string;
    // Tipo de prenda (opcional, para mayor precisión)
    productTypes?: string[];
}

/**
 * Mapeo de productos a imágenes de indicaciones de bordados
 * Ordenado de más específico a más genérico
 */
export const BORDADOS_MAPPINGS: BordadoMapping[] = [
    // PANTALONES - CARGO
    {
        keywords: ['pantalon', 'cargo'],
        imageUrl: '/imgs/bordados/pantalon-cargo.jpg',
        productTypes: ['pantalon', 'cargo']
    },
    {
        keywords: ['cargo'],
        imageUrl: '/imgs/bordados/pantalon-cargo.jpg',
        productTypes: ['pantalon']
    },

    // PANTALONES - CHINO
    {
        keywords: ['pantalon', 'chino'],
        imageUrl: '/imgs/bordados/pantalon-chino.jpg',
        productTypes: ['pantalon']
    },
    {
        keywords: ['chino'],
        imageUrl: '/imgs/bordados/pantalon-chino.jpg',
        productTypes: ['pantalon']
    },

    // PANTALONES - JEAN
    {
        keywords: ['jean'],
        imageUrl: '/imgs/bordados/pantalon-jean.jpg',
        productTypes: ['pantalon', 'jean']
    },

    // PANTALONES - GENÉRICO
    {
        keywords: ['pantalon'],
        imageUrl: '/imgs/bordados/pantalon-chino.jpg', // Usar chino como default
        productTypes: ['pantalon']
    },

    // SUPERIORES (REMERAS, CAMISAS, CHOMBAS, BUZOS, CARDIGANS, etc.)
    {
        keywords: ['remera'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['remera']
    },
    {
        keywords: ['camisa'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['camisa']
    },
    {
        keywords: ['chomba'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['chomba']
    },
    {
        keywords: ['buzo'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['buzo']
    },
    {
        keywords: ['cardigan'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['cardigan']
    },
    {
        keywords: ['sweater'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['sweater']
    },
    {
        keywords: ['campera'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['campera', 'rompevientos']
    },
    {
        keywords: ['rompevientos'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['rompevientos']
    },
    {
        keywords: ['anorak'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['anorak']
    },
    {
        keywords: ['casaca'],
        imageUrl: '/imgs/bordados/superiores.jpg',
        productTypes: ['casaca']
    },
];

/**
 * Obtiene la imagen de indicaciones de bordados más apropiada para un producto
 *
 * @param productName - Nombre del producto (ej: "REMERA GENTLE DAMA")
 * @param productType - Tipo de prenda (subrubro) (ej: "remera")
 * @param description - Descripción completa del producto (opcional)
 * @returns URL de la imagen de bordados o null si no se encuentra
 */
export function getBordadosImage(
    productName: string,
    productType?: string,
    description?: string
): string | null {
    // Normalizar textos a minúsculas para búsqueda
    const nameNormalized = productName.toLowerCase().trim();
    const typeNormalized = productType?.toLowerCase().trim();
    const descNormalized = description?.toLowerCase().trim();

    // Concatenar todos los textos para búsqueda
    const searchText = `${nameNormalized} ${typeNormalized || ''} ${descNormalized || ''}`;

    // Buscar coincidencia más específica primero
    for (const mapping of BORDADOS_MAPPINGS) {
        // Verificar que todas las keywords coincidan
        const allKeywordsMatch = mapping.keywords.every(keyword =>
            searchText.includes(keyword.toLowerCase())
        );

        if (!allKeywordsMatch) {
            continue;
        }

        // Si el mapeo tiene tipos de producto especificados, verificar que coincida
        if (mapping.productTypes && typeNormalized) {
            const typeMatches = mapping.productTypes.some(pt =>
                typeNormalized.includes(pt.toLowerCase())
            );
            if (!typeMatches) {
                continue;
            }
        }

        // Si llegamos aquí, tenemos una coincidencia válida
        return mapping.imageUrl;
    }

    // Si no se encuentra ninguna coincidencia, retornar imagen genérica de superiores
    return '/imgs/bordados/superiores.jpg';
}

/**
 * Obtiene la URL de la imagen de bordados para un producto completo
 * Esta función es un helper que extrae la información necesaria del objeto producto
 *
 * @param product - Objeto ProductWithImage
 * @returns URL de la imagen de bordados
 */
export function getProductBordadosImage(product: {
    NOMBRE?: string;
    Descripcion?: string | null;
    Subrubro?: string | null;
    DescripcionCorta?: string | null;
}): string {
    const productName = product.NOMBRE || product.Descripcion || '';
    const productType = product.Subrubro || '';
    const description = product.DescripcionCorta || product.Descripcion || '';

    return getBordadosImage(productName, productType, description) || '/imgs/bordados/superiores.jpg';
}
