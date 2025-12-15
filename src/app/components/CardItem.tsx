import { motion } from 'framer-motion';
import { Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConfirmModal } from './hooks/useModal';
import ConfirmModal from './modal/ConfirmModal';
import { nombreToSlug, parseProductSpecs } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import QuantityControlsUI from './ui/QuantityControls';
import { formatPrice, formatPriceWithoutIVA } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import { canAddQuantity, getStockMessage } from '@/app/services/stockService';

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
    canAddMore?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, canAddMore = true }) => {
    const { product, quantity, subtotal, especificaciones } = item;
    const { isOpen: isConfirmModalOpen, loading, modalOptions, showModal, closeModal, handleConfirm } = useConfirmModal();
    const router = useRouter();
    
    // Parsear especificaciones para obtener color y talle
    const { color, talle } = parseProductSpecs(especificaciones);
    
    // Construir URL del producto con query params
    const handleProductClick = () => {
        // Usar skuBaseSlug si está disponible, sino generar desde nombre
        const productSlug = (product as any).skuBaseSlug || nombreToSlug(product.nombre);
        const params = new URLSearchParams();
        
        if (color) params.set('color', color.toLowerCase());
        if (talle) params.set('talle', talle);
        
        const queryString = params.toString();
        const url = queryString 
            ? `/producto/${productSlug}?${queryString}`
            : `/producto/${productSlug}`;
        
        router.push(url);
    };

    const handleIncrement = () => {
        // Validar stock disponible usando el servicio (lógica separada y delicada)
        if (!canAddQuantity(product.stock, quantity, 1)) {
            // No mostrar el número exacto de stock, solo un mensaje genérico
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
            {/* Imagen - Clickable */}
            <div 
                className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleProductClick}
            >
                {product.imagen ? (
                    <Image
                        src={product.imagen}
                        alt={product.nombre}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                        onError={() => {
                            // El error se maneja mostrando el Package icon
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Info del producto */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                    <div 
                        className="flex-1 pr-2 cursor-pointer"
                        onClick={handleProductClick}
                    >
                        <h4 className="font-bold text-black text-sm leading-tight mb-1 line-clamp-2 hover:text-[#Ed3237] transition-colors">
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
                    <div className="flex justify-center">
                        <QuantityControlsUI
                            quantity={quantity}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            canAddMore={canAddQuantity(product.stock, quantity, 1) && canAddMore}
                            maxReached={!canAddQuantity(product.stock, quantity, 1)}
                        />
                    </div>

                    {/* Subtotal con precio sin IVA */}
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                        <p className="text-base font-bold text-black">
                            {formatPrice(subtotal)}
                        </p>
                        {subtotal > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {formatPriceWithoutIVA(subtotal)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Indicador de stock bajo */}
                {product.stock && product.stock <= 10 && (
                    <motion.p
                        className="text-xs text-orange-600 mt-2 font-medium"
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
