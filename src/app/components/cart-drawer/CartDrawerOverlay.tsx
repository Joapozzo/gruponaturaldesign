'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CartDrawerOverlayProps {
    onClose: () => void;
}

export const CartDrawerOverlay: React.FC<CartDrawerOverlayProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm w-screen h-screen"
            style={{ zIndex: 99999 }}
            onClick={onClose}
        />
    );
};

