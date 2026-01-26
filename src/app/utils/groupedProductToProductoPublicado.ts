/**
 * Utilidad para convertir GroupedProduct a ProductoPublicado
 * Permite usar ProductCardPublicado con datos de GroupedProduct
 */

import { GroupedProduct } from '@/app/types/producto';
import { ProductoPublicado, VariantePublicada } from '@/app/types/producto-publicado.types';

/**
 * Convierte un GroupedProduct a ProductoPublicado
 */
export function groupedProductToProductoPublicado(group: GroupedProduct): ProductoPublicado {
  // Extraer colores y talles únicos de las variantes
  const colores = Array.from(
    new Set(
      group.variants
        .map((v) => v.color)
        .filter((c): c is string => Boolean(c))
    )
  );

  const talles = Array.from(
    new Set(
      group.variants
        .map((v) => v.talle)
        .filter((t): t is string => Boolean(t))
    )
  );

  // Convertir variantes
  const variantes: VariantePublicada[] = group.variants.map((variant, index) => ({
    id: index + 1, // ID temporal basado en índice
    codigo: variant.codigo,
    color: variant.color || null,
    talle: variant.talle || null,
    stock: variant.stock || 0,
    precio: variant.producto.PrecioVenta || 0,
    imagen: variant.producto.imagen || variant.producto.imagenes?.[0] || null,
    tieneImagen: Boolean(variant.producto.imagen || variant.producto.imagenes?.[0]),
  }));

  // Calcular precios (usar el precio de la primera variante o displayProduct)
  const precioLista = group.displayProduct.PrecioVenta || null;
  const precioTransfer = group.displayProduct.precioTransfer || null;
  const precio3Cuotas = group.displayProduct.precio3cuotas || null;
  const precioSinImp = group.displayProduct.precioSImp || null;

  // Calcular stock total
  const stockTotal = variantes.reduce((sum, v) => sum + v.stock, 0);

  // Calcular precios min/max
  const precios = variantes.map((v) => v.precio).filter((p) => p > 0);
  const precioMin = precios.length > 0 ? Math.min(...precios) : null;
  const precioMax = precios.length > 0 ? Math.max(...precios) : null;

  // Crear ID único desde código de producto
  const createProductId = (codigo: string): number => {
    let hash = 0;
    for (let i = 0; i < codigo.length; i++) {
      const char = codigo.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  return {
    // Datos básicos
    id: createProductId(group.skuBase),
    codigoAgrupacion: group.skuBase,
    slug: group.skuBaseSlug || null,
    nombre: group.displayProduct.NOMBRE || group.displayProduct.Descripcion || group.skuBase,
    descripcion: group.displayProduct.descripcionCompleta || group.displayProduct.Descripcion || null,
    descripcionCorta: group.displayProduct.DescripcionCorta || null,

    // Metadatos
    destacado: false, // GroupedProduct no tiene este campo, usar false por defecto
    orden: 0,
    sexo: extractSexo(group.displayProduct.NOMBRE || group.displayProduct.Descripcion || ''),
    rubro: group.displayProduct.Rubro
      ? {
          id: createProductId(group.displayProduct.Rubro),
          nombre: group.displayProduct.Rubro,
          slug: group.displayProduct.Rubro.toLowerCase().replace(/\s+/g, '-'),
        }
      : null,
    subrubro: group.displayProduct.Subrubro
      ? {
          id: createProductId(group.displayProduct.Subrubro),
          nombre: group.displayProduct.Subrubro,
          slug: group.displayProduct.Subrubro.toLowerCase().replace(/\s+/g, '-'),
        }
      : null,

    // Imagen principal
    imagenPrincipal: group.displayProduct.imagen || group.displayProduct.imagenes?.[0] || null,

    // Precios calculados
    precioLista,
    precioTransfer,
    precio3Cuotas,
    precioSinImp,

    // Variantes simplificadas
    variantes,

    // Agregados pre-calculados
    colores,
    talles,
    totalVariantes: group.totalVariants,
    tieneStock: stockTotal > 0,
    stockTotal,
    precioMin,
    precioMax,
  };
}

/**
 * Extrae el sexo del nombre del producto
 */
function extractSexo(texto: string): string | null {
  const lower = texto.toLowerCase();
  if (lower.includes('hombre') || lower.includes('masculino')) return 'hombre';
  if (lower.includes('dama') || lower.includes('mujer') || lower.includes('femenino')) return 'dama';
  if (lower.includes('unisex')) return 'unisex';
  return null;
}

