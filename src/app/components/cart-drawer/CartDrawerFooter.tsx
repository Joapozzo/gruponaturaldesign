'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';

interface CartDrawerFooterProps {
    isEmpty: boolean;
    itemCount: number;
    subtotal: number;
    totalLista: number;
    totalTransfer: number;
    isInCheckout: boolean;
    isWholesaleLimitReached: boolean;
    bordadoMinItems: number;
    config: {
        WHOLESALE_ROUTE: string;
        SHOP_ROUTE: string;
        CHECKOUT_ROUTE: string;
    };
    handleGoToCart: () => void;
    handleClearCart: () => void;
    onClose: () => void;
}

export const CartDrawerFooter: React.FC<CartDrawerFooterProps> = ({
    isEmpty,
    itemCount,
    subtotal,
    totalLista,
    totalTransfer,
    isInCheckout,
    isWholesaleLimitReached,
    bordadoMinItems,
    config,
    handleGoToCart,
    handleClearCart,
    onClose,
}) => {
    const router = useRouter();

    if (isEmpty) return null;

    return (
        <div className="border-t border-gray-200 p-3 space-y-2 bg-white shadow-lg flex-shrink-0">
            {/* Mensaje informativo de bordado */}
            {itemCount >= bordadoMinItems && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg p-2.5 mb-2 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-red-600 text-sm">✨</span>
                        <p className="text-[11px] text-red-700 font-bold tracking-wide">
                            Con {itemCount} prendas puedes bordar tu logo
                        </p>
                    </div>
                </div>
            )}

            {/* Resumen de precios */}
            <div className="space-y-1">
                <div className="flex justify-between text-gray-500 text-xs">
                    <span>Subtotal sin impuestos</span>
                    <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs pt-1 border-t border-gray-200">
                    <span>Total con transferencia</span>
                    <span>${totalTransfer.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-gray-300">
                    <span className="tracking-wide">TOTAL (Lista)</span>
                    <span>${totalLista.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Alerta Mayorista centralizada - Si tiene 20+ artículos */}
            {isWholesaleLimitReached && (
                <div className="bg-gradient-to-r from-[#Ed3237] to-red-700 text-white p-2 rounded border border-[#Ed3237]">
                    <div className="flex items-start gap-1.5 mb-2">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="font-bold text-xs mb-0.5">🏢 COMPRA MAYORISTA</h3>
                            <p className="text-[10px] text-white/95 leading-relaxed mb-2">
                                Tu pedido de {itemCount} unidades requiere compra mayorista. Las compras mayoristas deben realizarse directamente a través de nuestro sistema mayorista.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-2">
                {isWholesaleLimitReached ? (
                    <>
                        <button
                            onClick={() => {
                                onClose();
                                router.push(config.WHOLESALE_ROUTE);
                            }}
                            className="w-full bg-[#Ed3237] text-white px-3 py-2 rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-1.5 tracking-wide"
                        >
                            <span>IR A COMPRA MAYORISTA</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                router.push(config.SHOP_ROUTE);
                            }}
                            className="w-full text-xs text-gray-600 hover:text-[#Ed3237] transition-colors py-1.5 font-medium tracking-wide border border-gray-300 rounded-lg hover:border-[#Ed3237]"
                        >
                            Seguir con compra minorista
                        </button>
                    </>
                ) : (
                    <Button
                        variant="black"
                        size="sm"
                        fullWidth
                        onClick={handleGoToCart}
                        className="inline-flex items-center justify-center space-x-1.5 tracking-wide text-xs py-2"
                    >
                        <span>GENERAR PEDIDO</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}

                {!isInCheckout && (
                    <motion.button
                        onClick={handleClearCart}
                        className="w-full text-xs text-gray-600 hover:text-red-600 transition-colors py-1.5 font-medium tracking-wide"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Vaciar carrito
                    </motion.button>
                )}
                {isInCheckout && (
                    <div className="w-full text-[10px] text-gray-500 text-center py-1.5 font-medium tracking-wide">
                        No se puede modificar el carrito durante el checkout
                    </div>
                )}
            </div>
        </div>
    );
};

