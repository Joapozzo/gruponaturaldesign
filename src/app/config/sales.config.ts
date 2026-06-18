/**
 * Configuración centralizada de ventas minorista/mayorista
 * Cambiar estos valores afecta toda la aplicación
 */

export const SALES_CONFIG = {
  // Límites de cantidad
  WHOLESALE_MIN_ITEMS: 20, // Mínimo de artículos para considerar mayorista
  WHOLESALE_WARNING_THRESHOLD: 15, // Umbral para mostrar advertencia
  
  // Límites de cantidad por producto
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  
  // Configuración de bordado
  BORDADO_MIN_ITEMS: 5, // Mínimo de prendas para activar bordado
  
  // Rutas
  WHOLESALE_ROUTE: '/mayorista',
  CHECKOUT_ROUTE: '/checkout/pedido',
  SHOP_ROUTE: '/shoponline',
} as const;

export const PAYMENT_BENEFITS_COPY = {
  installmentsLabel: 'Hasta 3 cuotas',
  transferDiscountLabel: '15% off con transferencia',
  paymentMethodDescription: 'Hasta 3 cuotas - 15% off con transferencia',
} as const;

export type SalesMode = 'retail' | 'wholesale';

