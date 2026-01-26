'use client';

import CartItem from '../CardItem';
import EmptyCart from '../CardEmpty';
import { CartItem as CartItemType } from '../../types/cart';

interface CartDrawerContentProps {
    isEmpty: boolean;
    sortedItems: CartItemType[];
    itemCount: number;
    isInCheckout: boolean;
    canAddToCart: (productId: number, quantity: number) => { canAdd: boolean; reason?: string };
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateBordado: (productId: number, bordado: boolean) => void;
    onClose: () => void;
}

export const CartDrawerContent: React.FC<CartDrawerContentProps> = ({
    isEmpty,
    sortedItems,
    itemCount,
    isInCheckout,
    canAddToCart,
    updateQuantity,
    removeFromCart,
    updateBordado,
    onClose,
}) => {
    if (isEmpty) {
        return <EmptyCart onClose={onClose} />;
    }

    return (
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
                    />
                );
            })}
        </div>
    );
};

