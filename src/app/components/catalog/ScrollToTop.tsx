'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface ScrollToTopProps {
    show: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ show }) => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-40"
                >
                    <Button
                        variant="black"
                        size="md"
                        onClick={scrollToTop}
                        className="rounded-full w-12 h-12 p-0 shadow-lg"
                    >
                        ↑
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;

