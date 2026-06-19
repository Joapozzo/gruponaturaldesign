import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderSummarySection from './OrderSummarySection';
import type { CartItem, CustomerData, ShippingData } from '@/app/types/cart';

const customer: CustomerData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@gmail.com',
  telefono: '1122334455',
  tipo_documento: 'DNI',
};

const item: CartItem = {
  product: {
    id: 1,
    nombre: 'Remera',
    descripcion: '',
    categoria: 'Ropa',
    precio: 100,
    precioLista: 121,
    imagen: '/x.jpg',
  },
  quantity: 2,
  subtotal: 242,
};

describe('OrderSummarySection', () => {
  it('muestra productos, cliente y total con envío y cupón', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    render(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        total={242}
        shippingExtra={500}
        cuponAplicado={{ codigo: 'OFF10', descuentoTotal: 20 }}
      />
    );

    expect(screen.getByText(/Resumen final/i)).toBeTruthy();
    expect(screen.getByText(/Remera/)).toBeTruthy();
    expect(screen.getByText(/Juan/)).toBeTruthy();
    expect(screen.getByText(/Retiro en tienda/)).toBeTruthy();
    expect(screen.getByText(/Cupón OFF10/)).toBeTruthy();
    // 242 + 500 - 20 = 722
    expect(screen.getByText(/\$722/)).toBeTruthy();
  });

  it('muestra envío a domicilio con dirección', () => {
    const shipping: ShippingData = {
      tipo: 'envio',
      direccion: 'Calle 1',
      localidad: 'CABA',
      provincia: 'BA',
      codigo_postal: '1406',
      checkoutDelivery: 'homeDelivery',
      checkoutProvider: 'andreani',
    };
    render(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        total={242}
      />
    );
    expect(screen.getByText(/Envío a domicilio/)).toBeTruthy();
    expect(screen.getByText(/Calle 1/)).toBeTruthy();
    expect(screen.getByText(/Andreani/)).toBeTruthy();
  });

  it('footer mobile muestra solo productos y totales', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    render(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        total={242}
        variant="payment-footer"
      />
    );
    expect(screen.getByText(/2x Remera/)).toBeTruthy();
    expect(screen.getByText(/Subtotal productos/)).toBeTruthy();
    expect(screen.getByText(/^TOTAL$/)).toBeTruthy();
    expect(screen.queryByText(/^Cliente$/)).toBeNull();
    expect(screen.queryByText(/^Entrega$/)).toBeNull();
  });
});
