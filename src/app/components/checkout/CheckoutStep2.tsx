'use client';

import { useCart } from '../hooks/useCart';
import { useSales } from '../../contexts/SalesContext';
import { useCheckoutStep2Form } from '@/app/hooks/useCheckoutStep2Form';
import { CheckoutAutofillStyles } from '@/app/components/checkout/CheckoutAutofillStyles';
import { CheckoutStep2PersonalSection } from '@/app/components/checkout/CheckoutStep2PersonalSection';
import { CheckoutStep2Sidebar } from '@/app/components/checkout/CheckoutStep2Sidebar';

interface CheckoutStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CheckoutStep2({ onNext, onBack }: CheckoutStep2Props) {
  const { customerData, setCustomerData, itemCount, items, subtotal, total } = useCart();
  const { isWholesaleLimitReached } = useSales();

  const {
    formData,
    confirmEmail,
    errors,
    touched,
    handleCustomerChange,
    handleConfirmEmailChange,
    handleBlur,
    handleSubmit,
  } = useCheckoutStep2Form(customerData, setCustomerData, isWholesaleLimitReached, onNext);

  return (
    <>
      <CheckoutAutofillStyles />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pb-24 lg:pb-0">
        <div className="flex-1 flex flex-col min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">DATOS DEL CLIENTE</h2>

          <div className="space-y-3 sm:space-y-4">
            <CheckoutStep2PersonalSection
              formData={formData}
              errors={errors}
              touched={touched}
              confirmEmail={confirmEmail}
              onCustomerChange={handleCustomerChange}
              onConfirmEmailChange={handleConfirmEmailChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <CheckoutStep2Sidebar
          items={items}
          itemCount={itemCount}
          subtotal={subtotal}
          total={total}
          onContinue={handleSubmit}
          onBack={onBack}
        />
      </div>
    </>
  );
}
