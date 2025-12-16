'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProductsV2 } from '@/app/hooks/useProductsV2';
import { GroupedProductV2 } from '@/app/types/producto-v2';
import { GroupedProduct, ProductVariant, ProductWithImage } from '@/app/types/producto';
import { nombreToSlug } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import { useProductCardImage } from './product-card/hooks/useProductCardImage';
import SearchInput from './ui/SearchInput';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Función para normalizar strings removiendo acentos
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Adaptar GroupedProductV2 a GroupedProduct (igual que ProductsGrid)
const adaptGroupedProductV2ToGroupedProduct = (groupV2: GroupedProductV2): GroupedProduct => {
  const displayProduct: ProductWithImage = {
    Codigo: groupV2.displayProduct.codigo,
    Tipo: null,
    Descripcion: groupV2.displayProduct.item,
    UM: null,
    Rubro: groupV2.displayProduct.rubro,
    Subrubro: groupV2.displayProduct.subrubro,
    Activo: true,
    Moneda: null,
    PrecioCosto: null,
    UltActualizacion: null,
    CostoXLM: null,
    ListaMaterial: null,
    PrecioUMCompra: null,
    UMCompra: null,
    PrecioVenta: groupV2.displayProduct.precioLista,
    UtilidadP: null,
    UtilidadR: null,
    Base: null,
    Barcode: null,
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
    DescripcionCorta: groupV2.displayProduct.nombreBase,
    Observaciones: null,
    ProveedorPorDefecto: null,
    DepositoConsumo: null,
    Ubicacion: null,
    ItemLote: null,
    ItemSerie: null,
    Clase: null,
    Linea: null,
    Material: null,
    ActPrecioXOC: null,
    FlowintSincroEnabled: null,
    Usuario: null,
    FechaAlta: null,
    imagen: groupV2.displayProduct.imagen || null,
    imagenes: groupV2.displayProduct.imagenes || [],
    tablaTallesImage: groupV2.displayProduct.tablaTallesImage || null,
    indicacionesBordadosUrl: groupV2.displayProduct.indicacionesBordadosImage || null,
    NOMBRE: groupV2.displayProduct.nombreBase,
  };

  const variants: ProductVariant[] = groupV2.variants.map(v => {
    const variantProduct: ProductWithImage = {
      ...displayProduct,
      Descripcion: v.producto.item || displayProduct.Descripcion,
      PrecioVenta: v.precioLista || displayProduct.PrecioVenta,
      imagenes: v.producto.imagenes || displayProduct.imagenes,
      imagen: v.producto.imagen || displayProduct.imagen,
    };
    
    return {
      codigo: v.codigo,
      variantNumber: 0,
      talle: v.talle,
      color: v.color,
      stock: v.stock,
      producto: variantProduct,
    };
  });

  return {
    skuBase: groupV2.skuBase,
    skuBaseSlug: groupV2.skuBaseSlug,
    displayProduct,
    variants,
    totalVariants: groupV2.totalVariants,
    availableColors: groupV2.availableColors,
    availableSizes: groupV2.availableSizes,
  };
};

// Componente interno para cada producto en la búsqueda - usa el mismo hook que ProductCardGrouped
interface SearchProductItemProps {
  product: GroupedProduct;
  onClick: () => void;
}

