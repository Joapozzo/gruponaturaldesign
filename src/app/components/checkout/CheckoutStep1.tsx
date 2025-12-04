'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '../hooks/useCart';
import Button from '../ui/Button';
import { Trash2, ArrowRight } from 'lucide-react';
// import { formatPrice } from '@/app/utils/precio'; // Comentado - sin precios por ahora

interface CheckoutStep1Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CheckoutStep1({ onNext, onBack }: CheckoutStep1Props) {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, itemCount, isWholesale, canAddToCart } = useCart();
  // const { subtotal, iva, total } = useCart(); // Comentado - sin precios por ahora

  // Redirigir si es compra mayorista (19+ artículos)
  useEffect(() => {
    if (itemCount >= 19) {
      router.push('/mayorista');
    }
  }, [itemCount, router]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    
    // Obtener cantidad actual del producto
    const currentItem = items.find(item => item.product.id === productId);
    const currentQuantity = currentItem?.quantity || 0;
    const quantityDelta = newQuantity - currentQuantity;
    
    // Si está aumentando, validar límites
    if (quantityDelta > 0) {
      const validation = canAddToCart(productId, quantityDelta);
      if (!validation.canAdd) {
        // Redirigir a página mayorista
        router.push('/mayorista');
        return;
      }
    }
    
    updateQuantity(productId, newQuantity);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* LEFT SIDE - Resumen del Pedido con controles */}
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="text-base lg:text-xl font-bold text-black mb-3 lg:mb-4">RESUMEN DEL PEDIDO</h2>

        {/* Cart Items - Scrollable */}
        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto space-y-2 lg:space-y-3 pr-2">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white border-l-2 border-black p-3 relative group hover:shadow-sm transition-shadow rounded-lg"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Product Image */}
                <div className="relative w-full sm:w-16 h-32 sm:h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={item.product.imagen} alt={item.product.nombre} fill className="object-cover" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 pr-6 sm:pr-0">
                  <h3 className="font-semibold text-black text-sm">{item.product.nombre}</h3>
                  {item.especificaciones && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.especificaciones}</p>
                  )}
                </div>

                {/* Quantity Controls - Inline */}
                <div className="flex items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-black text-white hover:bg-red-600 transition-colors font-bold rounded-lg disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      handleQuantityChange(item.product.id, val);
                    }}
                    className="w-14 text-center border border-black py-1 text-lg font-bold text-black focus:outline-none focus:border-red-600 rounded-lg"
                    min="1"
                    max="99"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-black text-white hover:bg-red-600 transition-colors font-bold rounded-lg disabled:opacity-30"
                    disabled={item.quantity >= 99}
                  >
                    +
                  </button>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-black transition-colors opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Eliminar"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Summary - Inside scroll area at bottom */}
          <div className="sticky bottom-0 bg-black text-white p-3 lg:p-4 flex justify-between items-center rounded-lg mt-3">
            <span className="font-bold text-sm lg:text-base">TOTAL DE PRODUCTOS</span>
            <span className="text-xl lg:text-2xl font-bold text-red-600">{itemCount}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Acciones y Políticas */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <h2 className="text-base lg:text-xl font-bold text-black">ACCIONES</h2>

        {/* Alerta Mayorista - Si tiene 19+ artículos, mostrar mensaje y botón para volver */}
        {itemCount >= 19 ? (
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
            {/* Action Buttons - Solo si no es mayorista */}
            <div className="flex flex-col gap-3">
              <Button variant="black" size="lg" fullWidth onClick={onNext}>
                CONTINUAR
              </Button>
              <Button variant="blackOutline" size="md" fullWidth onClick={onBack}>
                SEGUIR COMPRANDO
              </Button>
            </div>
          </>
        )}

        {/* Botón para volver a compra minorista si están cerca del límite */}
        {itemCount >= 15 && itemCount < 19 && (
          <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-900 p-4 rounded-lg">
            <p className="text-xs font-semibold mb-2">
              ⚠️ Estás cerca del límite de compra minorista
            </p>
            <p className="text-xs mb-3">
              Si necesitas más de 19 prendas, considera usar nuestro sistema mayorista con mejores precios y beneficios.
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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

        {/* Contact Info */}
        <div className="p-3 bg-black text-white rounded-lg text-xs">
          <p className="font-bold mb-1">¿Necesitas ayuda?</p>
          <p className="text-gray-300">Contactanos por WhatsApp para cualquier consulta</p>
        </div>
      </div>
    </div>
  );
}
