export type CategoriaIndumentaria = "ABRIGOS" | "PANTALONES" | "CHOMBAS Y REMERAS" | "CAMISAS";

export type ProductType = {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    categoriaIndumentaria: CategoriaIndumentaria;
    precio: string;
    imagenes: string[];
    destacado?: boolean;
};

export interface ProductSFactory {
    Codigo: string;
    Tipo: string | null;
    Descripcion: string | null;
    UM: string | null;
    Rubro: string | null;
    Subrubro: string | null;
    Activo: boolean | null;
    Moneda: string | null;
    PrecioCosto: number | null;
    UltActualizacion: string | null;
    CostoXLM: number | null;
    ListaMaterial: string | null;
    PrecioUMCompra: number | null;
    UMCompra: string | null;
    PrecioVenta: number | null;
    UtilidadP: number | null;
    UtilidadR: number | null;
    Base: string | null;
    Barcode: string | null;
    EqCodigoContable: string | null;
    EqCodigoExterno: string | null;
    ItemDeCompra: boolean | null;
    ItemDeVenta: boolean | null;
    ItemDeAlquiler: boolean | null;
    Fabricar: boolean | null;
    APedido: boolean | null;
    GrupoGasto: string | null;
    CTACompras: string | null;
    CTAVentas: string | null;
    StockMin: number | null;
    StockMax: number | null;
    PesoBruto: number | null;
    DescripcionCorta: string | null;
    Observaciones: string | null;
    ProveedorPorDefecto: string | null;
    DepositoConsumo: string | null;
    Ubicacion: string | null;
    ItemLote: boolean | null;
    ItemSerie: boolean | null;
    Clase: string | null;
    Linea: string | null;
    Material: string | null;
    ActPrecioXOC: boolean | null;
    FlowintSincroEnabled: boolean | null;
    Usuario: string | null;
    FechaAlta: string | null;
}

// Tipo extendido con imagen (para cuando las tengamos)
export interface ProductWithImage extends ProductSFactory {
    imagen?: string | null; // URL de la imagen principal
    imagenes?: string[]; // Array de URLs de todas las imágenes del producto
    imagenPlaceholder?: string; // Placeholder mientras no tengamos la imagen real
    // Enlaces a recursos externos
    tablaTallesUrl?: string | null; // URL a tabla de talles (Google Sheet)
    tablaTallesImage?: string | null; // URL local de la imagen de talles (/imgs/talles/)
    fotosDriveUrl?: string | null; // URL a carpeta de Drive con fotos del producto
    indicacionesBordadosUrl?: string | null; // URL a documento con indicaciones de bordados
    // Campos adicionales de la hoja 2
    NOMBRE?: string; // Nombre del producto desde la hoja 2 (para agrupación)
    TALLES?: string; // Talles disponibles
    COLORES?: string; // Colores disponibles
    // Rubro normalizado para filtros (PRODUCTO OFFICE → BASIC, PRODUCTO WORKWEAR → WORKWEAR)
    rubroNormalizado?: 'WORKWEAR' | 'BASIC';
    // Flag para variantes virtuales (combinaciones de color/talle que no existen físicamente)
    _isVirtual?: boolean; // Indica si es una variante virtual (no existe como producto físico)
    // Nuevos campos de precios
    precioTransfer?: number; // Precio transfer
    precioSImp?: number; // Precio sin impuestos
    precio3cuotas?: number; // Precio en 3 cuotas
    // Descripción y textiles
    descripcionCompleta?: string; // Descripción completa del producto
    textiles?: string; // Composición de textiles
}

// Filtros para productos
export interface ProductFilters {
    rubro?: string;
    subrubro?: string;
    activo?: boolean;
    itemDeVenta?: boolean;
    searchTerm?: string;
}

// Response type para paginación futura
export interface ProductsResponse {
    products: ProductWithImage[];
    total: number;
    page: number;
    pageSize: number;
}

// Tipos para productos con variantes
export interface ProductVariant {
    codigo: string;              // Código completo: L-OF-BU-RCON1
    variantNumber: number;       // Número de variante: 1, 2, 3...
    talle?: string;              // Extraído o mapeado
    color?: string;              // Extraído o mapeado
    colorHex?: string;          // Color en formato hexadecimal (opcional)
    stock?: number;              // Stock disponible
    producto: ProductWithImage;  // Datos completos del producto
}

export interface GroupedProduct {
    skuBase: string;                    // SKU sin número: L-OF-BU-RCON o nombre del producto
    skuBaseSlug?: string;               // Slug URL-friendly para navegación (ej: "jean-flow-dama")
    displayProduct: ProductWithImage;   // Producto principal para mostrar en cards
    variants: ProductVariant[];         // Array de variantes disponibles
    totalVariants: number;              // Total de variantes
    availableColors?: string[];         // Colores disponibles (si aplica)
    availableSizes?: string[];          // Talles disponibles (si aplica)
}