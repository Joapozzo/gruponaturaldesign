import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        pregunta: "¿Hacen uniformes personalizados?",
        respuesta: "Sí, nos especializamos en el diseño y desarrollo de uniformes personalizados. Te acompañamos desde la selección del tejido hasta el producto final."
    },
    {
        pregunta: "¿Envían al interior del país?",
        respuesta: "Sí, realizamos envíos a todo el territorio nacional. Trabajamos con empresas de Córdoba y todo el interior."
    },
    {
        pregunta: "¿Cuál es el tiempo de entrega?",
        respuesta: "Los tiempos varían según el tipo de producto y cantidad. Generalmente entre 15 a 30 días hábiles desde la confirmación del pedido."
    },
    {
        pregunta: "¿Ofrecen asesoramiento en diseño?",
        respuesta: "Absolutamente. Nuestra principal característica es el asesoramiento integral en diseño de uniformes empresariales."
    },
    {
        pregunta: "¿Trabajan con pequeñas empresas?",
        respuesta: "Sí, trabajamos con empresas de todos los tamaños. Tenemos más de 500 clientes que confían en nosotros."
    }
];

const Faq = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section id="preguntas" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        PREGUNTAS FRECUENTES
                    </h2>
                    <p className="text-xl text-gray-600">
                        Resolvemos las dudas más comunes de nuestros clientes
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white shadow-sm overflow-hidden border border-gray-100"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-all duration-200 flex justify-between items-center group"
                            >
                                <span className="font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                                    {faq.pregunta}
                                </span>
                                <motion.div
                                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <ChevronDown
                                        className="text-red-500 group-hover:text-red-600"
                                        size={24}
                                    />
                                </motion.div>
                            </button>

                            <AnimatePresence mode="wait">
                                {openFaq === index && (
                                    <motion.div
                                        initial={{
                                            maxHeight: 0,
                                            opacity: 0,
                                            paddingTop: 0,
                                            paddingBottom: 0
                                        }}
                                        animate={{
                                            maxHeight: 200,
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
                                        className="bg-white px-8 border-t border-gray-100 overflow-hidden"
                                    >
                                        <motion.p
                                            initial={{ y: -10 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -10 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            className="text-gray-600 leading-relaxed"
                                        >
                                            {faq.respuesta}
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Faq;