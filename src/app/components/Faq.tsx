'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Section from './Section';
import { frequentFaqs } from '../data/faqs';

interface AccordionItemProps {
    faq: (typeof frequentFaqs)[0];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq, index, isOpen, onToggle }) => {
    const Icon = faq.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
            <motion.button
                onClick={onToggle}
                className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-all duration-200 flex items-center justify-between group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-center space-x-4">
                    <motion.div
                        className="p-3 bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon className="text-gray-700 group-hover:scale-110 transition-transform duration-300 group-hover:text-gray-900" size={24} />
                    </motion.div>
                    <span className="font-semibold text-xs md:text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                        {faq.pregunta}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                >
                    <ChevronDown
                        className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300"
                        size={24}
                    />
                </motion.div>
            </motion.button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{
                            maxHeight: 0,
                            opacity: 0,
                            paddingTop: 0,
                            paddingBottom: 0
                        }}
                        animate={{
                            maxHeight: 300,
                            opacity: 1,
                            paddingTop: 24,
                            paddingBottom: 24
                        }}
                        exit={{
                            maxHeight: 0,
                            opacity: 0,
                            paddingTop: 0,
                            paddingBottom: 0
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                            opacity: { duration: 0.25 }
                        }}
                        className="bg-gray-50 px-6 border-t border-gray-100 overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-start space-x-4"
                        >
                            <motion.div
                                className="w-2 h-2 bg-gray-600 mt-3 flex-shrink-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            />
                            <p className="text-gray-600 leading-relaxed font-medium text-xs md:text-sm">
                                {faq.respuesta}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Faq: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <Section
            id="preguntas"
            background="white"
            title="PREGUNTAS FRECUENTES"
            subtitle="Resolvé tus dudas más comunes sobre nuestros servicios y procesos."
            contentClassName="w-full px-4 lg:px-15 pb-20"
        >
            <motion.div
                className="max-w-4xl mx-auto space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
            >
                {frequentFaqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        faq={faq}
                        index={index}
                        isOpen={openFaq === index}
                        onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                    />
                ))}
            </motion.div>
        </Section>
    );
};

export default Faq;
