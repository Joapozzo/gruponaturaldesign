'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductImage } from './product-card/components/ProductImage';
import { useProductosPublicadosAll } from '@/app/hooks/useProductosPublicadosAll';
import type { ProductoPublicado } from '@/app/types/producto-publicado.types';
import { DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS } from '@/app/types/producto-publicado.types';
import SearchInput from './ui/SearchInput';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Normalizar strings (quitar acentos) para búsqueda
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Misma lógica que useProductCardImages: imagen principal o primera variante con imagen
function getProductImageSrc(producto: ProductoPublicado): string | null {
  const valid = (url: string | null | undefined) =>
    Boolean(url && typeof url === 'string' && url.trim() !== '');
  if (valid(producto.imagenPrincipal)) return producto.imagenPrincipal!;
  const conImagen = producto.variantes?.find((v) => valid(v.imagen));
  return conImagen?.imagen ?? null;
}

interface SearchProductItemProps {
  producto: ProductoPublicado;
  onClick: () => void;
}

const SearchProductItem: React.FC<SearchProductItemProps> = ({ producto, onClick }) => {
  const nombre = producto.nombre || '';
  const rubroNombre = producto.rubro?.nombre ?? producto.subrubro?.nombre ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="flex gap-2 p-2 rounded-lg border border-gray-200 hover:border-[#Ed3237] hover:shadow-md cursor-pointer transition-all group"
    >
      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        <ProductImage
          src={getProductImageSrc(producto)}
          alt={nombre}
          fill
          sizes="48px"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-xs text-black line-clamp-2 group-hover:text-[#Ed3237] transition-colors">
          {nombre}
        </h3>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {rubroNombre.toUpperCase().startsWith('PRODUCTO ')
            ? rubroNombre.substring(9)
            : rubroNombre}
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

  const { productos, isLoading } = useProductosPublicadosAll(DEFAULT_PRODUCTOS_PUBLICADOS_PARAMS);

  // Búsqueda en tiempo real sobre productos de la API
  const results = useMemo(() => {
    if (!searchTerm.trim() || isLoading) {
      return [];
    }
    const normalizedSearch = normalizeString(searchTerm);
    return productos.filter((p) => {
      const nombre = normalizeString(p.nombre || '');
      const desc = normalizeString(p.descripcion || p.descripcionCorta || '');
      const rubro = normalizeString(p.rubro?.nombre || '');
      const subrubro = normalizeString(p.subrubro?.nombre || '');
      return (
        nombre.includes(normalizedSearch) ||
        desc.includes(normalizedSearch) ||
        rubro.includes(normalizedSearch) ||
        subrubro.includes(normalizedSearch)
      );
    });
  }, [searchTerm, productos, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const t = setTimeout(() => setIsSearching(false), 200);
      return () => clearTimeout(t);
    }
    setIsSearching(false);
  }, [searchTerm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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

  const handleProductClick = (producto: ProductoPublicado) => {
    onClose();
    const slug = producto.slug || producto.codigoAgrupacion;
    window.location.href = `/producto/${slug}`;
  };

  const handleViewAllResults = () => {
    onClose();
    router.push(`/shoponline?search=${encodeURIComponent(searchTerm)}`);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 99999 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 bg-white shadow-2xl max-h-screen overflow-hidden flex flex-col"
            style={{ zIndex: 100000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-gray-200 px-3 py-2 flex-shrink-0">
              <div className="flex-1 [&_input]:text-sm [&_input]:py-2 [&_input]:pr-3">
                <SearchInput
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos..."
                  onClear={() => setSearchTerm('')}
                  showClearButton={true}
                />
              </div>
              <button
                onClick={onClose}
                className="ml-2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#Ed3237]" />
                </div>
              ) : searchTerm && results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No se encontraron productos</p>
                  <p className="text-gray-400 text-xs mt-1">Intenta con otros términos de búsqueda</p>
                </div>
              ) : searchTerm && results.length > 0 ? (
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">
                      {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                    </p>
                    <button
                      onClick={handleViewAllResults}
                      className="flex items-center gap-1 text-xs text-[#Ed3237] hover:text-red-700 font-medium"
                    >
                      Ver todos
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {results.slice(0, 6).map((producto) => (
                      <SearchProductItem
                        key={producto.id}
                        producto={producto}
                        onClick={() => handleProductClick(producto)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto text-center py-8">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Busca productos por nombre, categoría o descripción</p>
                  <p className="text-gray-400 text-xs mt-1">Escribe para comenzar a buscar</p>
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
