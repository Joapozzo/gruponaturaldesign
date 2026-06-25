'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useCart } from '@/app/components/hooks/useCart';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import WholesaleBanner from '@/app/components/WholesaleBanner';
import { CHECKOUT_ROUTES } from '@/app/components/checkout/checkoutRoutes';

const STEPS = [
  { number: 1, title: 'Pedido', href: CHECKOUT_ROUTES.pedido },
  { number: 2, title: 'Datos', href: CHECKOUT_ROUTES.datos },
  { number: 3, title: 'Envío', href: CHECKOUT_ROUTES.envio },
  { number: 4, title: 'Pago', href: CHECKOUT_ROUTES.pago },
] as const;

function stepFromPathname(pathname: string | null): number {
  if (pathname === CHECKOUT_ROUTES.datos) return 2;
  if (pathname === CHECKOUT_ROUTES.envio) return 3;
  if (pathname === CHECKOUT_ROUTES.pago) return 4;
  return 1;
}

export default function CheckoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isWholesale } = useCart();
  const currentStep = stepFromPathname(pathname);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white flex flex-col">
        {isWholesale() && (
          <div className="flex-shrink-0 w-full">
            <WholesaleBanner />
          </div>
        )}

        <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
          <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15">
            <nav
              aria-label="Ruta de navegación"
              className="flex flex-wrap items-center gap-x-1.5 gap-y-1 py-1.5 sm:py-2 text-[11px] sm:text-xs"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-[#Ed3237] transition-colors font-medium"
                >
                  Home
                </Link>
              </motion.div>

              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" aria-hidden />

              <span className="text-gray-500 font-medium">Checkout</span>

              {STEPS.map((step) => {
                const isCurrent = currentStep === step.number;
                const isPast = currentStep > step.number;

                return (
                  <span key={step.href} className="contents">
                    <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" aria-hidden />
                    {isCurrent ? (
                      <span
                        className="text-black font-semibold"
                        aria-current="page"
                      >
                        {step.title}
                      </span>
                    ) : isPast ? (
                      <Link
                        href={step.href}
                        className="text-gray-600 hover:text-[#Ed3237] font-medium transition-colors underline-offset-2 hover:underline"
                      >
                        {step.title}
                      </Link>
                    ) : (
                      <span className="text-gray-400 font-medium" title="Completá los pasos anteriores">
                        {step.title}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>

            <div className="flex items-center py-1.5 sm:py-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight">CHECKOUT</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-15 py-6">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
