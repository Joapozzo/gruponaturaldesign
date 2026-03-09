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
    cardIndex: index,
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

  const isProductOutOfStock = !producto.tieneStock;

  // Este color agotado: el color actual (seleccionado o por defecto) no tiene stock en ningún talle
  const currentColor = selection.selectedColor ?? selection.selectedVariant?.color ?? null;
  const selectedColorOutOfStock = Boolean(
    currentColor &&
      producto.variantes
        .filter((v) => v.color === currentColor)
        .every((v) => v.stock === 0)
  );
  const showOutOfStockOverlay = isProductOutOfStock || selectedColorOutOfStock;

  // Solo deshabilitar acciones cuando la variante seleccionada no tiene stock (permite elegir otra)
  const selectedVariantOutOfStock = !selection.selectedVariant || selection.selectedVariant.stock === 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="relative h-full flex flex-col bg-white rounded-lg transition-all duration-300"
      >
        {/* Imagen del producto: overlay sobre toda el área (incl. badges); si agotado no mostramos badges */}
        <div onClick={handlers.handleProductClick} className="cursor-pointer relative flex-shrink-0">
          <ProductImage
            src={images.currentImage}
            alt={producto.nombre || 'Producto'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="aspect-square"
            priority={index < 4}
          />

          {/* Badges: ocultos cuando está agotado (overlay cubre toda la imagen) */}
          {!showOutOfStockOverlay && (
            <ProductCardBadges
              destacado={producto.destacado}
              descuento={discount.descuento}
              precio3Cuotas={discount.precio3Cuotas}
            />
          )}

          {/* Overlay Agotado sobre toda la imagen (por encima de todo) */}
          {showOutOfStockOverlay && (
            <div
              className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center rounded-t-lg pointer-events-none"
              aria-hidden
            >
              <span className="text-white font-bold text-lg uppercase tracking-wider drop-shadow-md">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Contenido: mismo alto en todas las cards (flex-1 + min-h); al desplegar selectores crece */}
        <div className="flex-1 flex flex-col min-h-[200px] p-4">
          {/* Header (nombre y precio) - Minimalista */}
          <ProductCardHeader
            nombre={producto.nombre || ''}
            precioLista={producto.precioLista || null}
            precioTransfer={producto.precioTransfer || null}
            precioSinImp={producto.precioSinImp || null}
            onClick={handlers.handleProductClick}
          />

          {/* Cantidad de colores/talles: mostrar si hay opciones y el producto tiene stock en alguna variante (permite elegir otra) */}
          {!showSelectors && !isProductOutOfStock && selection.availableColors.length > 0 && (
            <div className="mb-2">
              <span
                className="text-xs text-gray-500 underline cursor-pointer hover:text-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowSelectors();
                }}
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
                onClick={(e) => e.stopPropagation()}
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

          {/* Acciones (carrito, cantidad, bordado) - pegadas al fondo para altura uniforme */}
          <div className="mt-auto pt-2">
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
              productOutOfStock={selectedVariantOutOfStock}
            />
          </div>
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
