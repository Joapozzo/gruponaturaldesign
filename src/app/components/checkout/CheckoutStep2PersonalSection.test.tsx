import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutStep2PersonalSection } from './CheckoutStep2PersonalSection';
import type { CustomerData } from '@/app/types/cart';

const formData: CustomerData = {
  nombre: '',
  apellido: 'Pérez',
  email: 'test@gmail.com',
  telefono: '',
  tipo_documento: 'DNI',
};

describe('CheckoutStep2PersonalSection', () => {
  it('muestra error de nombre cuando touched', () => {
    render(
      <CheckoutStep2PersonalSection
        formData={formData}
        errors={{ nombre: 'Requerido' }}
        touched={{ nombre: true }}
        confirmEmail="test@gmail.com"
        onCustomerChange={vi.fn()}
        onConfirmEmailChange={vi.fn()}
        onBlur={vi.fn()}
        onNecesitaFacturaChange={vi.fn()}
      />
    );
    expect(screen.getByText('Requerido')).toBeTruthy();
    expect(screen.getByText('Nombre')).toBeTruthy();
  });

  it('no muestra error si el campo no fue touched', () => {
    render(
      <CheckoutStep2PersonalSection
        formData={formData}
        errors={{ nombre: 'Requerido' }}
        touched={{}}
        confirmEmail=""
        onCustomerChange={vi.fn()}
        onConfirmEmailChange={vi.fn()}
        onBlur={vi.fn()}
        onNecesitaFacturaChange={vi.fn()}
      />
    );
    expect(screen.queryByText('Requerido')).toBeNull();
  });

  it('propaga onCustomerChange al editar nombre', () => {
    const onCustomerChange = vi.fn();
    render(
      <CheckoutStep2PersonalSection
        formData={formData}
        errors={{}}
        touched={{}}
        confirmEmail=""
        onCustomerChange={onCustomerChange}
        onConfirmEmailChange={vi.fn()}
        onBlur={vi.fn()}
        onNecesitaFacturaChange={vi.fn()}
      />
    );
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
    expect(onCustomerChange).toHaveBeenCalledWith('nombre', 'Ana');
  });
});
