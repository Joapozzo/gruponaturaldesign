"use client";

import React, { Suspense, useMemo } from 'react';
import Section from '@/app/components/Section';
import { useProductDetail } from '@/app/hooks/useProductDetail';
import { useProductImages } from '@/app/hooks/useProductImages';
import { useProductVariants } from '@/app/hooks/useProductVariants';
import { useProductCart } from '@/app/hooks/useProductCart';
import { useBordado } from '@/app/hooks/useBordado';
import { useWholesaleModal } from '@/app/hooks/useWholesaleModal';
import { useRelatedProductsPrefetch } from '@/app/hooks/useRelatedProductsPrefetch';
import ProductHeader from '@/app/components/producto/ProductHeader';
import ProductImageGallery from '@/app/components/producto/ProductImageGallery';
import ProductInfo from '@/app/components/producto/ProductInfo';
import ProductVariantSelector from '@/app/components/producto/ProductVariantSelector';
import ProductSpecs from '@/app/components/producto/ProductSpecs';
import QuantityControlsProductPage from '@/app/components/producto/QuantityControlsProductPage';
import ProductResources from '@/app/components/producto/ProductResources';
import ProductShowroomInfo from '@/app/components/producto/ProductShowroomInfo';
import ProductImageModal from '@/app/components/producto/ProductImageModal';
import ProductNotFound from '@/app/components/producto/ProductNotFound';
import RelatedProducts from '@/app/components/producto/RelatedProducts';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import BordadoSwitch from '@/app/components/product-card/components/BordadoSwitch';
import type { ProductoDetailResponse } from '@/app/services/producto-detail.service';

// Skeletons específicos
import { ProductHeaderSkeleton } from '../skeleton/ProductHeaderSkeleton';
import { ProductImageGallerySkeleton } from '../skeleton/ProductImageGallerySkeleton';
import { ProductInfoSkeleton } from '../skeleton/ProductInfoSkeleton';
import { ProductVariantsSkeleton } from '../skeleton/ProductVariantsSkeleton';
import { RelatedProductsSkeleton } from '../skeleton/RelatedProductsSkeleton';
import ProductDetailSkeleton from './ProductDetailSkeleton';

interface ProductDetailPageContentProps {
  initialData: ProductoDetailResponse;
  slug?: string;
}

