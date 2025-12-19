'use client';
import { useState } from 'react';

interface FormModalOptions {
  title: string;
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: any;
}

export const useFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<FormModalOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = (modalOptions: FormModalOptions) => {
    setOptions(modalOptions);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOptions(null);
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    if (!options) return;

    setLoading(true);
    try {
      await options.onSubmit(data);
      closeModal();
    } catch (error) {
      // El error se maneja en el componente que llama
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    options,
    loading,
    openModal,
    closeModal,
    handleSubmit,
  };
};

