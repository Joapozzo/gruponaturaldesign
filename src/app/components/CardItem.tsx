import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useConfirmModal } from './hooks/useModal';
import ConfirmModal from './modal/ConfirmModal';
import BordadoSwitch from './product-card/components/BordadoSwitch';
import QuantityControlsUI from './ui/QuantityControls';
import { formatPrice, parseProductSpecs } from '@/app/utils/productHelpers';
import { canAddQuantity } from '@/app/services/stockService';
import { ProductImage } from './product-card/components/ProductImage';
import { CartItemProps } from '../types/producto-publicado.types';
import { useCartItemActions } from './hooks/useCartItemActions';
import { useSales } from '@/app/contexts/SalesContext';
import { useCart } from './hooks/useCart';

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, onUpdateBordado, canAddMore = true }) => {
    const { product, quantity, especificaciones, bordado = false } = item;
    const { isOpen: isConfirmModalOpen, loading, modalOptions, closeModal, handleConfirm, showModal } = useConfirmModal();
    const { canActivateBordado, config } = useSales();
    const { itemCount } = useCart();

    const { color, talle } = parseProductSpecs(especificaciones);
    const specsLine = [color && `Color: ${color}`, talle && `Talle: ${talle}`]
        .filter(Boolean)
        .join(' · ');

    const {
        handleProductClick,
        handleIncrement,
        handleDecrement,
        handleRemove,
    } = useCartItemActions({
        item,
        onUpdateQuantity,
        onRemove,
        showModal,
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
        >
            <div
                className="relative w-20 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleProductClick}
            >
                <ProductImage
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full"
                    fill
                    sizes="80px"
                    objectFit="cover"
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
                <div className="flex items-start justify-between gap-2">
                    <h4
                        className="flex-1 min-w-0 font-semibold text-black text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#Ed3237] transition-colors"
                        onClick={handleProductClick}
                    >
                        {product.nombre}
                    </h4>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {onUpdateBordado && (
                            <div className="flex items-center gap-1">
                                <span
                                    className={`text-[10px] font-medium tabular-nums ${
                                        canActivateBordado ? 'text-neutral-600' : 'text-neutral-400'
                                    }`}
                                    title={`Prendas en carrito para activar bordado (mín. ${config.BORDADO_MIN_ITEMS})`}
                                >
                                    {itemCount}/{config.BORDADO_MIN_ITEMS}
                                </span>
                                <BordadoSwitch
                                    value={bordado}
                                    onChange={(value) => {
                                        if (canActivateBordado) {
                                            onUpdateBordado(product.id, value);
                                        }
                                    }}
                                    isMobile={false}
                                    size="small"
                                    disabled={!canActivateBordado}
                                    hideLabels
                                />
                            </div>
                        )}
                        <motion.button
                            onClick={handleRemove}
                            className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Eliminar producto"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                    </div>
                </div>

                {specsLine ? (
                    <p className="text-[11px] text-gray-500 line-clamp-1">{specsLine}</p>
                ) : null}

                <div className="flex items-center justify-between gap-2 mt-auto">
                    <QuantityControlsUI
                        quantity={quantity}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        canAddMore={canAddQuantity(product.stock, quantity, 1) && canAddMore}
                        maxReached={!canAddQuantity(product.stock, quantity, 1)}
                    />
                    <p className="text-sm font-bold text-black tabular-nums shrink-0">
                        {formatPrice(product.precioLista)}
                    </p>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
                loading={loading}
                {...modalOptions}
            />
        </motion.div>
    );
};

export default CartItem;