const SearchProductItem: React.FC<SearchProductItemProps> = ({ product, onClick }) => {
  // Usar la primera variante disponible (igual que ProductCardGrouped usa selectedVariant)
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const productToUse = firstVariant ? firstVariant.producto : product.displayProduct;
  const productName = productToUse.NOMBRE || productToUse.Descripcion || product.skuBase;
  const selectedColor = firstVariant?.color || null;
  
  // Usar el mismo hook que ProductCardGrouped
  const { mainImage, handleImageError } = useProductCardImage({
    product: productToUse,
    productName,
    selectedColor,
    availableColors: product.availableColors,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#Ed3237] hover:shadow-md cursor-pointer transition-all group"
    >
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {/* Siempre renderizar una imagen, incluso si es placeholder - igual que ProductCardImage */}
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-cover group-hover:scale-110 transition-transform"
          sizes="80px"
          unoptimized={true}
          onError={handleImageError}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-black line-clamp-2 group-hover:text-[#Ed3237] transition-colors">
          {productName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {(() => {
            let rubro = product.displayProduct.Rubro || product.displayProduct.Subrubro || '';
            // Quitar "PRODUCTO" del inicio
            if (rubro.toUpperCase().startsWith('PRODUCTO ')) {
              rubro = rubro.substring(9); // Quitar "PRODUCTO "
            }
            // Normalizar: OFFICE → BASIC
            if (rubro.toUpperCase().includes('OFFICE')) {
              return 'BASIC';
            }
            return rubro;
          })()}
        </p>
      </div>
    </motion.div>
  );
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Usar el mismo hook que usa shoponline (useProductsV2)
  const { products: productsV2, isLoading } = useProductsV2();
  
  // Adaptar productos V2 a formato compatible - solo cuando hay datos y está montado
  const groupedProducts = useMemo(() => {
    if (!mounted || !productsV2 || productsV2.length === 0) {
      return [];
    }
    return productsV2.map(adaptGroupedProductV2ToGroupedProduct);
  }, [productsV2, mounted]);

  // Focus en el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Búsqueda en tiempo real - usando el mismo formato que useGroupedCatalogFilters
  const results = useMemo(() => {
    if (!searchTerm.trim() || isLoading) {
      return [];
    }

    const normalizedSearchTerm = normalizeString(searchTerm);
    
    return groupedProducts.filter(product => {
      const nombre = normalizeString(product.displayProduct.NOMBRE || product.displayProduct.Descripcion || '');
      const descripcion = normalizeString(product.displayProduct.Descripcion || '');
      const rubro = normalizeString(product.displayProduct.Rubro || '');
      const subrubro = normalizeString(product.displayProduct.Subrubro || '');
      
      return nombre.includes(normalizedSearchTerm) ||
             descripcion.includes(normalizedSearchTerm) ||
             rubro.includes(normalizedSearchTerm) ||
             subrubro.includes(normalizedSearchTerm);
    });
  }, [searchTerm, groupedProducts, isLoading]);

  // Simular delay para mejor UX
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, 200);
      return () => clearTimeout(timeoutId);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleProductClick = (product: GroupedProduct) => {
    // Cerrar modal y navegar usando el mismo formato que ProductCardGrouped
    onClose();
    const slug = product.skuBaseSlug || nombreToSlug(product.skuBase);
    // Usar window.location para asegurar navegación completa
    window.location.href = `/producto/${slug}`;
  };

  const handleViewAllResults = () => {
    onClose();
    // Navegar al catálogo con el término de búsqueda
    router.push(`/shoponline?search=${encodeURIComponent(searchTerm)}`);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 99999 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 bg-white shadow-2xl max-h-screen overflow-hidden flex flex-col"
            style={{ zIndex: 100000 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
              <SearchInput
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                onClear={() => setSearchTerm('')}
                showClearButton={true}
              />
              <button
                onClick={onClose}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#Ed3237]"></div>
                </div>
              ) : searchTerm && results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No se encontraron productos</p>
                  <p className="text-gray-400 text-sm mt-2">Intenta con otros términos de búsqueda</p>
                </div>
              ) : searchTerm && results.length > 0 ? (
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>
                    {results.length > 0 && (
                      <button
                        onClick={handleViewAllResults}
                        className="flex items-center gap-2 text-sm text-[#Ed3237] hover:text-red-700 font-medium"
                      >
                        Ver todos los resultados
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.slice(0, 6).map((product) => (
                      <SearchProductItem
                        key={product.skuBase}
                        product={product}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Busca productos por nombre, categoría o descripción</p>
                  <p className="text-gray-400 text-sm mt-2">Escribe para comenzar a buscar</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default SearchModal;

