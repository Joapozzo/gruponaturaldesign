import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartProduct, CartItem, CustomerData, ShippingData, PaymentData } from '../types/cart';

import { IVA_RATE } from '@/app/utils/constants';
import { canAddQuantity } from '@/app/services/stockService';
const WHATSAPP_NUMBER = '+5493517136311';

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            customerData: null,
            shippingData: null,
            paymentData: null,
            itemCount: 0,
            subtotal: 0,
            iva: 0,
            total: 0,

            addItem: (product: CartProduct, quantity = 1, especificaciones = '', bordado = false) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.product.id === product.id && 
                        item.especificaciones === especificaciones &&
                        item.bordado === bordado
                    );

                    let newItems: CartItem[];

                    // Asegurar que el precio sea un número válido
                    let precio = 0;
                    if (typeof product.precio === 'number' && product.precio > 0) {
                        precio = product.precio;
                    } else {
                        // Convertir a string y parsear (por si viene como string desde alguna fuente externa)
                        const precioStr = String(product.precio || '0');
                        precio = parseFloat(precioStr.replace(/[^0-9.-]+/g, '')) || 0;
                    }
                    
                    if (existingIndex > -1) {
                        newItems = [...state.items];
                        newItems[existingIndex].quantity += quantity;
                        newItems[existingIndex].subtotal =
                            newItems[existingIndex].quantity * precio;
                    } else {
                        const newItem: CartItem = {
                            product: {
                                ...product,
                                precio: precio, // Asegurar que el precio en el producto también sea correcto
                            },
                            quantity,
                            subtotal: quantity * precio,
                            especificaciones: especificaciones || undefined,
                            bordado: bordado || false,
                        };
                        newItems = [...state.items, newItem];
                    }

                    return {
                        items: newItems,
                        ...calculateTotals(newItems),
                    };
                });
            },

            removeItem: (productId: number) => {
                set((state) => {
                    const newItems = state.items.filter(
                        (item) => item.product.id !== productId
                    );
                    return {
                        items: newItems,
                        ...calculateTotals(newItems),
                    };
                });
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set((state) => {
                    const newItems = state.items.map((item) => {
                        if (item.product.id === productId) {
                            // Validar stock disponible (lógica separada y delicada)
                            const stock = item.product.stock;
                            const currentQuantity = item.quantity;
                            if (!canAddQuantity(stock, currentQuantity, quantity - currentQuantity)) {
                                // No permitir incrementar más allá del stock disponible
                                return item;
                            }
                            
                            // Asegurar que el precio sea un número válido
                            let precio = 0;
                            if (typeof item.product.precio === 'number' && item.product.precio > 0) {
                                precio = item.product.precio;
                            } else {
                                // Convertir a string y parsear (por si viene como string desde alguna fuente externa)
                                const precioStr = String(item.product.precio || '0');
                                precio = parseFloat(precioStr.replace(/[^0-9.-]+/g, '')) || 0;
                            }
                            
                            return {
                                ...item,
                                quantity,
                                subtotal: quantity * precio,
                            };
                        }
                        return item;
                    });

                    return {
                        items: newItems,
                        ...calculateTotals(newItems),
                    };
                });
            },

            updateEspecificaciones: (productId: number, especificaciones: string) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId
                            ? { ...item, especificaciones }
                            : item
                    ),
                }));
            },

            updateBordado: (productId: number, bordado: boolean) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId
                            ? { ...item, bordado }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({
                    items: [],
                    customerData: null,
                    shippingData: null,
                    paymentData: null,
                    itemCount: 0,
                    subtotal: 0,
                    iva: 0,
                    total: 0,
                });
            },

            setCustomerData: (data: CustomerData) => set({ customerData: data }),
            setShippingData: (data: ShippingData) => set({ shippingData: data }),
            setPaymentData: (data: PaymentData) => set({ paymentData: data }),

            generateWhatsAppMessage: () => {
                const state = get();
                const { items, customerData, shippingData, subtotal, iva, total, itemCount } = state;

                if (!customerData) return '';

                const isWholesale = itemCount >= 20;

                let message = `🛍️ *${isWholesale ? 'PEDIDO MAYORISTA' : 'NUEVO PEDIDO'} - NTDS*\n\n`;
                if (isWholesale) {
                    message += `🏢 *PEDIDO MAYORISTA* (${itemCount} unidades)\n`;
                    message += `Este pedido requiere cotización personalizada mayorista.\n\n`;
                }
                message += `📋 *DATOS DEL CLIENTE*\n`;
                message += `Nombre: ${customerData.nombre} ${customerData.apellido}\n`;
                message += `Email: ${customerData.email}\n`;
                message += `Teléfono: ${customerData.telefono}\n`;
                if (customerData.empresa) message += `Empresa: ${customerData.empresa}\n`;
                message += `\n`;

                if (shippingData) {
                    message += `📦 *${shippingData.tipo === 'envio' ? 'ENVÍO' : 'RETIRO'}*\n`;
                    if (shippingData.tipo === 'envio') {
                        message += `Dirección: ${shippingData.direccion}\n`;
                        message += `Localidad: ${shippingData.localidad}, ${shippingData.provincia}\n`;
                        message += `CP: ${shippingData.codigo_postal}\n`;
                    }
                    if (shippingData.fecha_entrega) {
                        message += `Fecha entrega: ${shippingData.fecha_entrega}\n`;
                    }
                    if (shippingData.notas) message += `Notas: ${shippingData.notas}\n`;
                    message += `\n`;
                }

                message += `🛒 *PRODUCTOS*\n`;
                items.forEach((item, index) => {
                    message += `${index + 1}. ${item.product.nombre}\n`;
                    message += `   Cantidad: ${item.quantity}\n`;
                    message += `   Precio unit: $${item.product.precio.toLocaleString('es-AR')}\n`;
                    if (item.especificaciones) {
                        message += `   Detalles: ${item.especificaciones}\n`;
                    }
                    if (item.bordado) {
                        message += `   ✨ Bordado: SÍ\n`;
                    }
                    message += `   Subtotal: $${item.subtotal.toLocaleString('es-AR')}\n\n`;
                });

                message += `💰 *RESUMEN*\n`;
                message += `Total de unidades: ${itemCount}\n`;
                if (isWholesale) {
                    message += `\n🏢 *⚠️ PEDIDO MAYORISTA - REQUIERE COTIZACIÓN ⚠️*\n`;
                    message += `Este pedido de ${itemCount} unidades requiere compra mayorista (mínimo 20 prendas).\n`;
                    message += `Un asesor especializado se pondrá en contacto para ofrecer:\n`;
                    message += `• Precios mayoristas personalizados\n`;
                    message += `• Opciones de personalización (bordado/estampa)\n`;
                    message += `• Formas de pago preferenciales\n`;
                    message += `• Producción programada y logística a medida\n\n`;
                } else {
                    message += `Subtotal: $${subtotal.toLocaleString('es-AR')}\n`;
                    if (iva > 0) message += `IVA (21%): $${iva.toLocaleString('es-AR')}\n`;
                    message += `*TOTAL: $${total.toLocaleString('es-AR')}*\n\n`;
                }
                message += `_Pedido desde naturalonline.com.ar_`;

                return message;
            },
        }),
        {
            name: 'ntds-cart-storage',
            partialize: (state) => ({
                items: state.items,
                customerData: state.customerData,
                shippingData: state.shippingData,
                paymentData: state.paymentData,
            }),
            onRehydrateStorage: () => (state) => {
                // Recalcular totales cuando se carga desde localStorage
                if (state && state.items) {
                    const totals = calculateTotals(state.items);
                    state.itemCount = totals.itemCount;
                    state.subtotal = totals.subtotal;
                    state.iva = totals.iva;
                    state.total = totals.total;
                }
            },
        }
    )
);

function calculateTotals(items: CartItem[]) {
    // Calcular el total (precio ya incluye IVA)
    // El precio de los productos ya viene con IVA incluido
    const total = items.reduce((acc, item) => {
        // Si el subtotal es 0 pero el producto tiene precio, recalcular
        if (item.subtotal === 0 && item.product.precio && item.product.precio > 0) {
            const precio = typeof item.product.precio === 'number' 
                ? item.product.precio 
                : parseFloat(String(item.product.precio).replace(/[^0-9.-]+/g, '')) || 0;
            return acc + (item.quantity * precio);
        }
        return acc + item.subtotal;
    }, 0);
    
    // El total ya incluye IVA, entonces:
    // - Subtotal sin impuestos = total / 1.21
    // - IVA = total - subtotal sin impuestos
    const subtotalSinImpuestos = total / (1 + IVA_RATE);
    const iva = total - subtotalSinImpuestos;
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return { 
        itemCount, 
        subtotal: subtotalSinImpuestos,  // Subtotal sin impuestos
        iva, 
        total  // Total con IVA incluido
    };
}

export const sendOrderViaWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
};