import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutShippingQuoteOptionCard } from './CheckoutShippingQuoteOptionCard';

vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      onClick,
      disabled,
      className,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      className?: string;
    }) => (
      <button type="button" onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    ),
  },
}));

const opt = {
  id: 'andreani-home' as const,
  carrierLabel: 'Andreani',
  modalityLabel: 'A domicilio',
  provider: 'andreani',
};

describe('CheckoutShippingQuoteOptionCard', () => {
  it('muestra precio y permite seleccionar', () => {
    const onOptionClick = vi.fn();
    render(
      <CheckoutShippingQuoteOptionCard
        opt={opt}
        q={{ precio: 3500 }}
        selected={false}
        quoteLoading={false}
        onOptionClick={onOptionClick}
        onCorreoRateSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Andreani')).toBeTruthy();
    expect(screen.getByText(/\$3\.500/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button'));
    expect(onOptionClick).toHaveBeenCalledWith('andreani-home');
  });

  it('muestra error de cotización', () => {
    render(
      <CheckoutShippingQuoteOptionCard
        opt={opt}
        q={{ error: 'Sin cobertura' }}
        selected={false}
        quoteLoading={false}
        onOptionClick={vi.fn()}
        onCorreoRateSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Sin cobertura')).toBeTruthy();
  });

  it('deshabilita click mientras quoteLoading', () => {
    const onOptionClick = vi.fn();
    render(
      <CheckoutShippingQuoteOptionCard
        opt={opt}
        q={{ precio: 1000 }}
        selected={false}
        quoteLoading={true}
        onOptionClick={onOptionClick}
        onCorreoRateSelect={vi.fn()}
      />
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveProperty('disabled', true);
    fireEvent.click(btn);
    expect(onOptionClick).not.toHaveBeenCalled();
  });
});
