import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { useRouter } from 'next/navigation';

const EmptyCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const router = useRouter();

    const handleGoToProducts = () => {
        onClose();
        router.push('/#productos');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-6"
            >
                <ShoppingCart className="w-14 h-14 text-gray-400" />
            </motion.div>
            <motion.h3
                className="text-2xl font-bold text-black mb-3 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                TU CARRITO ESTÁ VACÍO
            </motion.h3>
            <motion.p
                className="text-gray-600 mb-8 max-w-sm leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Explorá nuestro catálogo y agregá productos para comenzar tu pedido
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    variant="black"
                    size="lg"
                    onClick={handleGoToProducts}
                    className="inline-flex items-center space-x-2 tracking-wide"
                >
                    <span>VER PRODUCTOS</span>
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </motion.div>
        </div>
    );
};

export default EmptyCart