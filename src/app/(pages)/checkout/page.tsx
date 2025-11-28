'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/components/hooks/useCart';
import CheckoutStep1 from '@/app/components/checkout/CheckoutStep1';
import CheckoutStep2 from '@/app/components/checkout/CheckoutStep2';
import CheckoutStep3 from '@/app/components/checkout/CheckoutStep3';
import WholesaleBanner from '@/app/components/WholesaleBanner';

const STEPS = [
  { number: 1, title: 'Pedido' },
  { number: 2, title: 'Datos' },
  { number: 3, title: 'Pago' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, isWholesale } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect if cart is empty
  // useEffect(() => {
  //   if (itemCount === 0) {
  //     router.push('/catalogo');
  //   }
  // }, [itemCount, router]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Banner Mayorista - Solo si supera 20 unidades */}
      {isWholesale() && (
        <div className="flex-shrink-0 w-full">
          <WholesaleBanner />
        </div>
      )}

      {/* Header - Compact */}
      <div className="flex-shrink-0 border-b border-gray-200 py-3 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-bold text-black">CHECKOUT</h1>

          {/* Step Indicator - Horizontal Compact */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-lg w-7 h-7 flex items-center justify-center font-bold text-xs border transition-all ${
                      currentStep === step.number
                        ? 'bg-black text-white border-black'
                        : currentStep > step.number
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      currentStep >= step.number ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-px mx-2 transition-all ${
                      currentStep > step.number ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <CheckoutStep1 onNext={handleNextStep} onBack={() => router.push('/catalogo')} />
              )}
              {currentStep === 2 && (
                <CheckoutStep2 onNext={handleNextStep} onBack={handlePrevStep} />
              )}
              {currentStep === 3 && (
                <CheckoutStep3 onBack={handlePrevStep} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
