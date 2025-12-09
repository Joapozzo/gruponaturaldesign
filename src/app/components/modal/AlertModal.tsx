'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
  showConfirm?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Aceptar',
  onConfirm,
  showConfirm = true,
}) => {
  const config = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
      closeOnOverlayClick={true}
    >
      <div className="text-center">
        {/* Icono animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            delay: 0.1,
            damping: 15,
            stiffness: 200,
          }}
          className={`w-16 h-16 mx-auto ${currentConfig.bgColor} ${currentConfig.borderColor} border-2 rounded-full flex items-center justify-center mb-4`}
        >
          <Icon className={`w-8 h-8 ${currentConfig.iconColor}`} />
        </motion.div>

        {/* Título */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-bold text-black mb-2 tracking-wide"
        >
          {title}
        </motion.h3>

        {/* Mensaje */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 leading-relaxed mb-6"
        >
          {message}
        </motion.p>

        {/* Botón de confirmación */}
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Button
              variant={type === 'error' ? 'red' : type === 'success' ? 'black' : 'black'}
              size="lg"
              fullWidth
              onClick={handleConfirm}
              className="tracking-wide"
            >
              {confirmText}
            </Button>
          </motion.div>
        )}
      </div>
    </BaseModal>
  );
};

export default AlertModal;

