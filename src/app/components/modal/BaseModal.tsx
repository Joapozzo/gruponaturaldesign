'use client';
import React from 'react';
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
  zIndex = 100002,
}) => {
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm w-screen h-screen"
            style={{ zIndex: zIndex - 1 }}
            onClick={handleOverlayClick}
          />

          {/* Modal Container */}
          <div
            className="fixed top-0 left-0 right-0 bottom-0 p-4 pointer-events-none h-screen flex items-center justify-center"
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
};

export default BaseModal;

