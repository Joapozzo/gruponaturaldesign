'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useCart } from '@/app/components/hooks/useCart';
import ErrorBoundary from '@/app/components/ErrorBoundary';
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
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
      {/* Banner Mayorista - Solo si supera 20 unidades */}
      {isWholesale() && (
        <div className="flex-shrink-0 w-full">
          <WholesaleBanner />
        </div>
      )}

      {/* Breadcrumb Navigation - Fixed */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15 py-1.5 sm:py-2">
          <nav className="flex items-center gap-1.5 text-xs">
            <motion.button
              onClick={() => router.push('/#inicio')}
              className="flex items-center gap-0.5 text-gray-600 hover:text-[#Ed3237] transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </motion.button>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-black font-semibold">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Header - Compact */}
      <div className="flex-shrink-0 border-b border-gray-200 py-1.5 sm:py-2 sticky top-[32px] sm:top-[38px] bg-white z-10">
        <div className="flex items-center justify-between w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black font-display tracking-tight">CHECKOUT</h1>

          {/* Step Indicator - Horizontal Compact */}
          <div className="flex items-center gap-1">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-1">
                  <div
                    className={`rounded w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-[10px] sm:text-xs border transition-all ${
                      currentStep === step.number
                        ? 'bg-black text-white border-black'
                        : currentStep > step.number
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-400 border-gray-300'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold hidden sm:inline ${
                      currentStep >= step.number ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-4 sm:w-6 h-px mx-1 transition-all ${
                      currentStep > step.number ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content - ancho limitado solo aquí */}
      <div className="flex-1 w-full">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <CheckoutStep1 onNext={handleNextStep} onBack={() => router.push('/shoponline')} />
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
    </ErrorBoundary>
  );
}
