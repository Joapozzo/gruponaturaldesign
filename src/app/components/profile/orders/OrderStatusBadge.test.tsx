import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from './OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renderiza label y estilos de confirmado', () => {
    const { container } = render(
      <OrderStatusBadge status="confirmado" label="Confirmado" />
    );
    expect(screen.getByText('Confirmado')).toBeTruthy();
    expect(container.firstChild).toHaveProperty('className', expect.stringContaining('blue'));
  });

  it('usa estilos subtle cuando subtle=true', () => {
    const { container } = render(
      <OrderStatusBadge status="enviado" label="Enviado" subtle />
    );
    expect(container.firstChild).toHaveProperty('className', expect.stringContaining('purple'));
  });

  it('fallback a pendiente_confirmacion si status desconocido en map', () => {
    const { container } = render(
      <OrderStatusBadge status="pendiente_confirmacion" label="Pendiente" />
    );
    expect(container.firstChild).toHaveProperty('className', expect.stringContaining('amber'));
  });
});
