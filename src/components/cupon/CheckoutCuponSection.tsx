'use client';

import React from 'react';
import { useCart } from '@/app/components/hooks/useCart';
import type { UseCheckoutCuponReturn } from '@/app/hooks/useCheckoutCupon';
import { CuponCodeField } from './CuponCodeField';
import { CuponAppliedBanner } from './CuponAppliedBanner';
import toast from 'react-hot-toast';

interface CheckoutCuponSectionProps {
  className?: string;
  cupon: UseCheckoutCuponReturn;
}

export function CheckoutCuponSection({ className, cupon }: CheckoutCuponSectionProps) {
  const { items, cuponAplicado, setCuponAplicado } = useCart();

  const handleAplicar = async () => {
    try {
      await cupon.validate(items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cupón inválido');
    }
  };

  const handleRemove = () => {
    cupon.clearCupon();
    setCuponAplicado(null);
  };

  const currentCupon = cupon.cuponAplicado || cuponAplicado;

  return (
    <div className={className}>
      {currentCupon ? (
        <CuponAppliedBanner cupon={currentCupon} onRemove={handleRemove} />
      ) : (
        <CuponCodeField
          value={cupon.codigo}
          onChange={cupon.setCodigo}
          onAplicar={handleAplicar}
          isLoading={cupon.isValidating}
          error={cupon.errorMessage}
        />
      )}
    </div>
  );
}
