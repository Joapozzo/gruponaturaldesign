import { useCartStore, sendOrderViaWhatsApp } from '../../stores/cartStore';
import { SALES_CONFIG } from '../../config/sales.config';

export const useCart = () => {
    const store = useCartStore();

    return {
        // Estado
        items: store.items,
        itemCount: store.itemCount,
        subtotal: store.subtotal,
        subtotalTransfer: store.subtotalTransfer,
        totalLista: store.totalLista,
        totalTransfer: store.totalTransfer,
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
        updateBordado: store.updateBordado,
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

        // Detectar si el carrito es mayorista
        isWholesale: () => store.itemCount >= SALES_CONFIG.WHOLESALE_MIN_ITEMS,

        // Validar si se puede agregar un producto
        canAddToCart: (productId: number, quantity: number = 1): { canAdd: boolean; reason?: string } => {
            const currentItemCount = store.itemCount;
            const newTotalCount = currentItemCount + quantity;

            // Verificar límite de artículos totales
            if (newTotalCount > SALES_CONFIG.WHOLESALE_MIN_ITEMS) {
                return { 
                    canAdd: false, 
                    reason: `Límite minorista alcanzado: máximo ${SALES_CONFIG.WHOLESALE_MIN_ITEMS} artículos totales`
                };
            }

            return { canAdd: true };
        },

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