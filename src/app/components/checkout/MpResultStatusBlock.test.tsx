import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MpResultStatusBlock from './MpResultStatusBlock';

describe('MpResultStatusBlock', () => {
  it('muestra título de pago aprobado', () => {
    render(
      <MpResultStatusBlock
        uiStatus="approved"
        paymentId="pay-1"
        externalReference="ped-99"
      />
    );
    expect(screen.getByRole('heading', { name: 'Pago aprobado' })).toBeTruthy();
    expect(screen.getByText(/Tu pedido quedó registrado/)).toBeTruthy();
    expect(screen.getByText('pay-1')).toBeTruthy();
  });

  it('muestra referencia offline en pending', () => {
    render(
      <MpResultStatusBlock
        uiStatus="pending"
        paymentId={null}
        externalReference={null}
        offlinePaymentReference="REF-12345"
      />
    );
    expect(screen.getByText('Aguardando pago')).toBeTruthy();
    expect(screen.getByText('REF-12345')).toBeTruthy();
  });

  it('muestra snapshot de total e items', () => {
    render(
      <MpResultStatusBlock
        uiStatus="approved"
        paymentId={null}
        externalReference={null}
        snapshotTotalLabel="$ 10.000"
        snapshotItemCount={3}
      />
    );
    expect(screen.getByText(/Productos:/)).toBeTruthy();
    expect(screen.getByText(/3 u\./)).toBeTruthy();
    expect(screen.getByText(/\$ 10\.000/)).toBeTruthy();
  });

  it('botón reintentar solo en failure con handler', () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <MpResultStatusBlock
        uiStatus="failure"
        paymentId={null}
        externalReference={null}
        onRetryCheckout={onRetry}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar pago' }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(
      <MpResultStatusBlock
        uiStatus="approved"
        paymentId={null}
        externalReference={null}
        onRetryCheckout={onRetry}
      />
    );
    expect(screen.queryByRole('button', { name: 'Reintentar pago' })).toBeNull();
  });
});
