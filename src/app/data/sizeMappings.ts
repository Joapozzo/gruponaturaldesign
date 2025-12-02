/**
 * Mapeo de productos a sus imágenes de tabla de talles correspondientes
 *
 * Este archivo mapea los productos con sus respectivas imágenes de talles
 * ubicadas en /public/imgs/talles/
 *
 * Archivos disponibles:
 * - buzo-standard-unisex.jpg
 * - camisa-drill-dama.jpg
 * - camisa-drill-hombre.jpg
 * - camisa-executive-dama.jpg
 * - cardigan-charm.jpg
 * - chomba-rivet-unisex.jpg
 * - pantalon-cargo-balance-hombre.jpg
 * - pantalon-cargo-bolt-hombre.jpg
 * - pantalon-cargo-impacted-unisex.jpg
 * - pantalon-chino-confort-fit-dama.jpg
 * - pantalon-jean-flow-dama.jpg
 * - pantalon-jean-flow-hombre.jpg
 * - remera-base-unisex.jpg
 * - remera-gentle-dama.jpg
 * - rompevientos-ranger-unisex.jpg
 * - sweater-essence-hombre.jpg
 * - 4.jpg, 8.jpg, 18.jpg (talles genéricos)
 */

export interface SizeChartMapping {
    // Palabras clave para identificar el producto
    keywords: string[];
    // Ruta de la imagen de talles
    imageUrl: string;
    // Tipo de prenda (opcional, para mayor precisión)
    productTypes?: string[];
    // Género (opcional)
    gender?: 'dama' | 'hombre' | 'unisex';
}

/**
 * Mapeo de productos a imágenes de talles
 * Ordenado de más específico a más genérico
 */
export const SIZE_CHART_MAPPINGS: SizeChartMapping[] = [
    // BUZOS
    {
        keywords: ['buzo', 'standard'],
        imageUrl: '/imgs/talles/buzo-standard-unisex.jpg',
        productTypes: ['buzo'],
        gender: 'unisex'
    },

    // CAMISAS - DRILL
    {
        keywords: ['camisa', 'drill', 'dama'],
        imageUrl: '/imgs/talles/camisa-drill-dama.jpg',
        productTypes: ['camisa'],
        gender: 'dama'
    },
    {
        keywords: ['camisa', 'drill', 'hombre'],
        imageUrl: '/imgs/talles/camisa-drill-hombre.jpg',
        productTypes: ['camisa'],
        gender: 'hombre'
    },

    // CAMISAS - EXECUTIVE
    {
        keywords: ['camisa', 'executive', 'dama'],
        imageUrl: '/imgs/talles/camisa-executive-dama.jpg',
        productTypes: ['camisa'],
        gender: 'dama'
    },

    // CARDIGANS
    {
        keywords: ['cardigan', 'charm'],
        imageUrl: '/imgs/talles/cardigan-charm.jpg',
        productTypes: ['cardigan', 'tejido'],
        gender: 'dama'
    },

    // CHOMBAS
    {
        keywords: ['chomba', 'rivet'],
        imageUrl: '/imgs/talles/chomba-rivet-unisex.jpg',
        productTypes: ['chomba'],
        gender: 'unisex'
    },
    {
        keywords: ['chomba', 'flowing'],
        imageUrl: '/imgs/talles/chomba-rivet-unisex.jpg', // Usar la misma que rivet
        productTypes: ['chomba'],
        gender: 'hombre'
    },

    // PANTALONES - CARGO
    {
        keywords: ['cargo', 'balance', 'hombre'],
        imageUrl: '/imgs/talles/pantalon-cargo-balance-hombre.jpg',
        productTypes: ['pantalon', 'cargo'],
        gender: 'hombre'
    },
    {
        keywords: ['cargo', 'bolt', 'hombre'],
        imageUrl: '/imgs/talles/pantalon-cargo-bolt-hombre.jpg',
        productTypes: ['pantalon', 'cargo'],
        gender: 'hombre'
    },
    {
        keywords: ['cargo', 'impacted', 'unisex'],
        imageUrl: '/imgs/talles/pantalon-cargo-impacted-unisex.jpg',
        productTypes: ['pantalon', 'cargo'],
        gender: 'unisex'
    },

    // PANTALONES - CHINO
    {
        keywords: ['pantalon', 'chino', 'dama'],
        imageUrl: '/imgs/talles/pantalon-chino-confort-fit-dama.jpg',
        productTypes: ['pantalon', 'chino'],
        gender: 'dama'
    },

    // PANTALONES - JEAN
    {
        keywords: ['jean', 'flow', 'dama'],
        imageUrl: '/imgs/talles/pantalon-jean-flow-dama.jpg',
        productTypes: ['pantalon', 'jean'],
        gender: 'dama'
    },
    {
        keywords: ['jean', 'flow', 'hombre'],
        imageUrl: '/imgs/talles/pantalon-jean-flow-hombre.jpg',
        productTypes: ['pantalon', 'jean'],
        gender: 'hombre'
    },

    // REMERAS
    {
        keywords: ['remera', 'base', 'unisex'],
        imageUrl: '/imgs/talles/remera-base-unisex.jpg',
        productTypes: ['remera'],
        gender: 'unisex'
    },
    {
        keywords: ['remera', 'gentle', 'dama'],
        imageUrl: '/imgs/talles/remera-gentle-dama.jpg',
        productTypes: ['remera'],
        gender: 'dama'
    },

    // ROMPEVIENTOS
    {
        keywords: ['rompevientos', 'ranger', 'unisex'],
        imageUrl: '/imgs/talles/rompevientos-ranger-unisex.jpg',
        productTypes: ['rompevientos', 'campera'],
        gender: 'unisex'
    },
    {
        keywords: ['rompevientos', 'rager', 'unisex'], // Variante con typo común
        imageUrl: '/imgs/talles/rompevientos-ranger-unisex.jpg',
        productTypes: ['rompevientos', 'campera'],
        gender: 'unisex'
    },

    // SWEATERS
    {
        keywords: ['sweater', 'essence', 'hombre'],
        imageUrl: '/imgs/talles/sweater-essence-hombre.jpg',
        productTypes: ['sweater'],
        gender: 'hombre'
    },

    // GENÉRICOS POR TIPO DE PRENDA (FALLBACKS)
    {
        keywords: ['camisa', 'dama'],
        imageUrl: '/imgs/talles/camisa-drill-dama.jpg',
        productTypes: ['camisa'],
        gender: 'dama'
    },
    {
        keywords: ['camisa', 'hombre'],
        imageUrl: '/imgs/talles/camisa-drill-hombre.jpg',
        productTypes: ['camisa'],
        gender: 'hombre'
    },
    {
        keywords: ['pantalon', 'dama'],
        imageUrl: '/imgs/talles/pantalon-chino-confort-fit-dama.jpg',
        productTypes: ['pantalon'],
        gender: 'dama'
    },
    {
        keywords: ['pantalon', 'hombre'],
        imageUrl: '/imgs/talles/pantalon-cargo-balance-hombre.jpg',
        productTypes: ['pantalon'],
        gender: 'hombre'
    },
    {
        keywords: ['remera', 'dama'],
        imageUrl: '/imgs/talles/remera-gentle-dama.jpg',
        productTypes: ['remera'],
        gender: 'dama'
    },
    {
        keywords: ['remera', 'unisex'],
        imageUrl: '/imgs/talles/remera-base-unisex.jpg',
        productTypes: ['remera'],
        gender: 'unisex'
    },
    {
        keywords: ['chomba'],
        imageUrl: '/imgs/talles/chomba-rivet-unisex.jpg',
        productTypes: ['chomba']
    },
    {
        keywords: ['buzo'],
        imageUrl: '/imgs/talles/buzo-standard-unisex.jpg',
        productTypes: ['buzo']
    },
    {
        keywords: ['cardigan'],
        imageUrl: '/imgs/talles/cardigan-charm.jpg',
        productTypes: ['cardigan']
    },
];

