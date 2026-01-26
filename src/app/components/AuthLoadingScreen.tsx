"use client";

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AuthLoadingScreenProps {
    message?: string;
}

export const AuthLoadingScreen = ({ message = "Iniciando sesión..." }: AuthLoadingScreenProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Loader2 className="w-12 h-12 text-[#Ed3237]" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-medium text-neutral-700"
                >
                    {message}
                </motion.p>
            </div>
        </motion.div>
    );
};