export default function ProductDetailPageContent({ 
  initialData, 
}: ProductDetailPageContentProps) {
  // Hook principal para cargar el producto (usa initialData)
  const { groupedProduct, relatedProducts, isLoading } = useProductDetail({
    initialData,
  });

  // Hook para modal de confirmación mayorista
  const { 
    isWholesaleModalOpen, 
    isWholesaleModalLoading, 
    wholesaleModalOptions, 
    showWholesaleModal, 
    closeWholesaleModal, 
    handleWholesaleConfirm 
  } = useWholesaleModal();

  // Memoizar productName para evitar recálculos innecesarios
  const productName = useMemo(
    () => groupedProduct?.skuBase || groupedProduct?.displayProduct?.NOMBRE || 'Sin nombre',
    [groupedProduct]
  );

  // Producto agotado: ninguna variante tiene stock
  const productOutOfStock = useMemo(
    () =>
      Boolean(
        groupedProduct?.variants?.length &&
          groupedProduct.variants.every((v) => (v.stock ?? 0) === 0)
      ),
    [groupedProduct]
  );

  // Hook para manejar variantes (debe llamarse siempre, incluso si no hay producto)
  const {
    selectedColor,
    selectedSize,
    selectedVariant,
    orderedAvailableSizes,
    handleColorSelect,
    handleSizeSelect,
  } = useProductVariants(groupedProduct);

  // Este color agotado: el color seleccionado no tiene stock en ningún talle
  const selectedColorOutOfStock = useMemo(
    () =>
      Boolean(
        selectedColor &&
          groupedProduct?.variants?.length &&
          groupedProduct.variants
            .filter((v) => v.color === selectedColor)
            .every((v) => (v.stock ?? 0) === 0)
      ),
    [groupedProduct, selectedColor]
  );
  const showOutOfStock = productOutOfStock || selectedColorOutOfStock;

  // Hook para manejar imágenes: usar SIEMPRE la variante seleccionada (no displayProduct)
  // Así al cambiar variante se ven solo sus imágenes; si no tiene img, no se muestra ninguna
  const {
    images,
    currentImageIndex,
    isImageModalOpen,
    modalImages,
    modalImageIndex,
    nextImage,
    prevImage,
    goToImage,
    openModal,
    closeModal,
  } = useProductImages(
    selectedVariant?.producto?.imagenes,
    selectedVariant?.producto?.imagen ?? null,
    5,
    productName,
    selectedColor,
    groupedProduct?.availableColors
  );
    
  // Ref para el getter de bordado (se actualizará después de que useBordado se inicialice)
  const bordadoRef = React.useRef<boolean>(false);
  
  // Hook para manejar el carrito (debe llamarse primero para obtener cartItem)
  const { 
    handleIncrement, 
    handleDecrement,
    handleBordadoChange,
    isAdding, 
    inCart, 
    currentQuantity,
    canAddMore, 
    maxReached,
    cartItem,
  } = useProductCart(
    groupedProduct,
    groupedProduct?.displayProduct,
    selectedVariant,
    showWholesaleModal,
    () => bordadoRef.current // Getter de bordado desde ref
  );

  // Hook para manejar bordado (reutilizable)
  // Usa cartItem y handleBordadoChange de useProductCart
  const {
    bordado,
    canActivateBordado,
    itemsNeeded,
    itemCount,
    handleBordadoToggle,
  } = useBordado({
    cartItem,
    handleBordadoChange,
  });

  // Sincronizar el ref con el valor de bordado del hook
  React.useEffect(() => {
    bordadoRef.current = bordado;
  }, [bordado]);

  // Prefetch productos relacionados cuando estén disponibles
  useRelatedProductsPrefetch(relatedProducts);

  // Estados de carga y error (después de todos los hooks)
  // IMPORTANTE: Verificar loading primero para mostrar skeleton
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // ProductNotFound solo cuando realmente no hay producto o variantes
  if (!groupedProduct || !groupedProduct.variants?.length) {
    return <ProductNotFound />;
  }

  // selectedVariant se setea en useEffect de useProductVariants; hasta entonces mostrar skeleton
  if (!selectedVariant) {
    return <ProductDetailSkeleton />;
  }

  // Obtener datos del producto
  const displayProduct = groupedProduct.displayProduct;

  return (
    <div className="min-h-screen bg-white">
      {/* Header con Suspense - mismo ancho que Section/Navbar */}
      <Suspense fallback={<ProductHeaderSkeleton />}>
        <ProductHeader
          groupedProduct={groupedProduct}
          displayProduct={displayProduct}
        />
      </Suspense>

      {/* Contenido principal - mismo ancho que page.tsx y Navbar (px-4 lg:px-15) */}
      <Section
        id="product-content"
        className="pt-2 sm:pt-4 pb-6 sm:pb-8"
        contentClassName="w-full px-4 lg:px-15"
        noPadding
      >
        {/* Grid 50% galería | 50% info, pegados con separación */}
        <div className="grid lg:grid-cols-2 lg:gap-6 xl:gap-8 gap-4 sm:gap-6 mb-6 sm:mb-8 items-start" style={{ overflow: 'visible' }}>
          {/* Columna izquierda: Galería 50% ancho, entra en 100vh */}
          <div className="lg:min-h-[calc(100vh-12rem)] lg:flex lg:flex-col relative">
            <Suspense fallback={<ProductImageGallerySkeleton />}>
              <ProductImageGallery
                product={selectedVariant.producto}
                productName={productName}
                images={images}
                currentImageIndex={currentImageIndex}
                onImageChange={goToImage}
                onNext={nextImage}
                onPrev={prevImage}
                onOpenModal={openModal}
                isOutOfStock={showOutOfStock}
              />
            </Suspense>
            {/* Código y Categoría debajo de las imágenes */}
            <div className="mt-3 w-full">
              <div className="flex flex-col sm:flex-row gap-0">
                {images.length > 1 && (
                  <div className="hidden sm:block w-20 mr-4 flex-shrink-0" />
                )}
                <div className="flex-1 w-full">
                  <ProductSpecs
                    selectedVariant={selectedVariant}
                    displayProduct={displayProduct}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información del producto 50%, pegada a la img con separación */}
          <div className="space-y-5 sm:space-y-6 lg:pt-0" style={{ overflow: 'visible' }}>
            {/* Nombre del producto */}
            <div className="mb-2 sm:mb-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-display tracking-tight leading-tight">
                {productName}
              </h1>
            </div>
            
            {/* Información del producto con Suspense */}
            <Suspense fallback={<ProductInfoSkeleton />}>
              <ProductInfo
                productName={productName}
                displayProduct={displayProduct}
                selectedVariant={selectedVariant}
                price={selectedVariant.producto.PrecioVenta}
                hideTitle
              />
            </Suspense>

            {/* Sección de personalización: Bordado, Color y Talle */}
            <div className="mt-4 space-y-4" style={{ overflow: 'visible' }}>
              {/* Switch de Bordado - más grande */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-start">
                  <BordadoSwitch
                    value={bordado}
                    onChange={handleBordadoToggle}
                    isMobile={false}
                    size="large"
                    disabled={!canActivateBordado || showOutOfStock}
                  />
                </div>
                {!canActivateBordado && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                    <p className="text-xs text-red-700 font-semibold">
                      {itemsNeeded > 0 
                        ? `Agrega ${itemsNeeded} ${itemsNeeded === 1 ? 'prenda más' : 'prendas más'} al carrito para activar el bordado (${itemCount}/5)`
                        : `Mínimo 5 prendas para activar bordado (${itemCount}/5)`
                      }
                    </p>
                  </div>
                )}
                {canActivateBordado && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg p-2.5">
                    <p className="text-xs text-red-700 font-bold flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Puedes bordar tu logo en todas las prendas</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Selectores de Color y Talle con Suspense */}
              <Suspense fallback={<ProductVariantsSkeleton />}>
                <ProductVariantSelector
                  groupedProduct={groupedProduct}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  availableSizes={orderedAvailableSizes}
                  onColorSelect={handleColorSelect}
                  onSizeSelect={handleSizeSelect}
                />
              </Suspense>
            </div>

            {/* Controles de cantidad */}
            <div className="mt-5 sm:px-0">
              <QuantityControlsProductPage
                currentQuantity={currentQuantity}
                isAdding={isAdding}
                isInCart={inCart}
                canAddMore={canAddMore}
                maxReached={maxReached}
                maxReachedStock={!canAddMore && !maxReached}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                disabled={selectedVariant?.producto?._isVirtual === true || showOutOfStock}
                outOfStock={(selectedVariant?.stock ?? 0) === 0 || showOutOfStock}
              />
            </div>

            {/* Enlaces a recursos externos */}
            <div className="mt-5">
              <ProductResources product={selectedVariant.producto} />
            </div>

            {/* Información adicional - showroom */}
            <div className="mt-5">
              <ProductShowroomInfo />
            </div>
          </div>
        </div>

        {/* Productos relacionados con Suspense */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts relatedProducts={relatedProducts} />
        </Suspense>
      </Section>

      {/* Modal de imagen expandida */}
      <ProductImageModal
        isOpen={isImageModalOpen}
        onClose={closeModal}
        images={modalImages}
        currentImageIndex={modalImageIndex}
        productName={productName}
        onNext={nextImage}
        onPrev={prevImage}
      />

      {/* Modal de confirmación mayorista */}
      <ConfirmModal
        isOpen={isWholesaleModalOpen}
        onClose={closeWholesaleModal}
        onConfirm={handleWholesaleConfirm}
        loading={isWholesaleModalLoading}
        {...wholesaleModalOptions}
      />
    </div>
  );
}

