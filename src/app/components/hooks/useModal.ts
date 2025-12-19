
'use client';
import { useState } from 'react';

type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface UseConfirmModalOptions {
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void | Promise<void>;
}

export const useConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalOptions, setModalOptions] = useState<UseConfirmModalOptions>({
        title: '',
        message: '',
        type: 'confirm',
    });

    const showModal = (options: UseConfirmModalOptions) => {
        setModalOptions(options);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setLoading(false);
    };

    const handleConfirm = async () => {
        if (modalOptions.onConfirm) {
            setLoading(true);
            try {
                await modalOptions.onConfirm();
                closeModal();
            } catch (error) {
                setLoading(false);
            }
        } else {
            closeModal();
        }
    };

    return {
        isOpen,
        loading,
        modalOptions,
        showModal,
        closeModal,
        handleConfirm,
    };
};