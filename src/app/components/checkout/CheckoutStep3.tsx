'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import Button from '@/components/ui/Button';
import { PaymentData } from '@/app/types/cart';
import { RiBankLine } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
// import { FaWhatsapp } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa6";
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/app/utils/productHelpers';
import { WHATSAPP_PHONE_NUMBER, getWhatsAppNumberForUrl } from '@/app/utils/constants';
import { useSales } from '../../contexts/SalesContext';

interface CheckoutStep3Props {
  onBack: () => void;
}

const PAYMENT_METHODS = [
  // {
  //   id: 'whatsapp',
  //   name: 'WhatsApp',
  //   description: 'Coordina el pago directamente',
  //   icon: <FaWhatsapp/>,
  // },
  {
    id: 'transferencia',
    name: 'Transferencia',
    description: 'Datos bancarios por WhatsApp',
    badge: '-15% OFF',
    icon: <RiBankLine />,
  },
  {
    id: 'efectivo',
    name: 'Efectivo',
    description: 'Al recibir o retirar',
    icon: <BsCashStack />,
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta',
    description: 'Crédito o débito',
    badge: 'Hasta 3 cuotas sin interés',
    badgeCondition: 'Compras superiores a $200.000',
    icon: <FaRegCreditCard />,
  },
];

