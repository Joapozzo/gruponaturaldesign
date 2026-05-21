'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { CheckoutCartItem } from './CheckoutCartItem';
import { CheckoutActionBar } from './CheckoutActionBar';
import { getStockMessage } from '@/app/services/stockService';
import { useConfirmModal } from '../hooks/useModal';
import ConfirmModal from '../modal/ConfirmModal';
import { useCartQuantityUpdate } from '../hooks/useCartQuantityUpdate';
import { useSales } from '../../contexts/SalesContext';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CheckoutStep1({ onNext, onBack }: CheckoutStep1Props) {
  const router = useRouter();
  const { items, removeFromCart, itemCount, canAddToCart, subtotal, total } = useCart();
  const { config, isWholesaleLimitReached, isNearWholesaleLimit } = useSales();
  const { updateQuantity: baseUpdateQuantity } = useCartQuantityUpdate({
    minQuantity: 1,
    maxQuantity: 99,
    validateWholesaleLimit: true,
  });

  // Hook para modal de confirmación mayorista
  const { 
    isOpen: isWholesaleModalOpen, 
    loading: isWholesaleModalLoading, 
    modalOptions: wholesaleModalOptions, 
    closeModal: closeWholesaleModal, 
    handleConfirm: handleWholesaleConfirm 
  } = useConfirmModal();

  // Wrapper que agrega validación de stock adicional
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    // Validar stock del producto antes de actualizar
    const existingItem = items.find(item => item.product.id === productId);
    if (existingItem && existingItem.product.stock !== undefined && newQuantity > existingItem.product.stock) {
      const stockMessage = getStockMessage(existingItem.product.stock);
      if (stockMessage) {
        toast.error(stockMessage, {
          duration: 4000,
        });
        return;
      }
    }

    // Usar el hook base que ya maneja límites y validaciones de mayorista
    baseUpdateQuantity(productId, newQuantity);
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="flex flex-col gap-2">
        <h2 className="text-xs sm:text-sm font-bold text-black">RESUMEN DEL PEDIDO</h2>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* LEFT SIDE - Items del pedido */}
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              {items.map((item) => (
                <CheckoutCartItem
                  key={item.product.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeFromCart}
                  canAddMore={
                    canAddToCart(item.product.id, 1).canAdd &&
                    (item.product.stock === undefined || item.quantity < (item.product.stock || 0))
                  }
                  maxReached={
                    item.quantity >= config.MAX_QUANTITY ||
                    (item.product.stock !== undefined && item.quantity >= (item.product.stock || 0))
                  }
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Resumen del Carrito Fijo */}
          <div className="w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">

        {/* Resumen de precios */}
        <div className="bg-white border border-gray-200 p-3 sm:p-4 rounded-lg space-y-1.5">
          <h3 className="text-xs sm:text-sm font-bold text-black mb-2">RESUMEN</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between text-gray-500 text-xs sm:text-sm">
              <span>Subtotal sin impuestos</span>
              <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
        </div>
            <div className="flex justify-between text-sm sm:text-base font-bold text-black pt-2 border-t border-gray-300">
              <span className="tracking-wide">TOTAL</span>
              <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Alerta Mayorista - Si tiene 20+ artículos, mostrar mensaje y botón para volver */}
        {isWholesaleLimitReached ? (
          <div className="bg-gradient-to-r from-[#Ed3237] to-red-700 text-white p-3 sm:p-4 rounded-lg border-2 border-[#Ed3237]">
            <div className="flex items-start gap-1.5 sm:gap-2 mb-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-xs sm:text-sm mb-1">COMPRA MAYORISTA</h3>
                <p className="text-[10px] sm:text-xs text-white/95 leading-relaxed mb-2 sm:mb-3">
                  Tu pedido de {itemCount} unidades requiere compra mayorista. Las compras mayoristas deben realizarse directamente a través de nuestro sistema mayorista.
                </p>
                <button
                  onClick={() => router.push(config.WHOLESALE_ROUTE)}
                  className="w-full bg-white text-[#Ed3237] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2"
                >
                  <span>IR A COMPRA MAYORISTA</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => {
                    // Reducir cantidad hasta estar bajo el límite
                    // Por ahora, simplemente redirigir al catálogo para que puedan reducir manualmente
                    router.push(config.SHOP_ROUTE);
                  }}
                  className="w-full text-xs sm:text-sm text-white hover:text-gray-200 transition-colors py-1.5 sm:py-2 font-medium border border-white/30 rounded-lg hover:border-white/50"
                >
                  Seguir con compra minorista
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CheckoutActionBar
            onContinue={onNext}
            onBack={onBack}
            backLabel="VOLVER"
            className="mt-auto"
          />
        )}

        {/* Botón para volver a compra minorista si están cerca del límite */}
        {isNearWholesaleLimit && (
          <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-900 p-3 sm:p-4 rounded-lg">
            <p className="text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
              ⚠️ Estás cerca del límite de compra minorista
            </p>
            <p className="text-[10px] sm:text-xs mb-2 sm:mb-3">
              Si necesitas más de {config.WHOLESALE_MIN_ITEMS} prendas, considera usar nuestro sistema mayorista con mejores precios y beneficios.
            </p>
            <Button
              variant="black"
              size="sm"
              fullWidth
              onClick={() => router.push(config.WHOLESALE_ROUTE)}
              className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <span>VER OPCIONES MAYORISTAS</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        )}

        {/* Políticas */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">INFORMACIÓN IMPORTANTE</h3>
          <div className="space-y-2 sm:space-y-2.5 text-[10px] sm:text-xs text-gray-700">
            <div className="flex gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Todos los productos están sujetos a disponibilidad de stock</p>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {/* <p>Los tiempos de entrega se coordinarán vía WhatsApp</p> */}
              <p>Los tiempos de entrega se coordinan por email tras confirmar tu pedido</p>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Aceptamos múltiples formas de pago: transferencia, efectivo y tarjeta</p>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Garantía de calidad en todos nuestros productos industriales</p>
            </div>
          </div>
        </div>

          </div>
        </div>
      </div>

      {/* Modal de confirmación mayorista */}
      <ConfirmModal
        isOpen={isWholesaleModalOpen}
        onClose={closeWholesaleModal}
        onConfirm={handleWholesaleConfirm}
        loading={isWholesaleModalLoading}
        {...wholesaleModalOptions}
      />
    </div>
  );
}
