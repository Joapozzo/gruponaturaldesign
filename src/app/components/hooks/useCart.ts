import { useCartStore, sendOrderViaWhatsApp } from '../../stores/cartStore';

export const useCart = () => {
    const store = useCartStore();

    return {
        // Estado
        items: store.items,
        itemCount: store.itemCount,
        subtotal: store.subtotal,
        iva: store.iva,
        total: store.total,
        customerData: store.customerData,
        shippingData: store.shippingData,
        paymentData: store.paymentData,

        // Verificaciones
        isEmpty: store.items.length === 0,
        hasCustomerData: !!store.customerData,
        hasShippingData: !!store.shippingData,
        isReadyForCheckout: store.items.length > 0 && !!store.customerData && !!store.shippingData,

        // Acciones
        addToCart: store.addItem,
        removeFromCart: store.removeItem,
        updateQuantity: store.updateQuantity,
        updateEspecificaciones: store.updateEspecificaciones,
        clearCart: store.clearCart,
        setCustomerData: store.setCustomerData,
        setShippingData: store.setShippingData,
        setPaymentData: store.setPaymentData,

        // Helpers
        isInCart: (productId: number) =>
            store.items.some(item => item.product.id === productId),

        getProductQuantity: (productId: number) =>
            store.items.find(item => item.product.id === productId)?.quantity || 0,

        getCartItem: (productId: number) =>
            store.items.find(item => item.product.id === productId),

        // Checkout
        completeOrderViaWhatsApp: () => {
            const message = store.generateWhatsAppMessage();
            if (message) {
                sendOrderViaWhatsApp(message);
                return true;
            }
            return false;
        },
    };
};