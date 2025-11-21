'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from './hooks/useCart';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';
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
    const {
        items,
        itemCount,
        // subtotal,  // Comentado temporalmente - sin precios por ahora
        // iva,       // Comentado temporalmente - sin precios por ahora
        // total,     // Comentado temporalmente - sin precios por ahora
        isEmpty,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();
    const { isOpen: isConfirmModalOpen, loading, modalOptions, showModal, closeModal, handleConfirm } = useConfirmModal();

    const handleGoToCart = () => {
        onClose();
        router.push('/checkout');
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm w-screen h-screen"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
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
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.product.id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
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

                                {/* Botones de acción */}
                                <div className="space-y-3">
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

                                    <motion.button
                                        onClick={handleClearCart}
                                        className="w-full text-sm text-gray-600 hover:text-red-600 transition-colors py-2 font-medium tracking-wide"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Vaciar carrito
                                    </motion.button>
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
};

export default CartDrawer;