export default function CheckoutStep3({ onBack }: CheckoutStep3Props) {
  const router = useRouter();

  const {
    items,
    customerData,
    shippingData,
    paymentData,
    setPaymentData,
    clearCart,
    itemCount,
    subtotal,
    iva,
    total,
  } = useCart();
  const { isWholesaleLimitReached } = useSales();

  const [payment, setPayment] = useState<PaymentData>({
    metodo: paymentData?.metodo || 'transferencia',
    notas: paymentData?.notas || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePaymentSelect = (metodo: 'whatsapp' | 'transferencia' | 'efectivo' | 'tarjeta') => {
    setPayment({ ...payment, metodo });
  };

  const generateWhatsAppMessage = (): string => {
    let message = '*NUEVO PEDIDO*\n\n';
  
    // CLIENTE
    message += '*CLIENTE*\n';
    message += `Nombre: ${customerData?.nombre} ${customerData?.apellido}\n`;
    message += `Email: ${customerData?.email}\n`;
    message += `Telefono: ${customerData?.telefono}\n`;
  
    if (customerData?.empresa) {
      message += `Empresa: ${customerData.empresa}\n`;
    }
  
    if (customerData?.cuit) {
      message += `CUIT: ${customerData.cuit}\n`;
    }
  
    if (customerData?.documento) {
      message += `${customerData.tipo_documento}: ${customerData.documento}\n`;
    }
  
    if (customerData?.fecha_nacimiento) {
      message += `Fecha de Nacimiento: ${customerData.fecha_nacimiento}\n`;
    }
  
    message += '\n--------------------------------\n\n';
  
    // ENTREGA
    message += '*ENTREGA*\n';
  
    if (shippingData?.tipo === 'envio') {
      message += `Tipo: Envio a domicilio\n`;
      message += `Direccion: ${shippingData.direccion}\n`;
      message += `Localidad: ${shippingData.localidad}\n`;
      message += `Provincia: ${shippingData.provincia}\n`;
      message += `Codigo Postal: ${shippingData.codigo_postal}\n`;
  
    } else {
      message += `Tipo: Retiro en tienda\n`;
    }
  
    if (shippingData?.notas) {
      message += `Notas: ${shippingData.notas}\n`;
    }
  
    message += '\n--------------------------------\n\n';
  
    // PAGO
    message += '*PAGO*\n';
    const paymentMethod = PAYMENT_METHODS.find((m) => m.id === payment.metodo);
    message += `Metodo: ${paymentMethod?.name}\n`;
  
    if (payment.notas) {
      message += `Notas: ${payment.notas}\n`;
    }
  
    message += '\n--------------------------------\n\n';
  
    // PRODUCTOS
    message += '*PRODUCTOS*\n\n';
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.nombre}\n`;

      if (item.especificaciones) {
        message += `   SKU/Especificaciones:\n`;
        // Formatear especificaciones en líneas separadas
        const specs = item.especificaciones.split(' | ');
        specs.forEach(spec => {
          const trimmedSpec = spec.trim();
          if (trimmedSpec) {
            message += `   • ${trimmedSpec}\n`;
          }
        });
      }

      if (item.bordado) {
        message += `   ✨ Bordado: SÍ\n`;
      }

      message += `   Cantidad: ${item.quantity} unidades\n`;
      message += `   Precio unitario: ${formatPrice(item.product.precio)}\n`;
      message += `   Subtotal: ${formatPrice(item.subtotal)}\n`;
      if (index < items.length - 1) {
        message += '\n';
      }
    });
  
    message += '--------------------------------\n\n';
  
    // RESUMEN
    // El subtotal ya es sin impuestos (calculado desde el total que incluye IVA)
    message += '*RESUMEN*\n';
    message += `Total de productos: ${itemCount} unidades\n`;
    message += `Total sin impuestos: ${formatPrice(subtotal)}\n`;
    message += `*TOTAL (impuestos incluidos): ${formatPrice(total)}*\n`;
  
    return encodeURIComponent(message);
  };

  const sendEmailConfirmation = async () => {
    try {
      const emailData = {
        to: customerData?.email,
        subject: 'Confirmación de Pedido - GND',
        customerData,
        shippingData,
        paymentData: payment,
        items,
        itemCount,
        subtotal,
        iva,
        total,
      };

      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar email');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return null;
    }
  };

  const handleSubmitOrder = async () => {
    // Validar que no sea compra mayorista antes de procesar
    if (isWholesaleLimitReached) {
      // No redirigir automáticamente, solo impedir procesar
      // El usuario debe usar el botón de mayorista si lo desea
      return;
    }

    setIsProcessing(true);

    try {
      setPaymentData(payment);

      const whatsappMessage = generateWhatsAppMessage();
      const whatsappNumber = getWhatsAppNumberForUrl();
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

      // Enviar email en segundo plano (no bloquea)
      sendEmailConfirmation().catch(() => {
        // Error silencioso - no crítico
      });

      setOrderSuccess(true);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        clearCart();
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }, 1500);
    } catch (error) {
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex items-center justify-center w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-1.5 sm:mb-2">¡PEDIDO CONFIRMADO!</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Tu pedido ha sido procesado exitosamente</p>
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">Se abrirá WhatsApp para finalizar la coordinación...</p>
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mt-1.5 sm:mt-2">
            También recibirás un email en {customerData?.email}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* LEFT SIDE - Resumen del Pedido */}
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">RESUMEN FINAL</h2>

        {/* Scrollable Summary */}
        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-2 space-y-2 sm:space-y-3">
          {/* Customer Summary */}
          <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-black">DATOS DEL CLIENTE</h3>
            <div className="text-[10px] sm:text-xs text-gray-700 space-y-1">
              <p>
                <strong>Nombre:</strong> {customerData?.nombre} {customerData?.apellido}
              </p>
              <p>
                <strong>Email:</strong> {customerData?.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {customerData?.telefono}
              </p>
              {customerData?.empresa && (
                <p>
                  <strong>Empresa:</strong> {customerData.empresa}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Summary */}
          <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-black">ENTREGA</h3>
            <div className="text-[10px] sm:text-xs text-gray-700 space-y-1">
              {shippingData?.tipo === 'envio' ? (
                <>
                  <p>
                    <strong>Tipo:</strong> Envío a domicilio
                  </p>
                  <p>
                    <strong>Dirección:</strong> {shippingData.direccion}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {shippingData.localidad}, {shippingData.provincia}
                  </p>
                  <p>
                    <strong>CP:</strong> {shippingData.codigo_postal}
                  </p>
                  {shippingData.fecha_entrega && (
                    <p>
                      <strong>Fecha preferida:</strong> {shippingData.fecha_entrega}
                    </p>
                  )}
                </>
              ) : (
                <p>
                  <strong>Tipo:</strong> Retiro en tienda
                </p>
              )}
              {shippingData?.notas && (
                <p>
                  <strong>Notas:</strong> {shippingData.notas}
                </p>
              )}
            </div>
          </div>

          {/* Products Summary */}
          <div className="bg-white border-l-2 border-black p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-black">PRODUCTOS ({items.length})</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {items.map((item, index) => (
                <div key={item.product.id} className="text-[10px] sm:text-xs bg-gray-50 p-1.5 sm:p-2 rounded">
                  <p className="font-semibold text-black">
                    {index + 1}. {item.product.nombre}
                  </p>
                  {item.especificaciones && (
                    <p className="text-gray-600 text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">{item.especificaciones}</p>
                  )}
                  {item.bordado && (
                    <p className="text-red-600 font-semibold mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">✨ Bordado: SÍ</p>
                  )}
                  <p className="text-gray-700 mt-0.5 sm:mt-1">Cantidad: {item.quantity} unidades</p>
                  <p className="text-gray-700">Precio unitario: {formatPrice(item.product.precio)}</p>
                  <p className="font-semibold text-black">Subtotal: {formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary - Sticky at bottom */}
          <div className="sticky bottom-0 bg-black text-white p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="font-bold text-xs sm:text-sm">TOTAL DE PRODUCTOS</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{itemCount}</span>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-gray-700 space-y-1">
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-300">
                <span>Total sin impuestos:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base lg:text-lg font-bold mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-gray-700">
                <span>TOTAL (impuestos incluidos):</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Payment Selection */}
      <div className="w-full lg:w-80 flex flex-col gap-3 sm:gap-4">
        <h2 className="text-xs sm:text-sm font-bold text-black">FORMA DE PAGO</h2>

        {/* Payment Methods */}
        <div className="space-y-2 sm:space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.id}
              onClick={() =>
                handlePaymentSelect(method.id as 'whatsapp' | 'transferencia' | 'efectivo' | 'tarjeta')
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-2 sm:p-3 border-2 rounded-lg text-left transition-all ${payment.metodo === method.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl lg:text-2xl text-black flex-shrink-0">{method.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h4
                      className={`font-semibold text-xs sm:text-sm ${payment.metodo === method.id ? 'text-black' : 'text-gray-900'
                        }`}
                    >
                      {method.name}
                    </h4>
                    {method.badge && (
                      <span className="text-[9px] sm:text-xs bg-red-600 text-white px-1.5 sm:px-2 py-0.5 rounded font-bold">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600">{method.description}</p>
                  {method.badgeCondition && (
                    <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 italic">{method.badgeCondition}</p>
                  )}
                </div>
                {payment.metodo === method.id && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Payment Notes */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-0.5 sm:mb-1">Notas sobre el pago</label>
          <textarea
            value={payment.notas}
            onChange={(e) => setPayment({ ...payment, notas: e.target.value })}
            rows={2}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:border-red-600 resize-none"
            placeholder="Ej: Prefiero pagar en efectivo..."
          />
        </div>

        {/* Payment Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3 text-[10px] sm:text-xs text-gray-700">
          <p className="font-bold text-black mb-1.5 sm:mb-2">MEDIOS DE PAGO</p>
          <ul className="space-y-1 sm:space-y-1.5">
            <li className="flex items-start gap-1.5 sm:gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Transferencia:</strong> -15% OFF</span>
            </li>
            <li className="flex items-start gap-1.5 sm:gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Tarjeta:</strong> Hasta 3 cuotas sin interés para compras superiores a $200.000</span>
            </li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 sm:p-3 text-[10px] sm:text-xs text-gray-700">
          <p className="font-bold text-black mb-1.5 sm:mb-2">¿QUÉ SUCEDE DESPUÉS?</p>
          <ul className="space-y-0.5 sm:space-y-1">
            <li>• Se abrirá WhatsApp con tu pedido</li>
            <li>• Recibirás un email de confirmación</li>
            <li>• Coordinaremos los detalles finales</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="blackOutline" size="sm" onClick={onBack} disabled={isProcessing} className="text-xs sm:text-sm py-1.5 sm:py-2">
            <ArrowLeft className="mr-1.5 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
            VOLVER
          </Button>
          <Button
            variant="black"
            size="sm"
            fullWidth
            onClick={handleSubmitOrder}
            disabled={isProcessing}
            className="text-xs sm:text-sm py-1.5 sm:py-2"
          >
            {isProcessing ? 'PROCESANDO...' : 'CONFIRMAR'}
          </Button>
        </div>
      </div>
    </div>
  );
}
