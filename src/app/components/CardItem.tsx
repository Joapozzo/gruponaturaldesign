import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useConfirmModal } from './hooks/useModal';
import ConfirmModal from './modal/ConfirmModal';

interface CartItemProps {
    item: {
        product: {
            id: number;
            nombre: string;
            imagen: string;
            precio: number;
            stock?: number;
            categoria: string;
        };
        quantity: number;
        subtotal: number;
        especificaciones?: string;
    };
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const { product, quantity, /* subtotal, */ especificaciones } = item; // subtotal comentado temporalmente
    const { isOpen: isConfirmModalOpen, loading, modalOptions, showModal, closeModal, handleConfirm } = useConfirmModal();

    const handleIncrement = () => {
        if (product.stock && quantity >= product.stock) {
            alert(`Stock máximo disponible: ${product.stock} unidades`);
            return;
        }
        onUpdateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onUpdateQuantity(product.id, quantity - 1);
        }
    };

    const handleRemove = () => {
        showModal({
            title: 'Eliminar Producto',
            message: `¿Eliminar ${product.nombre} del carrito?`,
            type: 'warning',
            confirmText: 'Sí, eliminar',
            cancelText: 'No, mantener',
            onConfirm: async () => {
                // Tu lógica aquí
                onRemove(product.id);
                // Puede ser async
                // await deleteFromAPI();
            }
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300"
        >
            {/* Imagen */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={product.imagen}
                    alt={product.nombre}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                        <h4 className="font-bold text-black text-sm leading-tight mb-1 line-clamp-2">
                            {product.nombre}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                            {product.categoria}
                        </p>
                    </div>
                    <motion.button
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Eliminar producto"
                    >
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Especificaciones si existen */}
                {especificaciones && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {especificaciones}
                    </p>
                )}

                {/* Precio y controles */}
                <div className="flex items-center justify-between mt-3">
                    {/* Controles de cantidad */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <motion.button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${quantity <= 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-50 shadow-sm'
                                }`}
                            whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                            whileTap={quantity > 1 ? { scale: 0.95 } : {}}
                            aria-label="Disminuir cantidad"
                        >
                            <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="w-8 text-center font-bold text-sm text-black">
                            {quantity}
                        </span>
                        <motion.button
                            onClick={handleIncrement}
                            disabled={product.stock ? quantity >= product.stock : false}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${product.stock && quantity >= product.stock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-50 shadow-sm'
                                }`}
                            whileHover={!(product.stock && quantity >= product.stock) ? { scale: 1.1 } : {}}
                            whileTap={!(product.stock && quantity >= product.stock) ? { scale: 0.95 } : {}}
                            aria-label="Aumentar cantidad"
                        >
                            <Plus className="w-3 h-3" />
                        </motion.button>
                    </div>

                    {/* Subtotal - COMENTADO TEMPORALMENTE (sin precios por ahora) */}
                    {/* <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                        <p className="text-base font-bold text-black">
                            ${(subtotal || 0).toLocaleString('es-AR')}
                        </p>
                    </div> */}
                </div>

                {/* Indicador de stock bajo */}
                {product.stock && product.stock <= 10 && (
                    <motion.p
                        className="text-xs text-orange-600 mt-2 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        ⚠️ Solo quedan {product.stock} unidades
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
