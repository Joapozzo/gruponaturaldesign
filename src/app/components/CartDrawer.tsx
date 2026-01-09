'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from './hooks/useCart';
import Button from './ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import ConfirmModal from './modal/ConfirmModal';
import { useConfirmModal } from './hooks/useModal';
import CartItem from './CardItem';
import EmptyCart from './CardEmpty';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isInCheckout = pathname?.startsWith('/checkout');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const {
        items,
        itemCount,
        subtotal,
        iva,
        total,
        isEmpty,
        updateQuantity: originalUpdateQuantity,
        updateBordado,
        removeFromCart,
        clearCart,
        canAddToCart,
    } = useCart();
    const { isOpen: isConfirmModalOpen, loading, modalOptions, showModal, closeModal, handleConfirm } = useConfirmModal();

    // Cerrar automáticamente si estamos en checkout
    React.useEffect(() => {
        if (isInCheckout && isOpen) {
            onClose();
        }
    }, [isInCheckout, isOpen, onClose]);

    // Desactivar bordado automáticamente si el carrito baja de 5 prendas
    React.useEffect(() => {
        if (itemCount < 5 && items.length > 0) {
            // Buscar todos los items con bordado activado y desactivarlos
            const itemsWithBordado = items.filter((item) => item.bordado === true);
            if (itemsWithBordado.length > 0) {
                itemsWithBordado.forEach((item) => {
                    updateBordado(item.product.id, false);
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemCount]); // Solo escuchar itemCount para evitar loops infinitos

    // Ordenar items por categoría para agrupar productos del mismo tipo
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const categoriaA = a.product.categoria || 'Sin categoría';
            const categoriaB = b.product.categoria || 'Sin categoría';
            
            // Ordenar alfabéticamente por categoría
            return categoriaA.localeCompare(categoriaB, 'es', { sensitivity: 'base' });
        });
    }, [items]);

    const handleGoToCart = () => {
        // Si tiene 20+ artículos, impedir checkout minorista
        if (itemCount >= 20) {
            // No hacer nada, el botón de mayorista ya está visible
            return;
        }
        onClose();
        if (!isInCheckout) {
            router.push('/checkout');
        }
    };

    const handleClearCart = () => {
        showModal({
            title: 'Vaciar Carrito',
            message: '¿Estás seguro de eliminar todos los productos del carrito?',
            type: 'warning',
            confirmText: 'Sí, vaciar',
            cancelText: 'No, mantener',
            onConfirm: async () => {
                // Tu lógica aquí
                clearCart();
                // Puede ser async
                // await deleteFromAPI();
            }
        });
    };

    // Wrapper para updateQuantity - valida límite de 20 artículos totales
    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            originalUpdateQuantity(productId, 1);
            return;
        }

        // Calcular la diferencia de cantidad
        const existingItem = items.find(item => item.product.id === productId);
        const currentQuantity = existingItem?.quantity || 0;
        const quantityDifference = newQuantity - currentQuantity;

        // Validar si se puede agregar más unidades
        if (quantityDifference > 0) {
            const validation = canAddToCart(productId, quantityDifference);
            if (!validation.canAdd) {
                // Mostrar modal de confirmación para ir a mayorista
                showModal({
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
        }

        originalUpdateQuantity(productId, newQuantity);
    };

    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm w-screen h-screen"
                        style={{ zIndex: 99999 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden"
                        style={{ zIndex: 100000 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <motion.div
                                    className="w-7 h-7 bg-black rounded-lg flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ShoppingCart className="w-4 h-4 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-sm font-bold text-black tracking-wide">
                                        MI CARRITO
                                    </h2>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Cerrar carrito"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-0">
                            {isEmpty ? (
                                <EmptyCart onClose={onClose} />
                            ) : (
                                <div className="space-y-2">
                                    {sortedItems.map((item) => {
                                        // Verificar si se puede agregar más unidades de este producto
                                        const canAddMore = canAddToCart(item.product.id, 1).canAdd;
                                        return (
                                            <CartItem
                                                key={item.product.id}
                                                item={item}
                                                onUpdateQuantity={isInCheckout ? () => {} : updateQuantity}
                                                onRemove={isInCheckout ? () => {} : removeFromCart}
                                                onUpdateBordado={isInCheckout ? undefined : updateBordado}
                                                canAddMore={canAddMore}
                                                totalItemsInCart={itemCount}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {!isEmpty && (
                            <div className="border-t border-gray-200 p-3 space-y-2 bg-white shadow-lg flex-shrink-0">

                                {/* Mensaje informativo de bordado */}
                                {itemCount >= 5 && (
                                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg p-2.5 mb-2 shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-red-600 text-sm">✨</span>
                                            <p className="text-[11px] text-red-700 font-bold tracking-wide">
                                                Con {itemCount} prendas puedes bordar tu logo
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Resumen de precios */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-gray-500 text-xs">
                                        <span>Subtotal sin impuestos</span>
                                        <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-gray-300">
                                        <span className="tracking-wide">TOTAL</span>
                                        <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {/* Alerta Mayorista centralizada - Si tiene 20+ artículos */}
                                {itemCount >= 20 && (
                                    <div className="bg-gradient-to-r from-[#Ed3237] to-red-700 text-white p-2 rounded border border-[#Ed3237]">
                                        <div className="flex items-start gap-1.5 mb-2">
                                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xs mb-0.5">🏢 COMPRA MAYORISTA</h3>
                                                <p className="text-[10px] text-white/95 leading-relaxed mb-2">
                                                    Tu pedido de {itemCount} unidades requiere compra mayorista. Las compras mayoristas deben realizarse directamente a través de nuestro sistema mayorista.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de acción */}
                                <div className="space-y-2">
                                    {itemCount >= 20 ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/mayorista');
                                                }}
                                                className="w-full bg-[#Ed3237] text-white px-3 py-2 rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-1.5 tracking-wide"
                                            >
                                                <span>IR A COMPRA MAYORISTA</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/shoponline');
                                                }}
                                                className="w-full text-xs text-gray-600 hover:text-[#Ed3237] transition-colors py-1.5 font-medium tracking-wide border border-gray-300 rounded-lg hover:border-[#Ed3237]"
                                            >
                                                Seguir con compra minorista
                                            </button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="black"
                                            size="sm"
                                            fullWidth
                                            onClick={handleGoToCart}
                                            className="inline-flex items-center justify-center space-x-1.5 tracking-wide text-xs py-2"
                                        >
                                            <span>GENERAR PEDIDO</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    )}

                                    {!isInCheckout && (
                                        <motion.button
                                            onClick={handleClearCart}
                                            className="w-full text-xs text-gray-600 hover:text-red-600 transition-colors py-1.5 font-medium tracking-wide"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Vaciar carrito
                                        </motion.button>
                                    )}
                                    {isInCheckout && (
                                        <div className="w-full text-[10px] text-gray-500 text-center py-1.5 font-medium tracking-wide">
                                            No se puede modificar el carrito durante el checkout
                                        </div>
                                    )}
                                </div>

                                {/* Info adicional - COMENTADO TEMPORALMENTE */}
                                {/* <motion.div
                                    className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="font-medium">🚚 Envío gratis en compras superiores a $50.000</p>
                                </motion.div> */}
                            </div>
                        )}
                    </motion.div>
                    <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        onClose={closeModal}
                        onConfirm={handleConfirm}
                        loading={loading}
                        {...modalOptions}
                    />
                </>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;

    return createPortal(drawerContent, document.body);
};

export default CartDrawer;