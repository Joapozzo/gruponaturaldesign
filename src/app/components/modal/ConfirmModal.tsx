'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';

// Tipos de modal
type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void | Promise<void>;
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'confirm',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    showCancel = true,
    loading = false,
}) => {
    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm();
        }
        if (!loading) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (!loading) {
            onClose();
        }
    };

    // Configuración de iconos y colores según el tipo
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
        confirm: {
            icon: AlertCircle,
            iconColor: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
        },
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={true}
            closeOnOverlayClick={!loading}
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

                {/* Footer con botones */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex gap-3"
                >
                    {showCancel && (
                        <Button
                            variant="grayOutline"
                            size="lg"
                            fullWidth
                            onClick={handleCancel}
                            disabled={loading}
                            className="tracking-wide"
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        variant={type === 'error' ? 'red' : 'black'}
                        size="lg"
                        fullWidth
                        onClick={handleConfirm}
                        disabled={loading}
                        className="tracking-wide"
                    >
                        {loading ? 'Procesando...' : confirmText}
                    </Button>
                </motion.div>
            </div>
        </BaseModal>
    );
};

export default ConfirmModal;