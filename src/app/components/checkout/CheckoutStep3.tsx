'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import Button from '../ui/Button';
import { PaymentData } from '@/app/types/cart';
import { RiBankLine } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
// import { FaWhatsapp } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa6";
import { ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/app/(pages)/producto/[id]/helpers/productHelpers';

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

  // No redirigir automáticamente - mostrar alerta cuando llegue a 20 unidades

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

      message += `   Cantidad: ${item.quantity} unidades\n`;
      message += `   Precio unitario: ${formatPrice(item.product.precio)}\n`;
      message += `   Subtotal: ${formatPrice(item.subtotal)}\n`;
      if (index < items.length - 1) {
        message += '\n';
      }
    });
  
    message += '--------------------------------\n\n';
  
    // RESUMEN
    message += '*RESUMEN*\n';
    message += `Total de productos: ${itemCount} unidades\n`;
    message += `Subtotal sin IVA: ${formatPrice(subtotal)}\n`;
    message += `*TOTAL (IVA incluido): ${formatPrice(total)}*\n`;
  
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
      console.error('Error al enviar email de confirmación:', error);
      return null;
    }
  };

  const handleSubmitOrder = async () => {
    // Validar que no sea compra mayorista antes de procesar
    if (itemCount >= 20) {
      // No redirigir automáticamente, solo impedir procesar
      // El usuario debe usar el botón de mayorista si lo desea
      return;
    }

    setIsProcessing(true);

    try {
      setPaymentData(payment);

      const whatsappMessage = generateWhatsAppMessage();
      const whatsappNumber = '5493517136311'; // +54 9 3517 13-6311
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

      // Enviar email en segundo plano (no bloquea)
      sendEmailConfirmation().catch(err => {
        console.error('Error al enviar email (no crítico):', err);
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
      console.error('Error processing order:', error);
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
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">¡PEDIDO CONFIRMADO!</h2>
          <p className="text-gray-600 mb-4">Tu pedido ha sido procesado exitosamente</p>
          <p className="text-sm text-gray-500">Se abrirá WhatsApp para finalizar la coordinación...</p>
          <p className="text-sm text-gray-500 mt-2">
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
        <h2 className="text-base lg:text-xl font-bold text-black mb-3 lg:mb-4">RESUMEN FINAL</h2>

        {/* Scrollable Summary */}
        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-2 space-y-4">
          {/* Customer Summary */}
          <div className="bg-white border-l-2 border-black p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-bold text-black">DATOS DEL CLIENTE</h3>
            <div className="text-xs text-gray-700 space-y-1">
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
          <div className="bg-white border-l-2 border-black p-4 rounded-lg space-y-2">
            <h3 className="text-sm font-bold text-black">ENTREGA</h3>
            <div className="text-xs text-gray-700 space-y-1">
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
          <div className="bg-white border-l-2 border-black p-4 rounded-lg space-y-3">
            <h3 className="text-sm font-bold text-black">PRODUCTOS ({items.length})</h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.product.id} className="text-xs bg-gray-50 p-2 rounded">
                  <p className="font-semibold text-black">
                    {index + 1}. {item.product.nombre}
                  </p>
                  {item.especificaciones && (
                    <p className="text-gray-600 text-xs mt-1">{item.especificaciones}</p>
                  )}
                  <p className="text-gray-700 mt-1">Cantidad: {item.quantity} unidades</p>
                  <p className="text-gray-700">Precio unitario: {formatPrice(item.product.precio)}</p>
                  <p className="font-semibold text-black">Subtotal: {formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary - Sticky at bottom */}
          <div className="sticky bottom-0 bg-black text-white p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm">TOTAL DE PRODUCTOS</span>
              <span className="text-2xl font-bold text-red-600">{itemCount}</span>
            </div>
            <div className="pt-3 border-t border-gray-700 space-y-1 text-sm">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Subtotal sin IVA:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-700">
                <span>TOTAL (IVA incluido):</span>
                <span className="text-red-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Payment Selection */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <h2 className="text-base lg:text-xl font-bold text-black">FORMA DE PAGO</h2>

        {/* Payment Methods */}
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.id}
              onClick={() =>
                handlePaymentSelect(method.id as 'whatsapp' | 'transferencia' | 'efectivo' | 'tarjeta')
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 border-2 rounded-lg text-left transition-all ${payment.metodo === method.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl text-black">{method.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold text-sm ${payment.metodo === method.id ? 'text-black' : 'text-gray-900'
                        }`}
                    >
                      {method.name}
                    </h4>
                    {method.badge && (
                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{method.description}</p>
                  {method.badgeCondition && (
                    <p className="text-xs text-gray-500 mt-0.5 italic">{method.badgeCondition}</p>
                  )}
                </div>
                {payment.metodo === method.id && (
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <label className="block text-xs font-medium text-gray-700 mb-1">Notas sobre el pago</label>
          <textarea
            value={payment.notas}
            onChange={(e) => setPayment({ ...payment, notas: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-red-600 resize-none"
            placeholder="Ej: Prefiero pagar en efectivo..."
          />
        </div>

        {/* Payment Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-bold text-black mb-2">MEDIOS DE PAGO</p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Transferencia:</strong> -15% OFF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span><strong>Tarjeta:</strong> Hasta 3 cuotas sin interés para compras superiores a $200.000</span>
            </li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-bold text-black mb-2">¿QUÉ SUCEDE DESPUÉS?</p>
          <ul className="space-y-1">
            <li>• Se abrirá WhatsApp con tu pedido</li>
            <li>• Recibirás un email de confirmación</li>
            <li>• Coordinaremos los detalles finales</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="blackOutline" size="md" onClick={onBack} disabled={isProcessing}>
            <ArrowLeft className="mr-2" />
            VOLVER
          </Button>
          <Button
            variant="black"
            size="lg"
            fullWidth
            onClick={handleSubmitOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'PROCESANDO...' : 'CONFIRMAR'}
          </Button>
        </div>
      </div>
    </div>
  );
}
