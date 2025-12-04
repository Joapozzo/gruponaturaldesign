'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGroupedProducts } from '@/app/hooks/useGroupedProducts';
import { GroupedProduct } from '@/app/types/producto';
import { nombreToSlug, getFirstProductImage, getProductImagesByColor } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
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

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Usar el mismo hook que usa la página
  const { groupedProducts, isLoading } = useGroupedProducts();

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
                    {results.slice(0, 6).map((product) => {
                      const productName = product.displayProduct.NOMBRE || product.displayProduct.Descripcion || product.skuBase;
                      const displayProduct = product.displayProduct;
                      
                      // Usar la misma lógica que useProductCardImage para obtener la imagen
                      let mainImage = '/imgs/producto-placeholder.png';
                      
                      // Prioridad 1: Imagen del primer color disponible
                      if (productName && product.availableColors && product.availableColors.length > 0) {
                        const firstColorImages = getProductImagesByColor(productName, product.availableColors[0]);
                        if (firstColorImages.length > 0) {
                          mainImage = firstColorImages[0];
                        }
                      }
                      
                      // Prioridad 2: Primera imagen disponible del producto (cualquier color)
                      if (mainImage === '/imgs/producto-placeholder.png' && productName) {
                        mainImage = getFirstProductImage(productName);
                      }
                      
                      // Prioridad 3: Imágenes del producto si existen
                      if (mainImage === '/imgs/producto-placeholder.png') {
                        const productImages = displayProduct.imagenes && displayProduct.imagenes.length > 0
                          ? displayProduct.imagenes.filter((img) => img && img.trim() !== '' && !img.includes('.png'))
                          : displayProduct.imagen && displayProduct.imagen.trim() !== '' && !displayProduct.imagen.includes('.png')
                            ? [displayProduct.imagen]
                            : [];
                        if (productImages.length > 0) {
                          mainImage = productImages[0];
                        }
                      }
                      
                      return (
                        <motion.div
                          key={product.skuBase}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleProductClick(product)}
                          className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#Ed3237] hover:shadow-md cursor-pointer transition-all group"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={mainImage}
                              alt={productName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                              onError={(e) => {
                                // Si falla, intentar con otro color o usar placeholder
                                const target = e.target as HTMLImageElement;
                                if (productName && product.availableColors && product.availableColors.length > 1) {
                                  const nextColorImages = getProductImagesByColor(productName, product.availableColors[1]);
                                  if (nextColorImages.length > 0) {
                                    target.src = nextColorImages[0];
                                    return;
                                  }
                                }
                                target.src = '/imgs/producto-placeholder.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-black line-clamp-2 group-hover:text-[#Ed3237] transition-colors">
                              {productName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{product.displayProduct.Rubro || product.displayProduct.Subrubro || ''}</p>
                            {product.totalVariants > 1 && (
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                                {product.totalVariants} variantes
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
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

