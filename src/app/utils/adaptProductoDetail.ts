/**
 * Utilidades para adaptar ProductoPadreConVariantes del backend a GroupedProduct del frontend
 */

import type { ProductoPadreConVariantes } from '../types/producto-detail.types';
import type { GroupedProduct, ProductWithImage, ProductVariant } from '../types/producto';
import { normalizeImageUrl } from './normalizeImageUrl';
import { filterImagesByColor } from './productHelpers';

function collectPadreImagenes(productoPadre: ProductoPadreConVariantes): string[] {
  const urls: string[] = [];
  if (productoPadre.imagenes && typeof productoPadre.imagenes === 'object') {
    const imagenesArray = Array.isArray(productoPadre.imagenes)
      ? productoPadre.imagenes
      : Object.values(productoPadre.imagenes);
    for (const img of imagenesArray) {
      if (typeof img === 'string') {
        const normalized = normalizeImageUrl(img);
        if (normalized && !urls.includes(normalized)) {
          urls.push(normalized);
        }
      }
    }
  }
  return urls;
}

function sortImagenesBySuffixNumber(urls: string[]): string[] {
  return [...urls].sort((a, b) => {
    const numA = parseInt(a.match(/-(\d+)\./)?.[1] || '0', 10);
    const numB = parseInt(b.match(/-(\d+)\./)?.[1] || '0', 10);
    return numA - numB;
  });
}

/** Imágenes del producto sin dimensión de color (solo talle u otro). */
function getImagenesSinColor(
  productoPadre: ProductoPadreConVariantes,
  padreImagenes: string[],
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (url: string | null | undefined) => {
    const normalized = normalizeImageUrl(url);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  };

  for (const url of padreImagenes) {
    add(url);
  }

  for (const variante of productoPadre.productosWeb ?? []) {
    if (variante.imagenVariante) {
      add(variante.imagenVariante);
    }

    for (const img of variante.imagenes ?? []) {
      if (img.imagenUrl) {
        add(img.imagenUrl);
      }
    }
  }

  return sortImagenesBySuffixNumber(result);
}

/** Imágenes de un color: variantes del mismo color + padre filtrado por slug en path. */
function getImagenesForColor(
  productoPadre: ProductoPadreConVariantes,
  color: string | null | undefined,
  padreImagenes: string[],
): string[] {
  if (!color) {
    return getImagenesSinColor(productoPadre, padreImagenes);
  }

  const seen = new Set<string>();
  const result: string[] = [];
  const colorLower = color.toLowerCase();

  const add = (url: string | null | undefined) => {
    const normalized = normalizeImageUrl(url);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  };

  for (const variante of productoPadre.productosWeb ?? []) {
    if (variante.color?.toLowerCase() !== colorLower) continue;

    if (variante.imagenVariante) {
      add(variante.imagenVariante);
    }

    for (const img of variante.imagenes ?? []) {
      if (!img.imagenUrl) continue;
      if (!img.color || img.color.toLowerCase() === colorLower) {
        add(img.imagenUrl);
      }
    }
  }

  for (const url of filterImagesByColor(padreImagenes, color)) {
    add(url);
  }

  return sortImagenesBySuffixNumber(result);
}

/**
 * Adapta ProductoPadreConVariantes del backend a GroupedProduct del frontend
 */
