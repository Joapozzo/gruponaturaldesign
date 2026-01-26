import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartProduct, CartItem, CustomerData, ShippingData, PaymentData } from '../types/cart';

import { IVA_RATE, WHATSAPP_PHONE_NUMBER, getWhatsAppNumberForUrl } from '@/app/utils/constants';
import { canAddQuantity } from '@/app/services/stockService';
import { SALES_CONFIG } from '../config/sales.config';

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            customerData: null,
            shippingData: null,
            paymentData: null,
            itemCount: 0,
            subtotal: 0,
            subtotalTransfer: 0,
            totalLista: 0,
            totalTransfer: 0,
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

                    // Usar precioLista como precio base (si no está, usar precio como fallback)
                    const precioLista = product.precioLista ?? product.precio ?? 0;
                    const precioTransfer = product.precioTransfer ?? null;
                    const precioSinImp = product.precioSinImp ?? null;
                    
                    if (existingIndex > -1) {
                        newItems = [...state.items];
                        const item = newItems[existingIndex];
                        item.quantity += quantity;
                        item.subtotal = item.quantity * precioLista;
                        item.subtotalTransfer = precioTransfer ? item.quantity * precioTransfer : undefined;
                        item.subtotalSinImp = precioSinImp ? item.quantity * precioSinImp : undefined;
                    } else {
                        const newItem: CartItem = {
                            product: {
                                ...product,
                                precio: precioLista, // Mantener compatibilidad
                                precioLista: precioLista,
                                precioTransfer: precioTransfer,
                                precioSinImp: precioSinImp,
                            },
                            quantity,
                            subtotal: quantity * precioLista,
                            subtotalTransfer: precioTransfer ? quantity * precioTransfer : undefined,
                            subtotalSinImp: precioSinImp ? quantity * precioSinImp : undefined,
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
                            
                            // Usar precioLista como precio base
                            const precioLista = item.product.precioLista || item.product.precio || 0;
                            const precioTransfer = item.product.precioTransfer || null;
                            const precioSinImp = item.product.precioSinImp || null;
                            
                            return {
                                ...item,
                                quantity,
                                subtotal: quantity * precioLista,
                                subtotalTransfer: precioTransfer ? quantity * precioTransfer : undefined,
                                subtotalSinImp: precioSinImp ? quantity * precioSinImp : undefined,
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
                    subtotalTransfer: 0,
                    totalLista: 0,
                    totalTransfer: 0,
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

                const isWholesale = itemCount >= SALES_CONFIG.WHOLESALE_MIN_ITEMS;

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
                    message += `Este pedido de ${itemCount} unidades requiere compra mayorista (mínimo ${SALES_CONFIG.WHOLESALE_MIN_ITEMS} prendas).\n`;
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
                    state.subtotalTransfer = totals.subtotalTransfer;
                    state.totalLista = totals.totalLista;
                    state.totalTransfer = totals.totalTransfer;
                    state.iva = totals.iva;
                    state.total = totals.total;
                }
            },
        }
    )
);

function calculateTotals(items: CartItem[]) {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    
    // Calcular totales con precio lista
    const totalLista = items.reduce((acc, item) => {
        if (item.subtotal === 0 && item.product.precioLista && item.product.precioLista > 0) {
            return acc + (item.quantity * item.product.precioLista);
        }
        return acc + item.subtotal;
    }, 0);
    
    // Calcular totales con precio transfer
    const totalTransfer = items.reduce((acc, item) => {
        if (item.subtotalTransfer !== undefined) {
            return acc + item.subtotalTransfer;
        }
        // Si no hay subtotalTransfer pero hay precioTransfer, calcularlo
        if (item.product.precioTransfer && item.product.precioTransfer > 0) {
            return acc + (item.quantity * item.product.precioTransfer);
        }
        return acc;
    }, 0);
    
    // Calcular subtotal sin impuestos (usando precioSinImp si está disponible, sino calcular)
    const subtotalSinImp = items.reduce((acc, item) => {
        if (item.subtotalSinImp !== undefined) {
            return acc + item.subtotalSinImp;
        }
        // Si no hay subtotalSinImp pero hay precioSinImp, calcularlo
        if (item.product.precioSinImp && item.product.precioSinImp > 0) {
            return acc + (item.quantity * item.product.precioSinImp);
        }
        // Fallback: calcular desde precioLista / 1.21
        const precioLista = item.product.precioLista || item.product.precio || 0;
        return acc + (item.quantity * precioLista / (1 + IVA_RATE));
    }, 0);
    
    // El totalLista ya incluye IVA, entonces:
    // - Subtotal sin impuestos = totalLista / 1.21
    // - IVA = totalLista - subtotal sin impuestos
    const subtotalSinImpuestos = totalLista / (1 + IVA_RATE);
    const iva = totalLista - subtotalSinImpuestos;

    return { 
        itemCount, 
        subtotal: subtotalSinImpuestos,  // Subtotal sin impuestos (precio lista)
        subtotalTransfer: totalTransfer / (1 + IVA_RATE), // Subtotal transfer sin impuestos
        totalLista,  // Total con precio lista (con IVA)
        totalTransfer,  // Total con precio transfer (con IVA)
        iva, 
        total: totalLista  // Mantener compatibilidad (total con lista)
    };
}

export const sendOrderViaWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${getWhatsAppNumberForUrl()}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
};