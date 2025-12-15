'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  className?: string;
  zIndex?: number;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = 'md',
  closeOnOverlayClick = true,
  className = '',
  zIndex = 999999,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevenir scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Full screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm w-screen h-screen"
            style={{ zIndex: zIndex - 1 }}
            onClick={handleOverlayClick}
          />

          {/* Modal Container - Full screen container */}
          <div
            className="fixed inset-0 p-4 pointer-events-none flex items-center justify-center"
            style={{ zIndex }}
          >
            <div className={`pointer-events-auto w-full ${sizeClasses[size]} ${className}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                }}
                className="bg-white rounded-lg shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="relative p-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    {showCloseButton && (
                      <motion.button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Cerrar modal"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </motion.button>
                    )}
                    {title && (
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-bold text-black pr-10"
                      >
                        {title}
                      </motion.h3>
                    )}
                  </div>
                )}

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">{children}</div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default BaseModal;

