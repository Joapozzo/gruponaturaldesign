'use client';

import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Props = {
  onBack: () => void;
  onContinue: () => void;
  backLabel?: string;
  continueLabel?: string;
  backDisabled?: boolean;
  continueDisabled?: boolean;
  continueTitle?: string;
  hidden?: boolean;
  fixedOnMobile?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

export function CheckoutActionBar({
  onBack,
  onContinue,
  backLabel = 'VOLVER',
  continueLabel = 'CONTINUAR',
  backDisabled = false,
  continueDisabled = false,
  continueTitle,
  hidden = false,
  fixedOnMobile = true,
  size = 'sm',
  className,
}: Props) {
  if (hidden) return null;

  const isSm = size === 'sm';

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 sm:gap-2.5',
        fixedOnMobile && [
          'fixed bottom-0 inset-x-0 z-30',
          'bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.05)]',
          'px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
          'lg:static lg:inset-auto lg:z-auto lg:border-t-0 lg:shadow-none lg:px-0 lg:py-0',
        ],
        className,
      )}
    >
      <Button
        variant="ghost"
        size={size}
        onClick={onBack}
        disabled={backDisabled}
        className={cn('lg:hidden shrink-0 min-w-0', isSm ? 'p-2' : 'p-2.5')}
        aria-label={backLabel}
      >
        <ArrowLeft className={isSm ? 'w-4 h-4' : 'w-5 h-5'} />
      </Button>
      <Button
        variant="blackOutline"
        size={size}
        onClick={onBack}
        disabled={backDisabled}
        className={cn(
          'hidden lg:inline-flex shrink-0',
          isSm ? 'text-xs sm:text-sm py-1.5 sm:py-2 px-3' : 'text-sm sm:text-base py-2.5 sm:py-3 px-4',
        )}
      >
        <ArrowLeft className={cn('mr-2', isSm ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5')} />
        {backLabel}
      </Button>
      <Button
        variant="black"
        size={size}
        fullWidth
        onClick={onContinue}
        disabled={continueDisabled}
        title={continueDisabled ? continueTitle : undefined}
        className={cn(
          'flex-1 min-w-0 lg:w-full',
          isSm ? 'text-xs sm:text-sm py-1.5 sm:py-2' : 'text-sm sm:text-base py-2.5 sm:py-3 font-bold',
        )}
        aria-label={continueLabel}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
