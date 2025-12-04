'use client';
import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
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
        // subtotal,  // Comentado temporalmente - sin precios por ahora
        // iva,       // Comentado temporalmente - sin precios por ahora
        // total,     // Comentado temporalmente - sin precios por ahora
        isEmpty,
        updateQuantity: originalUpdateQuantity,
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

    // Wrapper para updateQuantity - permite actualizar sin restricciones
    // Las restricciones se muestran visualmente cuando se alcanzan 20 unidades
    const updateQuantity = (productId: number, newQuantity: number) => {
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
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-bold text-black tracking-wide">
                                        MI CARRITO
                                    </h2>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Cerrar carrito"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
                            {isEmpty ? (
                                <EmptyCart onClose={onClose} />
                            ) : (
                                <div className="space-y-4">
                                    {sortedItems.map((item) => (
                                        <CartItem
                                            key={item.product.id}
                                            item={item}
                                            onUpdateQuantity={isInCheckout ? () => {} : updateQuantity}
                                            onRemove={isInCheckout ? () => {} : removeFromCart}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {!isEmpty && (
                            <div className="border-t border-gray-200 p-6 space-y-4 bg-white shadow-lg flex-shrink-0">

                                {/* Resumen - COMENTADO TEMPORALMENTE (sin precios por ahora) */}
                                {/* <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-semibold">
                                            ${subtotal.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                    {iva > 0 && (
                                        <div className="flex justify-between text-gray-500 text-sm">
                                            <span>IVA (21%)</span>
                                            <span>${iva.toLocaleString('es-AR')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-black pt-3 border-t border-gray-300">
                                        <span className="tracking-wide">TOTAL</span>
                                        <span>${total.toLocaleString('es-AR')}</span>
                                    </div>
                                </div> */}

                                {/* Resumen de productos */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xl font-bold text-black">
                                        <span className="tracking-wide">TOTAL DE PRODUCTOS</span>
                                        <span>{itemCount}</span>
                                    </div>
                                </div>

                                {/* Alerta Mayorista centralizada - Si tiene 20+ artículos */}
                                {itemCount >= 20 && (
                                    <div className="bg-gradient-to-r from-[#Ed3237] to-red-700 text-white p-4 rounded-lg border-2 border-[#Ed3237]">
                                        <div className="flex items-start gap-2 mb-3">
                                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-sm mb-1">🏢 COMPRA MAYORISTA</h3>
                                                <p className="text-xs text-white/95 leading-relaxed mb-3">
                                                    Tu pedido de {itemCount} unidades requiere compra mayorista. Las compras mayoristas deben realizarse directamente a través de nuestro sistema mayorista.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de acción */}
                                <div className="space-y-3">
                                    {itemCount >= 20 ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/mayorista');
                                                }}
                                                className="w-full bg-[#Ed3237] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-2 tracking-wide"
                                            >
                                                <span>IR A COMPRA MAYORISTA</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/shoponline');
                                                }}
                                                className="w-full text-sm text-gray-600 hover:text-[#Ed3237] transition-colors py-2 font-medium tracking-wide border border-gray-300 rounded-lg hover:border-[#Ed3237]"
                                            >
                                                Seguir con compra minorista
                                            </button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="black"
                                            size="lg"
                                            fullWidth
                                            onClick={handleGoToCart}
                                            className="inline-flex items-center justify-center space-x-2 tracking-wide"
                                        >
                                            <span>GENERAR PEDIDO</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    )}

                                    {!isInCheckout && (
                                        <motion.button
                                            onClick={handleClearCart}
                                            className="w-full text-sm text-gray-600 hover:text-red-600 transition-colors py-2 font-medium tracking-wide"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Vaciar carrito
                                        </motion.button>
                                    )}
                                    {isInCheckout && (
                                        <div className="w-full text-xs text-gray-500 text-center py-2 font-medium tracking-wide">
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