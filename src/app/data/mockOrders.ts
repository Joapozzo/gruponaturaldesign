import type { OrderSummary } from '@/app/types/profile.types';

/**
 * Pedidos de ejemplo para la UI de perfil.
 * Reemplazar por llamada a API cuando esté disponible.
 */
export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: '1',
    numero: '#2024-001',
    fecha: '15 Feb 2025',
    status: 'entregado',
    total: 45200,
    items: [
      {
        id: '1-1',
        productName: 'Remera Básica Negra',
        quantity: 2,
        unitPrice: 8500,
        subtotal: 17000,
        especificaciones: 'Talle M',
      },
      {
        id: '1-2',
        productName: 'Pantalón Cargo',
        quantity: 1,
        unitPrice: 28200,
        subtotal: 28200,
      },
    ],
  },
  {
    id: '2',
    numero: '#2024-002',
    fecha: '28 Feb 2025',
    status: 'enviado',
    total: 18900,
    items: [
      {
        id: '2-1',
        productName: 'Buzo con capucha',
        quantity: 1,
        unitPrice: 18900,
        subtotal: 18900,
        especificaciones: 'Color gris',
      },
    ],
  },
  {
    id: '3',
    numero: '#2025-003',
    fecha: '2 Mar 2025',
    status: 'pendiente',
    total: 12500,
    items: [
      {
        id: '3-1',
        productName: 'Gorra Promocional',
        quantity: 5,
        unitPrice: 2500,
        subtotal: 12500,
      },
    ],
  },
];
