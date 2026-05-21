'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GroupedProduct } from '../types/producto';
import { useCart } from './hooks/useCart';
import { useProductCardState } from './product-card/hooks/useProductCardState';
import { useProductCardImage } from './product-card/hooks/useProductCardImage';
import { ProductCardImage } from './product-card/components/ProductCardImage';
import ColorSelector from './product-card/components/ColorSelector';
import SizeSelector from './product-card/components/SizeSelector';
import VariantSelector from './product-card/components/VariantSelector';
import QuantityControls from './product-card/components/QuantityControls';
import BordadoSwitch from './product-card/components/BordadoSwitch';
import { canAddQuantity, getStockMessage } from '@/app/services/stockService';
import { useEmpresaPrecioConfig } from '@/app/hooks/useEmpresaPrecioConfig';
import { useConfirmModal } from './hooks/useModal';
import ConfirmModal from './modal/ConfirmModal';

interface ProductCardGroupedProps {
    group: GroupedProduct;
    index: number;
    expandedSku?: string | null;
    onExpandChange?: (sku: string | null) => void;
    compact?: boolean;
}

const ProductCardGrouped: React.FC<ProductCardGroupedProps> = ({
    group,
    index,
    expandedSku,
    onExpandChange,
    compact = false,
}) => {
    const router = useRouter();
    const { addToCart, updateQuantity, getProductQuantity, canAddToCart, updateBordado, items, itemCount } = useCart();
    
    // Validar si se puede activar bordado (mínimo 5 prendas)
    const canActivateBordado = itemCount >= 5;
    const itemsNeeded = Math.max(0, 5 - itemCount);
    
    // Estado para bordado (por defecto false)
    const [bordado, setBordado] = React.useState(false);

    // Hook para modal de confirmación mayorista
    const { 
        isOpen: isWholesaleModalOpen, 
        loading: isWholesaleModalLoading, 
        modalOptions: wholesaleModalOptions, 
        showModal: showWholesaleModal, 
        closeModal: closeWholesaleModal, 
        handleConfirm: handleWholesaleConfirm 
    } = useConfirmModal();

    // Hook para manejar el estado del card
    const {
        isHovered,
        isMobile,
        isAdding,
        setIsAdding,
        isExpanded,
        selectedVariant,
        selectedColor,
        selectedSize,
        hasColorSizeData,
        availableSizes,
        handleToggleExpand,
        handleVariantSelect,
        handleColorSelect,
        handleSizeSelect,
        handleMouseEnter,
        handleMouseLeave,
    } = useProductCardState({ group, expandedSku, onExpandChange });

    const { data: precioConfig } = useEmpresaPrecioConfig();
    const cuotas = precioConfig?.cuotasFinanciado ?? 3;
    const cuotasLabel = `${cuotas} ${cuotas === 1 ? 'cuota de' : 'cuotas de'}`;

    // Usar la variante seleccionada para mostrar
    const product = selectedVariant.producto;
    const productName = product.NOMBRE || group.skuBase || product.Descripcion || '';
    
    // Obtener stock de la variante seleccionada
    const stock = selectedVariant.stock;
    
    // Hook para manejar imágenes
    const { mainImage, hasValidImage, handleImageError, setHasValidImage } = useProductCardImage({
        product,
        productName,
        selectedColor,
        availableColors: group.availableColors,
    });

    // Helper para crear ID único desde código de producto
    const createProductId = (codigo: string): number => {
        let hash = 0;
        for (let i = 0; i < codigo.length; i++) {
            const char = codigo.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const selectedVariantId = createProductId(selectedVariant.codigo);

    // Crear especificaciones de la variante actual
    const getCurrentSpecs = (): string => {
        if (hasColorSizeData && selectedVariant.color && selectedVariant.talle) {
            return `Color: ${selectedVariant.color} | Talle: ${selectedVariant.talle} | Código: ${selectedVariant.codigo}`;
        }
        return `Código: ${selectedVariant.codigo}`;
    };

    // Verificar si la variante exacta (mismo color y talle) está en el carrito
    const currentSpecs = getCurrentSpecs();
    // Buscar el item en el carrito que coincida con id y especificaciones
    const cartItem = React.useMemo(() => {
        return items.find(item => 
            item.product.id === selectedVariantId && 
            item.especificaciones === currentSpecs
        );
    }, [items, selectedVariantId, currentSpecs]);
    const isExactVariantInCart = !!cartItem;
    
    // Sincronizar estado de bordado con el carrito si el item ya existe
    React.useEffect(() => {
        if (cartItem) {
            setBordado(cartItem.bordado || false);
        } else {
            setBordado(false);
        }
    }, [cartItem]);

    // Desactivar bordado automáticamente si el carrito baja de 5 prendas
    React.useEffect(() => {
        if (itemCount < 5 && bordado) {
            setBordado(false);
            // Si el item ya está en el carrito, actualizar el bordado
            if (cartItem && cartItem.especificaciones === currentSpecs) {
                updateBordado(selectedVariantId, false);
            }
        }
    }, [itemCount, bordado, cartItem, currentSpecs, selectedVariantId, updateBordado]);
    
    // Obtener cantidad actual del producto en el carrito
    // Si tiene especificaciones, solo contar la variante exacta
    let currentQuantity = 0;
    if (cartItem && cartItem.especificaciones === currentSpecs) {
        currentQuantity = cartItem.quantity;
    } else if (!hasColorSizeData) {
        // Si no tiene especificaciones, usar la cantidad del producto genérico
        currentQuantity = getProductQuantity(selectedVariantId);
    }
    
    // Validar límite de 20 artículos totales
    const quantityValidation = canAddToCart(selectedVariantId, 1);
    const canAddMoreByLimit = quantityValidation.canAdd;
    
    // Validar stock disponible (lógica separada y delicada)
    const canAddMoreByStock = canAddQuantity(stock, currentQuantity, 1);
    
    // Se puede agregar más solo si cumple ambos: límite de 20 Y stock disponible
    const canAddMore = canAddMoreByLimit && canAddMoreByStock;
    const maxReached = !canAddMore;
    
    // Obtener información de stock (sin revelar el número exacto)
    const stockMessage = getStockMessage(stock);

    // Función para generar slug desde nombre
    const nombreToSlug = (nombre: string): string => {
        return nombre
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleProductClick = () => {
        const slug = group.skuBaseSlug || nombreToSlug(group.skuBase);
        router.push(`/producto/${slug}`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        const slug = group.skuBaseSlug || nombreToSlug(group.skuBase);
        router.push(`/producto/${slug}`);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Si hay múltiples opciones y no se ha mostrado el selector, mostrarlo
        if (group.totalVariants > 1 && !isExpanded) {
            if (onExpandChange) {
                onExpandChange(group.skuBase);
            }
            return;
        }

        // Validar que color y talle estén seleccionados cuando hay datos de color/talle
        if (hasColorSizeData) {
            if (!selectedColor || !selectedSize) {
                if (onExpandChange) {
                    onExpandChange(group.skuBase);
                }
                return;
            }
        }

        // Validar límite de 20 artículos totales
        const validation = canAddToCart(selectedVariantId, 1);
        if (!validation.canAdd) {
            // Mostrar modal de confirmación para ir a mayorista
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
            return;
        }
        
        // Validar stock disponible (lógica separada y delicada)
        if (!canAddQuantity(stock, currentQuantity, 1)) {
            toast.error('No hay más unidades disponibles de este producto', {
                duration: 4000,
            });
            return;
        }

        setIsAdding(true);

        // Crear especificaciones según si tiene data de color/talle
        const specs = hasColorSizeData && selectedVariant.color && selectedVariant.talle
            ? `Color: ${selectedVariant.color} | Talle: ${selectedVariant.talle} | Código: ${selectedVariant.codigo}`
            : `Código: ${selectedVariant.codigo}`;

        const nombreToSlug = (nombre: string): string => {
            return nombre
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        // Si ya está en el carrito, incrementar cantidad
        if (currentQuantity > 0) {
            updateQuantity(selectedVariantId, currentQuantity + 1);
            setIsAdding(false);
            // No cerrar el producto cuando ya está en el carrito
        } else {
            // Si no está en el carrito, agregarlo
            // Asegurar que el precio sea un número válido
            const precio = product.PrecioVenta 
                ? (typeof product.PrecioVenta === 'number' ? product.PrecioVenta : parseFloat(String(product.PrecioVenta).replace(/[^0-9.-]+/g, '')) || 0)
                : 0;
            
            addToCart(
                {
                    id: selectedVariantId,
                    productoWebId: selectedVariant.productoWebId,
                    productoPadreId: selectedVariant.productoPadreId,
                    sfactoryItemId: selectedVariant.sfactoryItemId,
                    codigo: selectedVariant.codigo,
                    nombre: group.skuBase || product.Descripcion || product.NOMBRE || 'Sin descripción',
                    descripcion: product.DescripcionCorta || product.Descripcion || '',
                    imagen: mainImage || '',
                    precio: precio, // Mantener por compatibilidad
                    precioLista: precio, // Precio base (lista)
                    precioTransfer: product.precioTransfer || null,
                    precioSinImp: product.precioSImp || null,
                    categoria: product.Rubro || 'Sin categoría',
                    stock: stock, // Pasar stock al carrito para validaciones
                    skuBaseSlug: group.skuBaseSlug || nombreToSlug(group.skuBase),
                },
                1,
                specs,
                bordado
            );

            // Animación de feedback - NO cerrar el producto, mantenerlo abierto
            setTimeout(() => {
                setIsAdding(false);
            }, 1000);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (currentQuantity <= 1) {
            return;
        }

        // Decrementar cantidad
        updateQuantity(selectedVariantId, currentQuantity - 1);
    };

    // Formatear precios
    const formattedPrice = product.PrecioVenta
        ? `$${product.PrecioVenta.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : 'Consultar';
    
    // Obtener precios desde la variante o el producto display (fallback como en ProductInfo)
    const precioTransfer = selectedVariant?.producto?.precioTransfer || group.displayProduct?.precioTransfer;
    const precio3cuotas = selectedVariant?.producto?.precio3cuotas || group.displayProduct?.precio3cuotas;
    const precioSImp = selectedVariant?.producto?.precioSImp || group.displayProduct?.precioSImp;

    const formattedTransfer = precioTransfer
        ? `$${precioTransfer.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formatted3Cuotas = precio3cuotas
        ? `$${precio3cuotas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;
    
    const formattedSImp = precioSImp
        ? `$${precioSImp.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
        : null;

    return (
        <motion.div
            initial={!isMobile ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={!isMobile ? { duration: 0.6, delay: index * 0.1 } : { duration: 0 }}
            viewport={{ once: true }}
            className={`group relative bg-white rounded-lg shadow-md transition-all duration-500 h-auto flex flex-col self-start ${
                !isMobile
                    ? `w-full mb-3 hover:shadow-xl ${compact ? 'hover:scale-[1.01]' : 'hover:scale-[1.02]'} hover:-translate-y-1`
                    : 'w-full mb-5'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Imagen del producto - Full width sin padding */}
            <div className="w-full">
                <ProductCardImage
                    product={product}
                    mainImage={mainImage}
                    hasValidImage={hasValidImage}
                    isHovered={isHovered}
                    isMobile={isMobile}
                    onImageError={handleImageError}
                    onImageLoad={() => setHasValidImage(true)}
                    onClick={handleProductClick}
                    onQuickView={handleQuickView}
                    stockMessage={stockMessage || undefined}
                />
            </div>

            {/* Información del producto */}
            <motion.div
                className={`flex flex-col gap-0.5 flex-1 ${
                    isMobile ? 'p-4' : compact ? 'p-3' : 'p-4'
                }`}
                animate={!isMobile ? { backgroundColor: isHovered ? '#f9fafb' : '#ffffff' } : {}}
                transition={{ duration: 0.4 }}
            >
                {/* Nombre del producto */}
                <motion.h3
                    className={`font-semibold text-gray-900 transition-colors line-clamp-2 ${
                        isMobile 
                            ? 'text-xs mb-1' 
                            : compact 
                                ? 'text-[11px] mb-0.5' 
                                : 'text-xs mb-0.5'
                    }`}
                    animate={!isMobile ? { color: isHovered ? '#111827' : '#1f2937', scale: isHovered ? 1.02 : 1 } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {product.NOMBRE || product.Descripcion || 'Sin descripción'}
                </motion.h3>

                {/* Selector de opciones - Estilo E-commerce */}
                {group.totalVariants > 1 && (
                    <div className="space-y-1">
                        {hasColorSizeData ? (
                            <>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-1.5 sm:space-y-2 overflow-visible"
                                        >
                                            {/* Selector de Colores */}
                                            {group.availableColors && group.availableColors.length > 0 && (
                                                <ColorSelector
                                                    colors={group.availableColors}
                                                    variants={group.variants}
                                                    selectedColor={selectedColor}
                                                    isMobile={isMobile}
                                                    onColorSelect={(color, e) => {
                                                        if (e) {
                                                            handleColorSelect(color, e);
                                                        } else {
                                                            // Crear un evento sintético si no se proporciona
                                                            const syntheticEvent = {
                                                                stopPropagation: () => {},
                                                                preventDefault: () => {},
                                                            } as React.MouseEvent;
                                                            handleColorSelect(color, syntheticEvent);
                                                        }
                                                    }}
                                                />
                                            )}

                                            {/* Selector de Talles */}
                                            {selectedColor && availableSizes.length > 0 && (
                                                <>
                                                    <SizeSelector
                                                        sizes={availableSizes}
                                                        selectedSize={selectedSize}
                                                        isMobile={isMobile}
                                                        onSizeSelect={handleSizeSelect}
                                                    />
                                                    {/* Switch de Bordado - Solo cuando se despliegan los talles */}
                                                    <div className="mt-1">
                                                        <div className="flex flex-col gap-0.5">
                                                            <BordadoSwitch
                                                                value={bordado}
                                                                onChange={(value) => {
                                                                    if (canActivateBordado) {
                                                                        setBordado(value);
                                                                        // Si el item ya está en el carrito, actualizar el bordado
                                                                        if (cartItem && cartItem.especificaciones === currentSpecs) {
                                                                            updateBordado(selectedVariantId, value);
                                                                        }
                                                                    }
                                                                }}
                                                                isMobile={isMobile}
                                                                disabled={!canActivateBordado}
                                                            />
                                                            {!canActivateBordado && (
                                                                <p className={`text-[9px] text-red-600 font-medium ${isMobile ? 'text-[8px]' : ''}`}>
                                                                    {itemsNeeded > 0 
                                                                        ? `${itemsNeeded} ${itemsNeeded === 1 ? 'prenda más' : 'prendas más'} para bordado (${itemCount}/5)`
                                                                        : `Mínimo 5 prendas (${itemCount}/5)`
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <VariantSelector
                                variants={group.variants}
                                selectedVariant={selectedVariant}
                                isExpanded={isExpanded}
                                onVariantSelect={handleVariantSelect}
                                onToggleExpand={handleToggleExpand}
                            />
                        )}
                    </div>
                )}

                {/* Precio */}
                <div className={`flex flex-col ${isMobile ? 'w-full' : ''}`}>
                    <div className="flex flex-col">
                        {/* Precio lista */}
                        <span
                            className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : compact ? 'text-xs' : 'text-sm'}`}
                        >
                            {formattedPrice}
                        </span>
                        {/* Precio transfer - abajo */}
                        {formattedTransfer && (
                            <span className={`text-gray-700 mt-0.5 ${isMobile ? 'text-[10px]' : compact ? 'text-[9px]' : 'text-[10px]'}`}>
                                Transfer: {formattedTransfer}
                            </span>
                        )}
                        {/* Precio cuotas - abajo */}
                        {formatted3Cuotas && (
                            <span className={`text-gray-700 mt-0.5 ${isMobile ? 'text-[10px]' : compact ? 'text-[9px]' : 'text-[10px]'}`}>
                                {cuotasLabel} {formatted3Cuotas}
                            </span>
                        )}
                    </div>
                </div>

                {/* Precio sin impuestos y botón - al final */}
                <div className={`flex items-center justify-between gap-2 mt-1 ${
                    isMobile ? 'flex-col items-stretch pt-2 pb-0' : 'flex-row pt-1'
                }`}>
                    {/* Precio sin impuestos */}
                    {formattedSImp && (
                        <span className={`text-gray-500 ${isMobile ? 'text-[9px]' : compact ? 'text-[8px]' : 'text-[9px]'}`}>
                            Sin imp: {formattedSImp}
                        </span>
                    )}
                    {!formattedSImp && <div></div>}
                    
                    {/* Botón de agregar */}
                    <QuantityControls
                        productId={selectedVariantId}
                        currentQuantity={currentQuantity}
                        isAdding={isAdding}
                        isExactVariantInCart={isExactVariantInCart}
                        hasColorSizeData={hasColorSizeData || false}
                        isExpanded={isExpanded}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        totalVariants={group.totalVariants}
                        isMobile={isMobile}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        canAddMore={canAddMore}
                        maxReached={maxReached}
                    />
                </div>
            </motion.div>

            {/* Efecto de brillo en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                    animate={{
                        x: isHovered ? ['0%', '100%'] : '-100%',
                        opacity: isHovered ? [0, 0.8, 0] : 0,
                    }}
                    transition={{
                        duration: isHovered ? 0.8 : 0,
                        ease: 'easeInOut',
                        delay: isHovered ? 0.1 : 0,
                    }}
                />
            )}

            {/* Borde sutil en hover - Solo desktop */}
            {!isMobile && (
                <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-gray-200 pointer-events-none"
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        borderColor: isHovered ? '#e5e7eb' : 'transparent',
                    }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Modal de confirmación mayorista */}
            <ConfirmModal
                isOpen={isWholesaleModalOpen}
                onClose={closeWholesaleModal}
                onConfirm={handleWholesaleConfirm}
                loading={isWholesaleModalLoading}
                {...wholesaleModalOptions}
            />
        </motion.div>
    );
};

export default ProductCardGrouped;
