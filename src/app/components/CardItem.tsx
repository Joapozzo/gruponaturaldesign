import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useConfirmModal } from './hooks/useModal';
import ConfirmModal from './modal/ConfirmModal';
import BordadoSwitch from './product-card/components/BordadoSwitch';
import QuantityControlsUI from './ui/QuantityControls';
import { formatPrice } from '@/app/utils/productHelpers';
import { canAddQuantity } from '@/app/services/stockService';
import { ProductImage } from './product-card/components/ProductImage';
import { CartItemProps } from '../types/producto-publicado.types';
import { useCartItemActions } from './hooks/useCartItemActions';
import { useSales } from '@/app/contexts/SalesContext';

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, onUpdateBordado, canAddMore = true }) => {
    const { product, quantity, subtotal, especificaciones, bordado = false } = item;
    const { isOpen: isConfirmModalOpen, loading, modalOptions, closeModal, handleConfirm, showModal } = useConfirmModal();
    const { canActivateBordado, itemsNeededForBordado, config } = useSales();
    
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
            className="flex gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
        >
            {/* Imagen - Clickable */}
            <div 
                className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleProductClick}
            >
                <ProductImage
                    src={product.imagen}
                    alt={product.nombre}
                    fill
                    sizes="56px"
                    objectFit="cover"
                />
            </div>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <div 
                        className="flex-1 pr-1 cursor-pointer"
                        onClick={handleProductClick}
                    >
                        <h4 className="font-bold text-black text-xs leading-tight mb-0.5 line-clamp-2 hover:text-[#Ed3237] transition-colors">
                            {product.nombre}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                            {product.categoria}
                        </p>
                    </div>
                    <motion.button
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Eliminar producto"
                    >
                        <Trash2 className="w-3 h-3" />
                    </motion.button>
                </div>

                {/* Especificaciones si existen */}
                {especificaciones && (
                    <p className="text-[10px] text-gray-600 mb-1 line-clamp-1">
                        {especificaciones}
                    </p>
                )}

                {/* Switch de Bordado */}
                {onUpdateBordado && (
                    <div className="mb-1">
                        <div className="flex flex-col gap-0.5">
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
                            />
                            {!canActivateBordado && (
                                <p className="text-[9px] text-red-600 font-medium">
                                    Mínimo {config.BORDADO_MIN_ITEMS} prendas para activar bordado (faltan {itemsNeededForBordado})
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Precio y controles */}
                <div className="flex items-center justify-between mt-1.5">
                    {/* Controles de cantidad */}
                    <div className="flex justify-center">
                        <QuantityControlsUI
                            quantity={quantity}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            canAddMore={canAddQuantity(product.stock, quantity, 1) && canAddMore}
                            maxReached={!canAddQuantity(product.stock, quantity, 1)}
                        />
                    </div>

                    {/* Subtotal con precio lista */}
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 mb-0.5">Subtotal</p>
                        <p className="text-sm font-bold text-black">
                            {formatPrice(subtotal)}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            {formatPrice(product.precioLista)} c/u
                        </p>
                    </div>
                </div>

                {/* Indicador de stock bajo */}
                {product.stock && product.stock <= 10 && (
                    <motion.p
                        className="text-[10px] text-orange-600 mt-1 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        ⚠️ Solo quedan {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                    </motion.p>
                )}
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
