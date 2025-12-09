'use client';
import { useState } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalOptions {
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
}

export const useAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertModalOptions>({
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (alertOptions: AlertModalOptions) => {
    setOptions({
      ...alertOptions,
      type: alertOptions.type || 'info',
    });
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (options.onConfirm) {
      options.onConfirm();
    }
    closeAlert();
  };

  return {
    isOpen,
    options,
    showAlert,
    closeAlert,
    handleConfirm,
  };
};

