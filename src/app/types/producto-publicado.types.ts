/**
 * Tipos para productos publicados (ecommerce)
 * Estructura optimizada para renderizado directo en el frontend
 * Sincronizado con api/src/types/producto.types.ts
 */

// ============================================
// Variante Publicada
// ============================================

export interface VariantePublicada {
  id: number;
  codigo: string;
  color: string | null;
  talle: string | null;
  // sexo eliminado - se hereda del producto padre
  stock: number;
  precio: number;
  imagen: string | null; // Imagen por color (todas las variantes del mismo color tienen la misma)
  tieneImagen: boolean;
}

// ============================================
// Producto Publicado
// ============================================

export interface ProductoPublicado {
  // Datos básicos
  id: number;
  codigoAgrupacion: string;
  slug: string | null;
  nombre: string;
  descripcion: string | null;
  descripcionCorta: string | null;
  
  // Metadatos
  destacado: boolean;
  orden: number;
  sexo: string | null; // Sexo del producto padre (heredado por todas las variantes)
  rubro: {
    id: number;
    nombre: string;
    slug: string;
  } | null;
  subrubro: {
    id: number;
    nombre: string;
    slug: string;
  } | null;
  
  // Imagen principal
  imagenPrincipal: string | null;
  
  // Precios calculados
  precioLista: number | null;
  precioTransfer: number | null;
  precio3Cuotas: number | null;
  precioSinImp: number | null;
  
  // Variantes simplificadas
  variantes: VariantePublicada[];
  
  // Agregados pre-calculados
  colores: string[];
  talles: string[];
  totalVariantes: number;
  tieneStock: boolean;
  stockTotal: number;
  precioMin: number | null;
  precioMax: number | null;
}

// ============================================
// Query Params
// ============================================

export interface ProductoPublicadoQueryParams {
  searchTerm?: string;
  destacado?: boolean;
  rubroId?: number;
  subrubroId?: number;
  search?: string;
  tieneStock?: boolean;
  genero?: string;
  color?: string;
  talle?: string;
  page?: number;
  limit?: number;
  sortBy?: 'destacado' | 'nombre' | 'precio' | 'orden';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Pagination
// ============================================

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// Service Response (normalizado por apiClient)
// ============================================

export interface ProductosPublicadosServiceResponse {
  productos: ProductoPublicado[];
  pagination: PaginationInfo;
}

// ============================================
// API Response (raw del backend)
// ============================================
// El backend retorna PaginatedApiResponse<ProductoPublicado>
// El apiClient normaliza automáticamente a ProductosPublicadosServiceResponse

export interface CartItemProps {
    item: {
        product: {
            id: number;
            nombre: string;
            imagen: string;
            precio: number; // Mantener por compatibilidad
            precioLista: number;
            precioTransfer?: number | null;
            precioSinImp?: number | null;
            stock?: number;
            categoria: string;
            skuBaseSlug?: string;
        };
        quantity: number;
        subtotal: number;
        subtotalTransfer?: number;
        subtotalSinImp?: number;
        especificaciones?: string;
        bordado?: boolean;
    };
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
    onUpdateBordado?: (productId: number, bordado: boolean) => void;
    canAddMore?: boolean;
    totalItemsInCart?: number;
}