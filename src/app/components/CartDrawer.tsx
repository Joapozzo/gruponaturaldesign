'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './hooks/useCart';
import ConfirmModal from './modal/ConfirmModal';
import { useConfirmModal } from './hooks/useModal';
import { useCartQuantityUpdate } from './hooks/useCartQuantityUpdate';
import { useCartActions } from './hooks/useCartActions';
import { useSales } from '../contexts/SalesContext';
import { useMounted } from './hooks/useMounted';
import { useCartDrawerAutoClose } from './hooks/useCartDrawerAutoClose';
import { useCartBordadoAutoDisable } from './hooks/useCartBordadoAutoDisable';
import { useSortedCartItems } from './hooks/useSortedCartItems';
import { CartDrawerOverlay } from './cart-drawer/CartDrawerOverlay';
import { CartDrawerHeader } from './cart-drawer/CartDrawerHeader';
import { CartDrawerContent } from './cart-drawer/CartDrawerContent';
import { CartDrawerFooter } from './cart-drawer/CartDrawerFooter';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const mounted = useMounted();
    
    const {
        itemCount,
        subtotal,
        totalLista,
        totalTransfer,
        isEmpty,
        updateBordado,
        removeFromCart,
        canAddToCart,
    } = useCart();
    
    const { isOpen: isConfirmModalOpen, loading, modalOptions, closeModal, handleConfirm } = useConfirmModal();
    const { config, isWholesaleLimitReached } = useSales();
    const { updateQuantity } = useCartQuantityUpdate({
        validateWholesaleLimit: true,
    });
    const { 
        handleGoToCart, 
        handleClearCart,
        isInCheckout,
    } = useCartActions({ onClose });

    // Hooks para lógica de negocio
    useCartDrawerAutoClose({ isInCheckout, isOpen, onClose });
    useCartBordadoAutoDisable();
    const sortedItems = useSortedCartItems();


    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <CartDrawerOverlay onClose={onClose} />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden"
                        style={{ zIndex: 100000 }}
                    >
                        <CartDrawerHeader itemCount={itemCount} onClose={onClose} />

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-0">
                            <CartDrawerContent
                                isEmpty={isEmpty}
                                sortedItems={sortedItems}
                                itemCount={itemCount}
                                isInCheckout={isInCheckout}
                                canAddToCart={canAddToCart}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                                updateBordado={updateBordado}
                                onClose={onClose}
                            />
                        </div>

                        <CartDrawerFooter
                            isEmpty={isEmpty}
                            itemCount={itemCount}
                            subtotal={subtotal}
                            totalLista={totalLista}
                            totalTransfer={totalTransfer}
                            isInCheckout={isInCheckout}
                            isWholesaleLimitReached={isWholesaleLimitReached}
                            bordadoMinItems={config.BORDADO_MIN_ITEMS}
                            config={config}
                            handleGoToCart={handleGoToCart}
                            handleClearCart={handleClearCart}
                            onClose={onClose}
                        />
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