/**
 * Tipos para la nueva estructura de productos (V2)
 * Procesa archivo CSV con estructura simplificada
 */

// Tipo base de producto desde CSV
export interface ProductV2Raw {
    codigo: string;
    item: string; // Descripción completa con talle/color
    rubro: string; // PRODUCTO WORKWEAR o PRODUCTO OFFICE
    subrubro: string; // BUZO, CAMISA, etc.
    deposito: string; // ECOMMERCE (no se usa)
    stock: number;
    precioLista: string; // Formato: $35,900.00
    fotos?: string; // Paths separados por comas: "camisa-drill-dama-celeste-1, camisa-drill-dama-celeste-2"
    talles?: string; // Slug para tabla de talles: "buzo-standard-unisex"
    bordados?: string; // Slug de bordado: "superiores", "pantalon-jean", "pantalon-chino", "pantalon-cargo"
}

// Producto procesado con datos normalizados
export interface ProductV2 extends Omit<ProductV2Raw, 'precioLista' | 'fotos' | 'talles' | 'bordados'> {
    precioLista: number; // Precio parseado como número
    imagenes: string[]; // Array de paths de imágenes
    imagen?: string; // Imagen principal (primera del array)
    tablaTallesImage?: string; // Path a imagen de tabla de talles
    indicacionesBordadosImage?: string; // Path a imagen de indicaciones de bordados
    nombreBase: string; // Nombre sin talle/color para agrupación
    talle?: string; // Talle extraído del item
    color?: string; // Color extraído del item
    rubroNormalizado: 'WORKWEAR' | 'BASIC'; // Rubro normalizado
}

// Variante de producto (para agrupación)
export interface ProductV2Variant {
    codigo: string;
    talle?: string;
    color?: string;
    stock: number;
    precioLista: number;
    producto: ProductV2;
}

// Producto agrupado (misma lógica que antes)
export interface GroupedProductV2 {
    skuBase: string; // Nombre base del producto
    skuBaseSlug: string; // Slug URL-friendly
    displayProduct: ProductV2; // Producto principal para mostrar
    variants: ProductV2Variant[]; // Array de variantes
    totalVariants: number;
    availableColors: string[]; // Colores disponibles
    availableSizes: string[]; // Talles disponibles
}

// Rubro normalizado
export interface RubroV2 {
    id: string; // ID único: 'workwear' o 'basic'
    nombre: string; // 'PRODUCTO WORKWEAR' o 'PRODUCTO OFFICE'
    nombreNormalizado: 'WORKWEAR' | 'BASIC';
    subrubros: SubrubroV2[];
}

// Subrubro normalizado
export interface SubrubroV2 {
    id: string; // Slug del subrubro
    nombre: string; // Nombre original
    rubroId: string; // ID del rubro padre
}

// Filtros para productos V2
export interface ProductV2Filters {
    rubro?: 'WORKWEAR' | 'BASIC';
    subrubro?: string;
    searchTerm?: string;
    minPrecio?: number;
    maxPrecio?: number;
    disponible?: boolean; // Solo productos con stock > 0
}

// Response con productos agrupados
export interface ProductsV2Response {
    products: GroupedProductV2[];
    total: number;
    rubros: RubroV2[];
    subrubros: SubrubroV2[];
}

