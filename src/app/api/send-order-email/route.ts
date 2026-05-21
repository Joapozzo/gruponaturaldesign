import { NextRequest, NextResponse } from 'next/server';
import type { CustomerData, ShippingData, PaymentData, CartItem } from '@/app/types/cart';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

interface EmailRequestBody {
  to: string;
  subject?: string;
  customerData: CustomerData;
  shippingData: ShippingData | null | undefined;
  paymentData: PaymentData | null | undefined;
  items: CartItem[];
  itemCount: number;
  subtotal?: number;
  iva?: number;
  total?: number;
}

/**
 * Reenvía el pedido al backend (Resend). El envío real ocurre en `api`.
 */
export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json();
    const { to, customerData, shippingData, paymentData, items, itemCount, subtotal, iva, total } = body;

    if (!to || !customerData || !items || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/emails/order-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: body.subject,
        customerData,
        shippingData: shippingData ?? undefined,
        paymentData: paymentData ?? undefined,
        items,
        itemCount,
        subtotal: subtotal ?? 0,
        iva: iva ?? 0,
        total: total ?? 0,
      }),
    });

    const data: unknown = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy send-order-email:', error);
    return NextResponse.json(
      {
        error: 'Error al enviar email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
