import { useState, useEffect } from 'react';

export type Step = 'info' | 'imagenes';

const STEPS: { key: Step; label: string }[] = [
  { key: 'info', label: 'Información' },
  { key: 'imagenes', label: 'Imágenes' },
];

export const useProductoSteps = (isOpen: boolean) => {
  const [currentStep, setCurrentStep] = useState<Step>('info');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('info');
    }
  }, [isOpen]);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep === 'info') {
      setCurrentStep('imagenes');
    }
  };

  const previousStep = () => {
    if (currentStep === 'imagenes') {
      setCurrentStep('info');
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return {
    currentStep,
    steps: STEPS,
    currentStepIndex,
    goToStep,
    nextStep,
    previousStep,
  };
};

