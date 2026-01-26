'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductoPublicado } from '../types/producto-publicado.types';
import { useProductCardPublicado } from './product-card/hooks/useProductCardPublicado';
import { useProductDiscount } from './product-card/hooks/useProductDiscount';
import { ProductImage } from './product-card/components/ProductImage';
import { ProductCardHeader } from './product-card/components/ProductCardHeader';
import { ProductCardSelectors } from './product-card/components/ProductCardSelectors';
import { ProductCardActions } from './product-card/components/ProductCardActions';
import { ProductCardBadges } from './product-card/components/ProductCardBadges';
import ConfirmModal from './modal/ConfirmModal';

interface ProductCardPublicadoProps {
  producto: ProductoPublicado;
  index: number;
  expandedSku?: string | null;
  onExpandChange?: (sku: string | null) => void;
  compact?: boolean;
}

const ProductCardPublicado: React.FC<ProductCardPublicadoProps> = ({
  producto,
  index,
  expandedSku,
  onExpandChange,
}) => {
  // Hook principal que maneja toda la lógica
  const {
    showSelectors,
    hasExplicitSelection,
    handleAddToCartClick,
    handleCancel,
    handleShowSelectors,
    selection,
    cart,
    images,
    handlers,
    isValid,
  } = useProductCardPublicado({
    producto,
    expandedSku,
    onExpandChange,
  });

  // Hook para calcular descuentos
  const discount = useProductDiscount({
    precioLista: producto?.precioLista || null,
    precioTransfer: producto?.precioTransfer || null,
    precio3Cuotas: producto?.precio3Cuotas || null,
  });

  // Validaciones
  if (!producto) {
    console.warn('[ProductCardPublicado] Producto es undefined');
    return null;
  }

  if (!isValid) {
    console.warn('[ProductCardPublicado] Producto sin variantes válidas:', producto.codigoAgrupacion || producto.nombre);
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
      >
        {/* Imagen del producto */}
        <div onClick={handlers.handleProductClick} className="cursor-pointer relative">
          <ProductImage
            src={images.currentImage}
            alt={producto.nombre || 'Producto'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="aspect-[4/5]"
          />

          {/* Badges sobre la imagen */}
          <ProductCardBadges
            destacado={producto.destacado}
            descuento={discount.descuento}
            precio3Cuotas={discount.precio3Cuotas}
          />
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Header (nombre y precio) - Minimalista */}
          <ProductCardHeader
            nombre={producto.nombre || ''}
            precioLista={producto.precioLista || null}
            precioTransfer={producto.precioTransfer || null}
            precioSinImp={producto.precioSinImp || null}
            onClick={handlers.handleProductClick}
          />

          {/* Cantidad de colores disponibles - Siempre mostrar, incluso si es 1 */}
          {!showSelectors && selection.availableColors.length > 0 && (
            <div className="mb-2">
              <span
                className="text-xs text-gray-500 underline cursor-pointer hover:text-gray-700 transition-colors"
                onClick={handleShowSelectors}
              >
                {selection.availableColors.length} {selection.availableColors.length === 1 ? 'color' : 'colores'}
              </span>
            </div>
          )}

          {/* Selectores (solo cuando showSelectors es true) - Con animación */}
          <AnimatePresence>
            {showSelectors && producto.variantes.length > 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className="overflow-visible mb-3"
              >
                <ProductCardSelectors
                  availableColors={selection.availableColors}
                  availableTalles={selection.availableTalles}
                  selectedColor={selection.selectedColor}
                  selectedTalle={selection.selectedTalle}
                  variants={producto.variantes}
                  variantStock={handlers.variantStock}
                  onColorChange={selection.setSelectedColor}
                  onTalleChange={selection.setSelectedTalle}
                  onVariantChange={handlers.handleVariantChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Acciones (carrito, cantidad, bordado) */}
          <ProductCardActions
            selectedVariant={selection.selectedVariant}
            cartQuantity={cart.cartQuantity}
            bordado={cart.bordado}
            isAddingToCart={cart.isAddingToCart}
            canActivateBordado={cart.canActivateBordado}
            itemsNeeded={cart.itemsNeeded}
            onAddToCart={handleAddToCartClick}
            onQuantityChange={cart.handleQuantityChange}
            onBordadoChange={cart.setBordado}
            showSelectors={showSelectors}
            onCloseSelectors={handleCancel}
            selectedColor={selection.selectedColor}
            selectedTalle={selection.selectedTalle}
            availableColors={selection.availableColors}
            availableTalles={selection.availableTalles}
            hasExplicitSelection={hasExplicitSelection}
          />
        </div>
      </motion.div>

      {/* Modal de confirmación mayorista */}
      <ConfirmModal
        isOpen={cart.wholesaleModal.isOpen}
        onClose={cart.wholesaleModal.closeModal}
        onConfirm={cart.wholesaleModal.options.onConfirm}
        loading={cart.wholesaleModal.loading}
        title={cart.wholesaleModal.options.title}
        message={cart.wholesaleModal.options.message}
        confirmText={cart.wholesaleModal.options.confirmText}
        cancelText={cart.wholesaleModal.options.cancelText}
      />
    </>
  );
};

export default ProductCardPublicado;
