"use client";
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
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
import QuantityControlsProductPage from './components/QuantityControlsProductPage';
import ProductResources from './components/ProductResources';
import ProductShowroomInfo from './components/ProductShowroomInfo';
import RelatedProducts from './components/RelatedProducts';
import ProductImageModal from './components/ProductImageModal';
import ProductLoadingState from './components/ProductLoadingState';
import ProductNotFound from './components/ProductNotFound';
import { useConfirmModal } from '@/app/components/hooks/useModal';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import BordadoSwitch from '@/app/components/product-card/components/BordadoSwitch';
// import ProductVariantBadge from './components/ProductVariantBadge';

const ProductDetailPageContent = () => {
    const router = useRouter();
    
    // Hook para modal de confirmación mayorista
    const { 
        isOpen: isWholesaleModalOpen, 
        loading: isWholesaleModalLoading, 
        modalOptions: wholesaleModalOptions, 
        showModal: showWholesaleModal, 
        closeModal: closeWholesaleModal, 
        handleConfirm: handleWholesaleConfirm 
    } = useConfirmModal();

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
    // IMPORTANTE: Usar groupedProduct.displayProduct.imagenes que contiene TODAS las imágenes
    // de todas las variantes agrupadas, no solo las de la variante seleccionada
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
        groupedProduct?.displayProduct.imagenes,
        groupedProduct?.displayProduct.imagen,
        5,
        productName,
        selectedColor,
        groupedProduct?.availableColors
    );

    // Callback para cuando se alcanza el límite mayorista
    const handleWholesaleLimitReached = () => {
        showWholesaleModal({
            title: 'Límite minorista alcanzado',
            message: 'Has alcanzado el límite de compra minorista (20 artículos). ¿Deseas continuar con tu compra en nuestro sistema mayorista?',
            type: 'warning',
            confirmText: 'Sí, ir a mayorista',
            cancelText: 'No, cancelar',
            onConfirm: async () => {
                router.push('/mayorista');
            }
        });
    };

    // Estado para bordado (por defecto false)
    const [bordado, setBordado] = React.useState(false);
    
    // Hook para manejar el carrito (debe llamarse siempre)
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
        handleWholesaleLimitReached,
        bordado
    );
    
    // Sincronizar estado de bordado con el carrito
    React.useEffect(() => {
        if (cartItem) {
            setBordado(cartItem.bordado || false);
        } else {
            setBordado(false);
        }
    }, [cartItem]);

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
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
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
                            selectedVariant={selectedVariant}
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

                        {/* Switch de Bordado */}
                        <div className="mt-4">
                            <BordadoSwitch
                                value={bordado}
                                onChange={(value) => {
                                    setBordado(value);
                                    handleBordadoChange(value);
                                }}
                                isMobile={false}
                                size="large"
                            />
                        </div>

                        {/* Controles de cantidad */}
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
};

const ProductDetailPage = () => {
    return (
        <Suspense fallback={<ProductLoadingState />}>
            <ProductDetailPageContent />
        </Suspense>
    );
};

export default ProductDetailPage;
