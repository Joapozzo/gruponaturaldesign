/**
 * Utilidades para adaptar ProductoPadreConVariantes del backend a GroupedProduct del frontend
 */

import type { ProductoPadreConVariantes } from '../types/producto-detail.types';
import type { GroupedProduct, ProductWithImage, ProductVariant } from '../types/producto';
import { normalizeImageUrl } from './normalizeImageUrl';

/**
 * Adapta ProductoPadreConVariantes del backend a GroupedProduct del frontend
 */
export function adaptProductoPadreToGroupedProduct(
  productoPadre: ProductoPadreConVariantes
): GroupedProduct {
  // Obtener la primera variante para el displayProduct
  const primeraVariante = productoPadre.productosWeb?.[0];
  
  // Obtener todas las imágenes de todas las variantes (normalizadas)
  const todasLasImagenes: string[] = [];
  if (productoPadre.imagenes && typeof productoPadre.imagenes === 'object') {
    const imagenesArray = Array.isArray(productoPadre.imagenes)
      ? productoPadre.imagenes
      : Object.values(productoPadre.imagenes);
    const imagenesNormalizadas = imagenesArray
      .filter((img): img is string => typeof img === 'string')
      .map(normalizeImageUrl)
      .filter((img): img is string => !!img);
    todasLasImagenes.push(...imagenesNormalizadas);
  }
  
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
    precio3cuotas: primeraVariante?.precios?.find(p => p.tipoCliente === 'minorista')?.precioFinanciado
      ? Number(primeraVariante.precios.find(p => p.tipoCliente === 'minorista')!.precioFinanciado)
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

    // Obtener imágenes de esta variante (normalizadas)
    const imagenesVariante: string[] = [];
    if (variante.imagenVariante) {
      const normalized = normalizeImageUrl(variante.imagenVariante);
      if (normalized) imagenesVariante.push(normalized);
    }
    variante.imagenes?.forEach((img) => {
      if (img.imagenUrl) {
        const normalized = normalizeImageUrl(img.imagenUrl);
        if (normalized && !imagenesVariante.includes(normalized)) {
          imagenesVariante.push(normalized);
        }
      }
    });

    // Crear ProductWithImage para esta variante
    const variantProduct: ProductWithImage = {
      ...displayProduct,
      Codigo: variante.sfactoryCodigo,
      Descripcion: variante.descripcionCompleta || variante.nombre || displayProduct.Descripcion,
      PrecioVenta: precio,
      Barcode: variante.sfactoryBarcode || null,
      imagen: imagenesVariante[0] || displayProduct.imagen,
      imagenes: imagenesVariante.length > 0 ? imagenesVariante : displayProduct.imagenes,
      precioTransfer: precioVariante?.precioTransfer ? Number(precioVariante.precioTransfer) : displayProduct.precioTransfer,
      precioSImp: precioVariante?.precioSinImp ? Number(precioVariante.precioSinImp) : displayProduct.precioSImp,
      precio3cuotas: precioVariante?.precioFinanciado ? Number(precioVariante.precioFinanciado) : displayProduct.precio3cuotas,
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

  // Obtener colores y talles únicos
  const availableColors = Array.from(
    new Set(
      (productoPadre.productosWeb || [])
        .map((v) => v.color)
        .filter((c): c is string => !!c)
    )
  ).sort();

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
    displayProduct,
    variants,
    totalVariants: variants.length,
    availableColors: availableColors.length > 0 ? availableColors : undefined,
    availableSizes: availableSizes.length > 0 ? availableSizes : undefined,
  };
}