export function adaptProductoPadreToGroupedProduct(
  productoPadre: ProductoPadreConVariantes
): GroupedProduct {
  // Obtener la primera variante para el displayProduct
  const primeraVariante = productoPadre.productosWeb?.[0];
  const padreImagenes = collectPadreImagenes(productoPadre);
  
  // Obtener todas las imágenes de todas las variantes (normalizadas)
  const todasLasImagenes: string[] = [...padreImagenes];
  
  // Agregar imágenes de variantes (normalizadas)
  productoPadre.productosWeb?.forEach((variante) => {
    if (variante.imagenVariante) {
      const normalized = normalizeImageUrl(variante.imagenVariante);
      if (normalized && !todasLasImagenes.includes(normalized)) {
        todasLasImagenes.push(normalized);
      }
    }
    variante.imagenes?.forEach((img) => {
      if (img.imagenUrl) {
        const normalized = normalizeImageUrl(img.imagenUrl);
        if (normalized && !todasLasImagenes.includes(normalized)) {
          todasLasImagenes.push(normalized);
        }
      }
    });
  });

  // Obtener precio de la primera variante o del precio más bajo
  let precioVenta: number | null = null;
  if (primeraVariante) {
    // Priorizar precio de ProductoPrecio, sino usar precioCache
    const precioMinorista = primeraVariante.precios?.find(p => p.tipoCliente === 'minorista');
    precioVenta = precioMinorista 
      ? Number(precioMinorista.precioLista)
      : (primeraVariante.precioCache ? Number(primeraVariante.precioCache) : null);
  }

  // Crear displayProduct
  const displayProduct: ProductWithImage = {
    Codigo: primeraVariante?.sfactoryCodigo || productoPadre.codigoAgrupacion,
    Tipo: null,
    Descripcion: productoPadre.descripcion || productoPadre.nombre,
    UM: productoPadre.um || null,
    Rubro: productoPadre.rubro?.nombre || null,
    Subrubro: productoPadre.subrubro?.nombre || null,
    Activo: productoPadre.publicado,
    Moneda: null,
    PrecioCosto: null,
    UltActualizacion: null,
    CostoXLM: null,
    ListaMaterial: productoPadre.material || null,
    PrecioUMCompra: null,
    UMCompra: null,
    PrecioVenta: precioVenta,
    UtilidadP: null,
    UtilidadR: null,
    Base: null,
    Barcode: primeraVariante?.sfactoryBarcode || null,
    EqCodigoContable: null,
    EqCodigoExterno: null,
    ItemDeCompra: null,
    ItemDeVenta: true,
    ItemDeAlquiler: null,
    Fabricar: null,
    APedido: null,
    GrupoGasto: null,
    CTACompras: null,
    CTAVentas: null,
    StockMin: null,
    StockMax: null,
    PesoBruto: null,
    DescripcionCorta: productoPadre.descripcionCorta || productoPadre.nombre,
    Observaciones: null,
    ProveedorPorDefecto: null,
    DepositoConsumo: null,
    Ubicacion: null,
    ItemLote: null,
    ItemSerie: null,
    Clase: null,
    Linea: productoPadre.linea || null,
    Material: productoPadre.material || null,
    ActPrecioXOC: null,
    FlowintSincroEnabled: null,
    Usuario: null,
    FechaAlta: null,
    // Campos extendidos (normalizar URLs)
    imagen: normalizeImageUrl(todasLasImagenes[0] || null),
    imagenes: todasLasImagenes.map(normalizeImageUrl).filter((img): img is string => !!img),
    tablaTallesImage: normalizeImageUrl(productoPadre.tablaTallesUrl ?? null) ?? null,
    tablaTallesUrl: normalizeImageUrl(productoPadre.tablaTallesUrl ?? null) ?? null,
    indicacionesBordadosUrl: normalizeImageUrl(productoPadre.fichaTecnicaUrl ?? null) ?? null,
    NOMBRE: productoPadre.nombre,
    rubroNormalizado: productoPadre.rubro?.nombre?.includes('WORKWEAR') ? 'WORKWEAR' : 'BASIC',
    // Precios
    precioTransfer: primeraVariante?.precios?.find(p => p.tipoCliente === 'minorista')?.precioTransfer 
      ? Number(primeraVariante.precios.find(p => p.tipoCliente === 'minorista')!.precioTransfer)
      : undefined,
    precioSImp: primeraVariante?.precios?.find(p => p.tipoCliente === 'minorista')?.precioSinImp
      ? Number(primeraVariante.precios.find(p => p.tipoCliente === 'minorista')!.precioSinImp)
      : undefined,
    descripcionCompleta: productoPadre.descripcionMarketing ?? productoPadre.descripcion ?? undefined,
    textiles: undefined,
  };

  // Crear variantes
  const variants: ProductVariant[] = (productoPadre.productosWeb || []).map((variante, index) => {
    // Obtener precio de esta variante
    const precioVariante = variante.precios?.find(p => p.tipoCliente === 'minorista');
    const precio = precioVariante
      ? Number(precioVariante.precioLista)
      : (variante.precioCache ? Number(variante.precioCache) : precioVenta);

    // Imágenes del color (compartidas entre talles), no solo de esta fila
    const imagenesVariante = getImagenesForColor(productoPadre, variante.color, padreImagenes);

    // Crear ProductWithImage para esta variante
    const variantProduct: ProductWithImage = {
      ...displayProduct,
      Codigo: variante.sfactoryCodigo,
      Descripcion: variante.descripcionCompleta || variante.nombre || displayProduct.Descripcion,
      PrecioVenta: precio,
      Barcode: variante.sfactoryBarcode || null,
      imagen: imagenesVariante[0] ?? null,
      imagenes: imagenesVariante,
      precioTransfer: precioVariante?.precioTransfer ? Number(precioVariante.precioTransfer) : displayProduct.precioTransfer,
      precioSImp: precioVariante?.precioSinImp ? Number(precioVariante.precioSinImp) : displayProduct.precioSImp,
    };

    return {
      codigo: variante.sfactoryCodigo,
      variantNumber: index,
      talle: variante.talle || undefined,
      color: variante.color || undefined,
      stock: variante.stockCache ? Number(variante.stockCache) : undefined,
      productoWebId: variante.id,
      productoPadreId: variante.productoPadreId,
      sfactoryItemId: variante.sfactoryId,
      producto: variantProduct,
    };
  });

  // Colores con al menos una variante con stock
  const availableColors = Array.from(
    new Set(
      (productoPadre.productosWeb || [])
        .filter((v) => v.color && (v.stockCache ? Number(v.stockCache) : 0) > 0)
        .map((v) => v.color as string)
    )
  ).sort();

  // Si ninguno tiene stock, listar todos los colores existentes (producto agotado)
  const allColors = Array.from(
    new Set(
      (productoPadre.productosWeb || [])
        .map((v) => v.color)
        .filter((c): c is string => !!c)
    )
  ).sort();

  const colorsForSelector = availableColors.length > 0 ? availableColors : allColors;

  const availableSizes = Array.from(
    new Set(
      (productoPadre.productosWeb || [])
        .map((v) => v.talle)
        .filter((t): t is string => !!t)
    )
  ).sort();

  return {
    skuBase: productoPadre.nombre,
    skuBaseSlug: productoPadre.slug || undefined,
    productoPadreId: productoPadre.id,
    destacado: productoPadre.destacado,
    displayProduct,
    variants,
    totalVariants: variants.length,
    availableColors: colorsForSelector.length > 0 ? colorsForSelector : undefined,
    availableSizes: availableSizes.length > 0 ? availableSizes : undefined,
  };
}

