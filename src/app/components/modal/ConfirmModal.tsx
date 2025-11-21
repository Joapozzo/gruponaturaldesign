'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';

// Tipos de modal
type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
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
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] w-screen h-screen"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] p-4 pointer-events-none h-screen flex items-center justify-center">
                        <div className="pointer-events-auto w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300
                            }}
                            className="bg-white rounded-lg shadow-2xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header con icono */}
                            <div className="relative p-6 pb-4">
                                {/* Botón cerrar */}
                                <motion.button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Cerrar modal"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </motion.button>

                                {/* Icono animado */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: 'spring',
                                        delay: 0.1,
                                        damping: 15,
                                        stiffness: 200
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
                                    className="text-2xl font-bold text-black text-center mb-2 tracking-wide"
                                >
                                    {title}
                                </motion.h3>

                                {/* Mensaje */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-600 text-center leading-relaxed"
                                >
                                    {message}
                                </motion.p>
                            </div>

                            {/* Footer con botones */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-gray-50 px-6 py-4 flex gap-3"
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
                        </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;