/**
 * Obtiene la imagen de tabla de talles más apropiada para un producto
 *
 * @param productName - Nombre del producto (ej: "REMERA GENTLE DAMA")
 * @param productType - Tipo de prenda (subrubro) (ej: "remera")
 * @param description - Descripción completa del producto (opcional)
 * @returns URL de la imagen de talles o null si no se encuentra
 */
export function getSizeChartImage(
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

    // Detectar género del producto
    let detectedGender: 'dama' | 'hombre' | 'unisex' | undefined;
    if (searchText.includes('dama') || searchText.includes('mujer')) {
        detectedGender = 'dama';
    } else if (searchText.includes('hombre') || searchText.includes('varon')) {
        detectedGender = 'hombre';
    } else if (searchText.includes('unisex')) {
        detectedGender = 'unisex';
    }

    // Buscar coincidencia más específica primero
    for (const mapping of SIZE_CHART_MAPPINGS) {
        // Verificar que todas las keywords coincidan
        const allKeywordsMatch = mapping.keywords.every(keyword =>
            searchText.includes(keyword.toLowerCase())
        );

        if (!allKeywordsMatch) {
            continue;
        }

        // Si el mapeo tiene género especificado, verificar que coincida
        if (mapping.gender && detectedGender && mapping.gender !== detectedGender) {
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

    // Si no se encuentra ninguna coincidencia, retornar null
    return null;
}

/**
 * Obtiene la URL de la imagen de talles para un producto completo
 * Esta función es un helper que extrae la información necesaria del objeto producto
 *
 * @param product - Objeto ProductWithImage
 * @returns URL de la imagen de talles o null
 */
export function getProductSizeChart(product: {
    NOMBRE?: string;
    Descripcion?: string | null;
    Subrubro?: string | null;
    DescripcionCorta?: string | null;
}): string | null {
    const productName = product.NOMBRE || product.Descripcion || '';
    const productType = product.Subrubro || '';
    const description = product.DescripcionCorta || product.Descripcion || '';

    return getSizeChartImage(productName, productType, description);
}

/**
 * Verifica si existe una imagen de talles para un producto
 */
export function hasSizeChart(product: {
    NOMBRE?: string;
    Descripcion?: string | null;
    Subrubro?: string | null;
}): boolean {
    return getProductSizeChart(product) !== null;
}
