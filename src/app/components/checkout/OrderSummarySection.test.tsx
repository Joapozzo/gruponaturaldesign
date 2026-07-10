import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderSummarySection from './OrderSummarySection';
import type { CartItem, CustomerData, ShippingData } from '@/app/types/cart';

function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

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
  subtotalTransfer: 200,
};

describe('OrderSummarySection', () => {
  it('muestra productos, cliente y total con envío y cupón', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    renderWithQuery(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        total={242}
        shippingExtra={500}
        cuponAplicado={{
          id: 1,
          codigo: 'OFF10',
          nombre: 'OFF10',
          tipoDescuento: 'monto_fijo',
          valorDescuento: 20,
          descuentoTotal: 20,
        }}
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
    renderWithQuery(
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
    expect(screen.getAllByText(/Andreani/).length).toBeGreaterThan(0);
    expect(screen.getByText(/MEDIOS DE ENVÍO/i)).toBeTruthy();
  });

  it('muestra dirección desglosada calle y número', () => {
    const shipping: ShippingData = {
      tipo: 'envio',
      calle: 'San Martín',
      numero: '250',
      localidad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
      checkoutDelivery: 'homeDelivery',
    };
    renderWithQuery(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        total={242}
      />
    );
    expect(screen.getByText(/San Martín/)).toBeTruthy();
    expect(screen.getByText(/250/)).toBeTruthy();
  });

  it('footer mobile muestra solo productos y totales', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    renderWithQuery(
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

  it('modo transfer muestra lista tachada y precio OFF en productos y subtotal', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    const { container } = renderWithQuery(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={200}
        productsGross={200}
        productsGrossLista={242}
        payTotal={200}
        priceMode="transfer"
      />
    );

    expect(container.querySelectorAll('.line-through').length).toBeGreaterThan(0);
    expect(container.textContent).toMatch(/\$242/);
    expect(container.textContent).toMatch(/\$200/);
  });

  it('modo lista no muestra precio tachado', () => {
    const shipping: ShippingData = { tipo: 'retiro' };
    const { container } = renderWithQuery(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        subtotal={242}
        productsGross={242}
        productsGrossLista={242}
        payTotal={242}
        priceMode="lista"
      />
    );

    expect(container.querySelector('.line-through')).toBeNull();
  });

  it('cupón aparece antes del envío en totales', () => {
    const shipping: ShippingData = {
      tipo: 'envio',
      direccion: 'Calle 1',
      localidad: 'CABA',
      provincia: 'BA',
      codigo_postal: '1406',
      checkoutDelivery: 'homeDelivery',
    };
    renderWithQuery(
      <OrderSummarySection
        customerData={customer}
        shippingData={shipping}
        items={[item]}
        itemCount={2}
        productsGross={242}
        payTotal={722}
        shippingExtra={500}
        cuponAplicado={{
          id: 1,
          codigo: 'OFF10',
          nombre: 'OFF10',
          tipoDescuento: 'monto_fijo',
          valorDescuento: 20,
          descuentoTotal: 20,
        }}
      />
    );

    const text = document.body.textContent ?? '';
    const cuponIdx = text.indexOf('Cupón OFF10');
    const envioIdx = text.indexOf('+ Envío');
    expect(cuponIdx).toBeGreaterThan(-1);
    expect(envioIdx).toBeGreaterThan(-1);
    expect(cuponIdx).toBeLessThan(envioIdx);
  });
});
