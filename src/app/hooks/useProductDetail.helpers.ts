/**
 * Helpers para useProductDetail
 * Extraídos del hook original para mejor organización
 */

import { GroupedProduct } from '@/app/types/producto';

export interface OutfitRelations {
  keywords: string[];
  complementaryTypes: string[];
  complementaryRubros?: string[];
  complementarySubrubros?: string[];
}

export const OUTFIT_RELATIONS: OutfitRelations[] = [
  {
    keywords: ['camisa', 'shirt', 'remera', 'chomba'],
    complementaryTypes: ['pantalón', 'pantalon', 'jean', 'pantalones', 'abrigo', 'buzo', 'camisa', 'remera', 'chomba'],
    complementaryRubros: undefined,
  },
  {
    keywords: ['pantalón', 'pantalon', 'jean', 'pantalones'],
    complementaryTypes: ['camisa', 'remera', 'chomba', 'shirt', 'abrigo', 'buzo', 'pantalón', 'pantalon'],
    complementaryRubros: undefined,
  },
  {
    keywords: ['buzo', 'abrigo', 'sweater', 'pullover'],
    complementaryTypes: ['camisa', 'remera', 'chomba', 'pantalón', 'pantalon', 'jean', 'buzo', 'abrigo'],
    complementaryRubros: undefined,
  },
  {
    keywords: ['chaleco', 'vest'],
    complementaryTypes: ['camisa', 'remera', 'chomba', 'pantalón', 'pantalon'],
    complementaryRubros: undefined,
  },
];

export function findRelatedProductsForOutfit(
  currentProduct: GroupedProduct,
  allProducts: GroupedProduct[],
  maxResults: number = 4
): GroupedProduct[] {
  const productText = [
    currentProduct.displayProduct.Descripcion,
    currentProduct.displayProduct.NOMBRE,
    currentProduct.displayProduct.Rubro,
    currentProduct.displayProduct.Subrubro,
    currentProduct.skuBase,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matchingRelation = OUTFIT_RELATIONS.find(relation =>
    relation.keywords.some(keyword => productText.includes(keyword.toLowerCase()))
  );

  if (!matchingRelation) {
    return allProducts
      .filter(p => 
        p.displayProduct.Rubro === currentProduct.displayProduct.Rubro &&
        p.skuBase !== currentProduct.skuBase
      )
      .slice(0, maxResults);
  }

  const relatedProducts: GroupedProduct[] = [];
  const usedSkus = new Set([currentProduct.skuBase]);

  // Prioridad 1: Productos con tipos complementarios
  for (const product of allProducts) {
    if (relatedProducts.length >= maxResults) break;
    if (usedSkus.has(product.skuBase)) continue;

    const productTextToCheck = [
      product.displayProduct.Descripcion,
      product.displayProduct.NOMBRE,
      product.displayProduct.Rubro,
      product.displayProduct.Subrubro,
      product.skuBase,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const isComplementary = matchingRelation.complementaryTypes.some(type =>
      productTextToCheck.includes(type.toLowerCase())
    );

    const rubroMatch = !matchingRelation.complementaryRubros || 
      matchingRelation.complementaryRubros.length === 0 ||
      matchingRelation.complementaryRubros.some(rubro => 
        product.displayProduct.Rubro?.toLowerCase().includes(rubro.toLowerCase())
      );

    if (isComplementary && rubroMatch) {
      relatedProducts.push(product);
      usedSkus.add(product.skuBase);
    }
  }

  // Prioridad 2: Mismo rubro
  if (relatedProducts.length < maxResults) {
    for (const product of allProducts) {
      if (relatedProducts.length >= maxResults) break;
      if (usedSkus.has(product.skuBase)) continue;

      if (product.displayProduct.Rubro === currentProduct.displayProduct.Rubro) {
        relatedProducts.push(product);
        usedSkus.add(product.skuBase);
      }
    }
  }

  // Prioridad 3: Mismo subrubro
  if (relatedProducts.length < maxResults && currentProduct.displayProduct.Subrubro) {
    for (const product of allProducts) {
      if (relatedProducts.length >= maxResults) break;
      if (usedSkus.has(product.skuBase)) continue;

      if (product.displayProduct.Subrubro === currentProduct.displayProduct.Subrubro) {
        relatedProducts.push(product);
        usedSkus.add(product.skuBase);
      }
    }
  }

  return relatedProducts.slice(0, maxResults);
}

