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

  // Hook para manejar variantes (debe llamarse siempre, incluso si no hay producto)
  const {
    selectedColor,
    selectedSize,
    selectedVariant,
    orderedAvailableSizes,
    handleColorSelect,
    handleSizeSelect,
  } = useProductVariants(groupedProduct);

  // Hook para manejar imágenes (debe llamarse siempre)
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
    groupedProduct?.displayProduct.imagenes,
    groupedProduct?.displayProduct.imagen,
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

  // Solo mostrar ProductNotFound si no está cargando y no hay producto
  if (!groupedProduct || !groupedProduct.variants.length || !selectedVariant) {
    return <ProductNotFound />;
  }

  // Obtener datos del producto
  const displayProduct = groupedProduct.displayProduct;

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 md:px-8 lg:px-12">
      {/* Header con Suspense */}
      <Suspense fallback={<ProductHeaderSkeleton />}>
        <ProductHeader
          groupedProduct={groupedProduct}
          displayProduct={displayProduct}
        />
      </Suspense>

      {/* Contenido principal */}
      <Section
        id="product-content"
        className="pt-2 sm:pt-4 pb-4 sm:pb-6"
        contentClassName="max-w-[1600px] mx-auto"
        noPadding
      >
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8" style={{ overflow: 'visible' }}>
          {/* Galería de imágenes con Suspense */}
          <div className="flex flex-col">
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
              />
            </Suspense>
            
            {/* Código y Categoría debajo de las imágenes */}
            <div className="mt-3 w-full max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-0">
                {groupedProduct.displayProduct.imagenes && groupedProduct.displayProduct.imagenes.length > 1 && (
                  <div className="hidden sm:block w-20 mr-4 flex-shrink-0"></div>
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

          {/* Información del producto */}
          <div className="space-y-4 sm:space-y-6" style={{ overflow: 'visible' }}>
            {/* Nombre del producto */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 font-display leading-tight">
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
            <div className="mt-4 space-y-3" style={{ overflow: 'visible', padding: '4px' }}>
              {/* Switch de Bordado */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-start">
                  <BordadoSwitch
                    value={bordado}
                    onChange={handleBordadoToggle}
                    isMobile={false}
                    size="small"
                    disabled={!canActivateBordado}
                  />
                </div>
                {!canActivateBordado && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-1.5">
                    <p className="text-[10px] text-red-700 font-semibold">
                      {itemsNeeded > 0 
                        ? `Agrega ${itemsNeeded} ${itemsNeeded === 1 ? 'prenda más' : 'prendas más'} al carrito para activar el bordado (${itemCount}/5)`
                        : `Mínimo 5 prendas para activar bordado (${itemCount}/5)`
                      }
                    </p>
                  </div>
                )}
                {canActivateBordado && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-md p-1.5">
                    <p className="text-[10px] text-red-700 font-bold flex items-center gap-1">
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
            <div className="mt-4 px-1 sm:px-0">
              <QuantityControlsProductPage
                currentQuantity={currentQuantity}
                isAdding={isAdding}
                isInCart={inCart}
                canAddMore={canAddMore}
                maxReached={maxReached}
                maxReachedStock={!canAddMore && !maxReached}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                disabled={selectedVariant?.producto?._isVirtual === true}
              />
            </div>

            {/* Enlaces a recursos externos */}
            <div className="mt-4">
              <ProductResources product={selectedVariant.producto} />
            </div>

            {/* Información adicional */}
            <div className="mt-4">
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

