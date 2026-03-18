'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface WizardFooterProps {
  pasoActual: number;
  totalPasos: number;
  onAnterior: () => void;
  onSiguiente: () => void;
  isLoading?: boolean;
  siguienteLabel?: string;
  anteriorLabel?: string;
  /** Deshabilita el botón Siguiente/Finalizar (ej. cuando no hay cambios en edición) */
  disabledSiguiente?: boolean;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  pasoActual,
  totalPasos,
  onAnterior,
  onSiguiente,
  isLoading = false,
  siguienteLabel = 'Siguiente',
  anteriorLabel = 'Anterior',
  disabledSiguiente = false,
}) => {
  const isFirstStep = pasoActual === 1;

  return (
    <div className="flex items-center justify-between w-full">
      <Button
        type="button"
        variant="grayOutline"
        size="lg"
        onClick={onAnterior}
        disabled={isLoading}
        className="tracking-wide h-12"
      >
        {isFirstStep ? 'Cancelar' : (
          <>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {anteriorLabel}
          </>
        )}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Paso {pasoActual} de {totalPasos}
        </span>
      </div>

      <Button
        type="button"
        variant="black"
        size="lg"
        onClick={onSiguiente}
        disabled={isLoading || disabledSiguiente}
        className="tracking-wide h-12 flex items-center justify-center min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            {siguienteLabel}
            {siguienteLabel === 'Siguiente' && (
              <ChevronRight className="w-4 h-4 ml-2" />
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardFooter;
