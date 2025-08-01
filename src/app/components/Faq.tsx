import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    MessageCircle
} from 'lucide-react';
import Section from './Section';
import Button from './ui/Button';
import { frequentFaqs, workProcessFaqs } from '../data/faqs';
import { useWhatsApp } from './hooks/useWhatsApp';


interface AccordionItemProps {
    faq: typeof frequentFaqs[0];
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
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
            <motion.button
                onClick={onToggle}
                className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-all duration-200 flex items-center justify-between group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-center space-x-4">
                    <motion.div
                        className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon className="text-gray-700 group-hover:scale-110 transition-transform duration-300 group-hover:text-gray-900" size={24} />
                    </motion.div>
                    <span className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
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
                                className="w-2 h-2 bg-gray-600 rounded-full mt-3 flex-shrink-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            />
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {faq.respuesta}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface WorkProcessCardProps {
    item: typeof workProcessFaqs[0];
    index: number;
}

const WorkProcessCard: React.FC<WorkProcessCardProps> = ({ item, index }) => {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            whileHover={{ y: -10 }}
        >
            <motion.div
                className="bg-gray-200 rounded-lg p-8 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgb(249 250 251)" // gray-50
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                >
                    <Icon className="text-red-700 group-hover:scale-110 transition-transform duration-300 group-hover:text-red-900" size={32} />
                </motion.div>

                <motion.h3
                    className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300 font-display"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                >
                    {item.title}
                </motion.h3>

                <motion.p
                    className="text-gray-600 leading-relaxed flex-grow group-hover:text-gray-800 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                >
                    {item.content}
                </motion.p>

                <motion.div
                    className="mt-6 flex items-center text-gray-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -20 }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-sm">Conocer más</span>
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="ml-2 rotate-[-90deg]" size={16} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const Faq: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { openWhatsApp } = useWhatsApp({ defaultMessage: "¡Hola! Me interesa saber más sobre sus servicios. ¿Te gustaría hablar conmigo?" });

    return (
        <Section
            id="preguntas"
            background="white"
            title="PREGUNTAS FRECUENTES"
            subtitle="Resolvé tus dudas más comunes sobre nuestros servicios y procesos"
            contentClassName="max-w-7xl mx-auto pb-20"
        >
            {/* Acordeones - Preguntas Frecuentes */}
            <motion.div
                className="max-w-4xl mx-auto space-y-4 mb-20"
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

            {/* Separador animado */}
            <motion.div
                className="flex items-center justify-center mb-16"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                />
                <div className="px-6">
                    <motion.div
                        className="w-3 h-3 bg-gray-600 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    />
                </div>
                <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-md"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                />
            </motion.div>

            {/* Cómo Trabajamos */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <motion.h2
                    className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    CÓMO TRABAJAMOS
                </motion.h2>
                <motion.p
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    Nuestro proceso integral te acompaña desde el diseño hasta la
                    entrega final
                </motion.p>
            </motion.div>

            {/* Cards de Proceso de Trabajo */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
            >
                {workProcessFaqs.map((item, index) => (
                    <WorkProcessCard key={index} item={item} index={index} />
                ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <motion.div
                    className="bg-gray-50 rounded-lg p-8 lg:p-12"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.h3
                        className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-display"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        ¿Tenés más consultas?
                    </motion.h3>
                    <motion.p
                        className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Nuestros vendedores están listos para asesorarte en todo el
                        proceso y resolver cualquier duda específica sobre tu proyecto.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            variant="black"
                            size="lg"
                            className="tracking-wide inline-flex items-center space-x-3"
                            onClick={() => openWhatsApp()}
                        >
                            <MessageCircle size={20} />
                            <span>CONTACTANOS AHORA</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </Section>
    );
};

export default Faq;