'use client';

import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';

interface CartDrawerHeaderProps {
    itemCount: number;
    onClose: () => void;
}

export const CartDrawerHeader: React.FC<CartDrawerHeaderProps> = ({ itemCount, onClose }) => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
                <motion.div
                    className="w-7 h-7 bg-black rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <ShoppingCart className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                    <h2 className="text-sm font-bold text-black tracking-wide">
                        MI CARRITO
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                    </p>
                </div>
            </div>
            <motion.button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Cerrar carrito"
            >
                <X className="w-4 h-4 text-gray-600" />
            </motion.button>
        </div>
    );
};

