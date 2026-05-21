'use client';
import React from 'react';
import { motion } from 'framer-motion';
import BaseModal from './BaseModal';
import Button from '@/components/ui/Button';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  submitVariant?: 'black' | 'red' | 'blue';
  disabled?: boolean;
  footerActions?: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  showCancel = true,
  loading = false,
  size = 'lg',
  submitVariant = 'black',
  disabled = false,
  footerActions,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading && !disabled) {
      await onSubmit(e);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showCloseButton={true}
      closeOnOverlayClick={!loading}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Contenido del formulario - Scrollable */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 flex-1 overflow-y-auto pt-2 pb-4"
        >
          {children}
        </motion.div>

        {/* Footer con botones - Fixed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 pt-4 border-t border-gray-200 mt-4 flex-shrink-0 min-h-[60px]"
        >
          {footerActions || (
            <>
              {showCancel && (
                <Button
                  type="button"
                  variant="grayOutline"
                  size="lg"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                  className="tracking-wide h-12"
                >
                  {cancelText}
                </Button>
              )}
              <Button
                type="submit"
                variant="grayOutline"
                size="lg"
                fullWidth
                disabled={loading || disabled}
                className="tracking-wide h-12"
              >
                {loading ? 'Procesando...' : submitText}
              </Button>
            </>
          )}
        </motion.div>
      </form>
    </BaseModal>
  );
};

export default FormModal;

