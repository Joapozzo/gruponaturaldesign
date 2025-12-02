"use client";
import React from 'react';
import Section from '@/app/components/Section';
import { useProductDetail } from './hooks/useProductDetail';
import { useProductImages } from './hooks/useProductImages';
import { useProductVariants } from './hooks/useProductVariants';
import { useProductCart } from './hooks/useProductCart';
import ProductHeader from './components/ProductHeader';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductVariantSelector from './components/ProductVariantSelector';
import ProductSpecs from './components/ProductSpecs';
import ProductAddToCart from './components/ProductAddToCart';
import ProductResources from './components/ProductResources';
import ProductShowroomInfo from './components/ProductShowroomInfo';
import RelatedProducts from './components/RelatedProducts';
import ProductImageModal from './components/ProductImageModal';
import ProductLoadingState from './components/ProductLoadingState';
import ProductNotFound from './components/ProductNotFound';
// import ProductVariantBadge from './components/ProductVariantBadge';

const ProductDetailPage = () => {
    // Hook principal para cargar el producto
    const { groupedProduct, relatedProducts, isLoading } = useProductDetail();

    // Calcular productName antes de usarlo en los hooks
    const productName = groupedProduct?.skuBase || groupedProduct?.displayProduct?.NOMBRE || 'Sin nombre';

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
        nextImage,
        prevImage,
        goToImage,
        openModal,
        closeModal,
    } = useProductImages(
        selectedVariant?.producto.imagenes,
        selectedVariant?.producto.imagen,
        5,
        productName,
        selectedColor,
        groupedProduct?.availableColors
    );

    // Hook para manejar el carrito (debe llamarse siempre)
    const { handleAddToCart, isAdding, inCart } = useProductCart(
        groupedProduct,
        groupedProduct?.displayProduct,
        selectedVariant
    );

    // Estados de carga y error (después de todos los hooks)
    if (isLoading) {
        return <ProductLoadingState />;
    }

    if (!groupedProduct || !groupedProduct.variants.length || !selectedVariant) {
        return <ProductNotFound />;
    }

    // Obtener datos del producto
    const displayProduct = groupedProduct.displayProduct;

    return (
        <div className="min-h-screen bg-white px-3 sm:px-4">
            {/* Header */}
            <ProductHeader
                groupedProduct={groupedProduct}
                displayProduct={displayProduct}
            />

            {/* Contenido principal */}
            <Section
                id="product-content"
                className="py-4 sm:py-6 lg:py-8"
                contentClassName="max-w-7xl mx-auto"
                noPadding
            >
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
                    {/* Galería de imágenes */}
                    <div>
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

                        {/* Badge de selección actual */}
                        {/* <ProductVariantBadge
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            selectedVariant={selectedVariant}
                        /> */}
                    </div>

                    {/* Información del producto */}
                    <div>
                        <ProductInfo
                            productName={productName}
                            displayProduct={displayProduct}
                            price={selectedVariant.producto.PrecioVenta}
                        />

                        {/* Selectores de Color y Talle */}
                        <ProductVariantSelector
                            groupedProduct={groupedProduct}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            availableSizes={orderedAvailableSizes}
                            onColorSelect={handleColorSelect}
                            onSizeSelect={handleSizeSelect}
                        />

                        {/* Especificaciones */}
                        <ProductSpecs
                            selectedVariant={selectedVariant}
                            displayProduct={displayProduct}
                        />

                        {/* Botón agregar al carrito */}
                        <ProductAddToCart
                            onAddToCart={handleAddToCart}
                            isAdding={isAdding}
                            isInCart={inCart}
                        />

                        {/* Enlaces a recursos externos */}
                        <ProductResources product={selectedVariant.producto} />

                        {/* Información adicional */}
                        <ProductShowroomInfo />
                    </div>
                </div>

                {/* Productos relacionados */}
                <RelatedProducts relatedProducts={relatedProducts} />
            </Section>

            {/* Modal de imagen expandida */}
            <ProductImageModal
                isOpen={isImageModalOpen}
                onClose={closeModal}
                images={images}
                currentImageIndex={currentImageIndex}
                productName={productName}
            />
        </div>
    );
};

export default ProductDetailPage;
