/**
 * Tipos para la página de perfil y pedidos del usuario.
 * Preparados para integrar con la API (misma estructura que devolverá el backend).
 */

export interface ProfileUser {
  uid: string;
  email: string;
  nombre: string | null;
  apellido: string | null;
  role: string;
  usuarioId: number;
}

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface OrderItemLine {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  especificaciones?: string;
}

export interface OrderSummary {
  id: string;
  numero: string;
  fecha: string;
  status: OrderStatus;
  total: number;
  items: OrderItemLine[];
}
