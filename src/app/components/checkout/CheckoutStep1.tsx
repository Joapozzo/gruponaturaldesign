'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import Button from '../ui/Button';
import { Trash2, ArrowRight, Package } from 'lucide-react';
import QuantityControlsUI from '@/app/components/ui/QuantityControls';
import BordadoSwitch from '../product-card/components/BordadoSwitch';
import { formatPrice, formatPriceWithoutIVA } from '@/app/(pages)/producto/[id]/helpers/productHelpers';
import { getStockMessage } from '@/app/services/stockService';
import { useConfirmModal } from '../hooks/useModal';
import ConfirmModal from '../modal/ConfirmModal';

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CheckoutStep1({ onNext, onBack }: CheckoutStep1Props) {
  const router = useRouter();
  const { items, updateQuantity: originalUpdateQuantity, updateBordado, removeFromCart, itemCount, canAddToCart, subtotal, iva, total } = useCart();

  // Hook para modal de confirmación mayorista
  const { 
    isOpen: isWholesaleModalOpen, 
    loading: isWholesaleModalLoading, 
    modalOptions: wholesaleModalOptions, 
    showModal: showWholesaleModal, 
    closeModal: closeWholesaleModal, 
    handleConfirm: handleWholesaleConfirm 
  } = useConfirmModal();

  // No redirigir automáticamente - mostrar alerta cuando llegue a 20 unidades

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      originalUpdateQuantity(productId, 1);
      return;
    }
    if (newQuantity > 99) {
      originalUpdateQuantity(productId, 99);
      return;
    }
    
    // Calcular la diferencia de cantidad
    const existingItem = items.find(item => item.product.id === productId);
    const currentQuantity = existingItem?.quantity || 0;
    const quantityDifference = newQuantity - currentQuantity;

    // Validar si se puede agregar más unidades
    if (quantityDifference > 0) {
      const validation = canAddToCart(productId, quantityDifference);
      if (!validation.canAdd) {
        // Mostrar modal de confirmación para ir a mayorista
        showWholesaleModal({
          title: 'Límite minorista alcanzado',
          message: 'Has alcanzado el límite de compra minorista (20 artículos). ¿Deseas continuar con tu compra en nuestro sistema mayorista?',
          type: 'warning',
          confirmText: 'Sí, ir a mayorista',
          cancelText: 'No, cancelar',
          onConfirm: async () => {
            router.push('/mayorista');
          }
        });
        return;
      }
      
      // Validar stock del producto
      const existingItem = items.find(item => item.product.id === productId);
      if (existingItem && existingItem.product.stock !== undefined) {
        const stockMessage = getStockMessage(existingItem.product.stock);
        if (stockMessage && newQuantity > (existingItem.product.stock || 0)) {
          toast.error(stockMessage, {
            duration: 4000,
          });
          return;
        }
      }
    }

    // Permitir actualizar si es decremento o si pasó la validación
    originalUpdateQuantity(productId, newQuantity);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* LEFT SIDE - Resumen del Pedido con controles */}
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="text-sm lg:text-base font-bold text-black mb-2">RESUMEN DEL PEDIDO</h2>

        {/* Cart Items - Compact Row Layout */}
        <div className="space-y-1.5 pr-2">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white border-l-2 border-black p-1.5 lg:p-2.5 relative group hover:shadow-sm transition-shadow rounded"
            >
              <div className="flex items-center gap-2">
                {/* Product Image - Más alta en mobile, más grande en desktop */}
                <div className="relative w-12 h-16 lg:w-16 lg:h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.product.imagen ? (
                    <Image
                      src={item.product.imagen}
                      alt={item.product.nombre}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 48px, 64px"
                      unoptimized={true}
                      onError={() => {
                        // El error se maneja mostrando el Package icon
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info - Compacto en mobile, más grande en desktop */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black text-xs lg:text-sm leading-tight line-clamp-1">{item.product.nombre}</h3>
                  {item.especificaciones && (
                    <p className="text-[10px] lg:text-xs text-gray-600 mt-0.5 line-clamp-1">{item.especificaciones}</p>
                  )}
                  {/* Switch de Bordado */}
                  <div className="mt-1.5">
                    <BordadoSwitch
                      value={item.bordado || false}
                      onChange={(value) => updateBordado(item.product.id, value)}
                      isMobile={false}
                    />
                  </div>
                  {/* Precio */}
                  <div className="mt-1">
                    <p className="text-xs font-bold text-black">{formatPrice(item.subtotal)}</p>
                    {item.subtotal > 0 && (
                      <p className="text-[10px] text-gray-500">{formatPriceWithoutIVA(item.subtotal)}</p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls - Estilo CartDrawer sin outline */}
                <div className="flex items-center gap-2">
                  <div className="flex justify-center">
                    <QuantityControlsUI
                      quantity={item.quantity}
                      onIncrement={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      onDecrement={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      canAddMore={canAddToCart(item.product.id, 1).canAdd && (item.product.stock === undefined || item.quantity < (item.product.stock || 0))}
                      maxReached={item.quantity >= 99 || (item.product.stock !== undefined && item.quantity >= (item.product.stock || 0))}
                    />
                  </div>
                  {/* Remove Button - Siempre visible */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="w-7 h-8 sm:h-7 text-red-600 hover:text-black hover:bg-gray-100 transition-colors flex items-center justify-center rounded opacity-100"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* RIGHT SIDE - Resumen del Carrito Fijo */}
      <div className="w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">


        {/* Alerta Mayorista - Si tiene 20+ artículos, mostrar mensaje y botón para volver */}
        {itemCount >= 20 ? (
          <div className="bg-gradient-to-r from-[#Ed3237] to-red-700 text-white p-4 rounded-lg border-2 border-[#Ed3237]">
            <div className="flex items-start gap-2 mb-4">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-sm mb-1">COMPRA MAYORISTA</h3>
                <p className="text-xs text-white/95 leading-relaxed mb-3">
                  Tu pedido de {itemCount} unidades requiere compra mayorista. Las compras mayoristas deben realizarse directamente a través de nuestro sistema mayorista.
                </p>
                <button
                  onClick={() => router.push('/mayorista')}
                  className="w-full bg-white text-[#Ed3237] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2 mb-2"
                >
                  <span>IR A COMPRA MAYORISTA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Reducir cantidad hasta estar bajo el límite
                    // Por ahora, simplemente redirigir al catálogo para que puedan reducir manualmente
                    router.push('/shoponline');
                  }}
                  className="w-full text-sm text-white hover:text-gray-200 transition-colors py-2 font-medium border border-white/30 rounded-lg hover:border-white/50"
                >
                  Seguir con compra minorista
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Action Buttons - Row en mobile, col en desktop */}
            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
              <Button variant="black" size="lg" fullWidth onClick={onNext} className="flex-1 lg:flex-none">
                CONTINUAR
              </Button>
              <Button variant="blackOutline" size="md" fullWidth onClick={onBack} className="flex-1 lg:flex-none">
                SEGUIR COMPRANDO
              </Button>
            </div>
          </>
        )}

        {/* Botón para volver a compra minorista si están cerca del límite */}
        {itemCount >= 15 && itemCount < 20 && (
          <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-900 p-4 rounded-lg">
            <p className="text-xs font-semibold mb-2">
              ⚠️ Estás cerca del límite de compra minorista
            </p>
            <p className="text-xs mb-3">
              Si necesitas más de 20 prendas, considera usar nuestro sistema mayorista con mejores precios y beneficios.
            </p>
            <Button
              variant="black"
              size="sm"
              fullWidth
              onClick={() => router.push('/mayorista')}
              className="inline-flex items-center justify-center space-x-2"
            >
              <span>VER OPCIONES MAYORISTAS</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Políticas */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-black mb-3">INFORMACIÓN IMPORTANTE</h3>
          <div className="space-y-3 text-xs text-gray-700">
            <div className="flex gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Todos los productos están sujetos a disponibilidad de stock</p>
            </div>
            <div className="flex gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Los tiempos de entrega se coordinarán vía WhatsApp</p>
            </div>
            <div className="flex gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Aceptamos múltiples formas de pago: transferencia, efectivo y tarjeta</p>
            </div>
            <div className="flex gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Garantía de calidad en todos nuestros productos industriales</p>
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
