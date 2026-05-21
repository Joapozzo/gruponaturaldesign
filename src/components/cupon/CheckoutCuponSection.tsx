'use client';

import React from 'react';
import { useCart } from '@/app/components/hooks/useCart';
import { useCheckoutCupon } from '@/app/hooks/useCheckoutCupon';
import { CuponCodeField } from './CuponCodeField';
import { CuponAppliedBanner } from './CuponAppliedBanner';
import toast from 'react-hot-toast';

interface CheckoutCuponSectionProps {
  className?: string;
}

export function CheckoutCuponSection({ className }: CheckoutCuponSectionProps) {
  const { items, cuponAplicado, setCuponAplicado } = useCart();

  const { codigo, setCodigo, cuponAplicado: localCupon, isValidating, errorMessage, validate, clearCupon } = useCheckoutCupon({
    onSuccess: (cupon) => {
      setCuponAplicado(cupon);
      toast.success(`Cupón "${cupon.codigo}" aplicado: -$${cupon.descuentoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Cupón inválido');
    },
  });

  const handleAplicar = async () => {
    await validate(items);
  };

  const handleRemove = () => {
    clearCupon();
    setCuponAplicado(null);
    setCodigo('');
  };

  const currentCupon = localCupon || cuponAplicado;

  return (
    <div className={className}>
      {currentCupon ? (
        <CuponAppliedBanner cupon={currentCupon} onRemove={handleRemove} />
      ) : (
        <CuponCodeField
          value={codigo}
          onChange={setCodigo}
          onAplicar={handleAplicar}
          isLoading={isValidating}
          error={errorMessage}
        />
      )}
    </div>
  );
}