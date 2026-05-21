'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Store, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCheckoutStep3Shipping } from '@/app/hooks/useCheckoutStep3Shipping';
import { CheckoutAutofillStyles } from '@/app/components/checkout/CheckoutAutofillStyles';
import {
  CheckoutStep2FormField,
  CheckoutStep2TextArea,
} from '@/app/components/checkout/CheckoutStep2FormField';
import { CheckoutStep2Sidebar } from '@/app/components/checkout/CheckoutStep2Sidebar';
import { QUOTE_OPTIONS } from '@/app/components/checkout/shipping/shippingQuote.utils';
import { CheckoutSelectableDeliveryCard } from '@/app/components/checkout/shipping/CheckoutSelectableDeliveryCard';
import { CheckoutStorePickupPanel } from '@/app/components/checkout/shipping/CheckoutStorePickupPanel';
import { CheckoutShippingAddressSection } from '@/app/components/checkout/shipping/CheckoutShippingAddressSection';
import { CheckoutShippingQuoteOptionCard } from '@/app/components/checkout/shipping/CheckoutShippingQuoteOptionCard';
import { CheckoutShippingAgencySelect } from '@/app/components/checkout/shipping/CheckoutShippingAgencySelect';
import { CHECKOUT_STORE_PICKUP_ADDRESS } from '@/app/utils/constants';

export type { ShippingQuoteOptionId } from '@/app/components/checkout/shipping/shippingQuote.utils';

interface CheckoutStep3ShippingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function CheckoutStep3Shipping({ onNext, onBack }: CheckoutStep3ShippingProps) {
  const {
    items,
    itemCount,
    subtotal,
    total,
    shipping,
    errors,
    touched,
    handleShippingChange,
    patchShipping,
    handleBlur,
    handleSubmit,
    quoteLoading,
    quoteByOption,
    correoRatePick,
    selectedOptionId,
    agencyPick,
    agencies,
    agenciesLoading,
    onCodigoPostalBlur,
    canCalculateShipping,
    calculateShipping,
    handleSelectDeliveryTipo,
    handleOptionCardClick,
    handleCorreoRateSelect,
    onAgencySelect,
    canContinue,
    continueHint,
  } = useCheckoutStep3Shipping({ onNext });

  return (
    <>
      <CheckoutAutofillStyles />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pb-24 lg:pb-0">
        <div className="flex-1 flex flex-col min-w-0 space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-black mb-1">ENTREGA</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CheckoutSelectableDeliveryCard
              selected={shipping.tipo === 'envio'}
              onSelect={() => handleSelectDeliveryTipo('envio')}
              icon={Truck}
              title="Envío"
              description="A domicilio o sucursal del correo"
            />
            <CheckoutSelectableDeliveryCard
              selected={shipping.tipo === 'retiro'}
              onSelect={() => handleSelectDeliveryTipo('retiro')}
              icon={Store}
              title="Retiro en tienda"
              description="Retirás en nuestro punto de Alta Córdoba"
            />
          </div>

          <AnimatePresence mode="wait">
            {shipping.tipo === 'retiro' ? (
              <CheckoutStorePickupPanel
                key="retiro"
                title="Retiro"
                addressText={CHECKOUT_STORE_PICKUP_ADDRESS}
              />
            ) : (
              <motion.div
                key="envio"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <CheckoutShippingAddressSection
                  shipping={shipping}
                  errors={errors}
                  touched={touched}
                  onShippingChange={handleShippingChange}
                  patchShipping={patchShipping}
                  onBlur={handleBlur}
                  onCodigoPostalBlur={onCodigoPostalBlur}
                />

                {shipping.tipo === 'envio' ? (
                  <Button
                    variant="black"
                    size="sm"
                    fullWidth
                    onClick={calculateShipping}
                    disabled={!canCalculateShipping}
                    loading={quoteLoading}
                    className="text-xs sm:text-sm py-2"
                  >
                    Calcular costo de envío
                  </Button>
                ) : null}

                <div className="space-y-2 sm:space-y-3" aria-busy={quoteLoading}>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-black uppercase">
                      Opciones de envío
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {QUOTE_OPTIONS.map((opt) => (
                      <CheckoutShippingQuoteOptionCard
                        key={opt.id}
                        opt={opt}
                        q={quoteByOption[opt.id]}
                        selected={selectedOptionId === opt.id}
                        quoteLoading={quoteLoading}
                        correoRatePick={correoRatePick[opt.id]}
                        onOptionClick={handleOptionCardClick}
                        onCorreoRateSelect={handleCorreoRateSelect}
                      />
                    ))}
                  </div>

                  {selectedOptionId?.endsWith('-agency') ? (
                    <CheckoutShippingAgencySelect
                      agencies={agencies}
                      agenciesLoading={agenciesLoading}
                      value={agencyPick?.id ?? ''}
                      onChange={onAgencySelect}
                      error={errors.envio}
                    />
                  ) : null}
                </div>

                <CheckoutStep2FormField label="Notas adicionales">
                  <CheckoutStep2TextArea
                    value={shipping.notas ?? ''}
                    onChange={(e) => handleShippingChange('notas', e.target.value)}
                    rows={2}
                    placeholder="Ej: Timbre roto, llamar al llegar..."
                  />
                </CheckoutStep2FormField>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CheckoutStep2Sidebar
          items={items}
          itemCount={itemCount}
          subtotal={subtotal}
          total={total}
          shippingQuote={
            shipping.tipo === 'envio' ? shipping.checkoutEnvio?.clientQuotedAmount : undefined
          }
          onContinue={handleSubmit}
          onBack={onBack}
          continueDisabled={!canContinue}
          continueTitle={continueHint}
        />
      </div>
    </>
  );
}
