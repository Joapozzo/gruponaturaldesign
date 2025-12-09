import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { testimonios } from '../data/testimonios';
import { logosClientes } from '../data/marcas';
import Section from './Section';
import Button from './ui/Button';
import { useWhatsApp } from './hooks/useWhatsApp';

const Testimonios = () => {
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
    const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState(0);
    const { openWhatsApp } = useWhatsApp({ defaultMessage: "¡Hola! Me interesa conocer más sobre los uniformes de NTDS. ¿Te gustaría hablar conmigo?" });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLogoIndex((prev) => (prev + 1) % logosClientes.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonioIndex((prev) => (prev + 1) % testimonios.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const nextTestimonio = () => {
        setCurrentTestimonioIndex((prev) => (prev + 1) % testimonios.length);
    };

    const prevTestimonio = () => {
        setCurrentTestimonioIndex((prev) => (prev - 1 + testimonios.length) % testimonios.length);
    };

    return (
        <Section
            id="testimonios"
            // background="gray"
            title="Nuestros clientes"
            subtitle="Más de 500 empresas confían en nosotros para vestir a sus equipos con calidad y profesionalismo."
            className='mb-20'
        >
            {/* Slider de Logos - Minimalista */}
            <div className="mb-10 px-4 sm:px-8 lg:px-20 xl:px-32">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="overflow-hidden"
                >
                    <motion.div
                        className="flex items-center justify-center space-x-6 sm:space-x-8 lg:space-x-12 w-full"
                        animate={{
                            x: `-${currentLogoIndex * 100}px`,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Triplicamos para efecto infinito */}
                        {[...logosClientes, ...logosClientes, ...logosClientes].map(
                            (cliente, index) => (
                                <motion.div
                                    key={`${cliente.nombre}-${index}`}
                                    className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                >
                                    <div className="filter grayscale hover:grayscale-0 transition-all duration-300 bg-gray-200 rounded-lg p-3 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                                        {cliente.logo}
                                    </div>
                                </motion.div>
                            )
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-full text-center mt-20 p-8 lg:p-12 shadow-sm bg-gray-800 flex flex-col items-center justify-center gap-4"
            >
                <h3 className="text-3xl lg:text-3xl font-bold text-gray-200 mb-4 font-display">
                    ¿Querés ser parte de nuestros clientes satisfechos?
                </h3>
                <p className="text-md text-gray-200 mb-5 max-w-2xl mx-auto leading-relaxed">
                    Contactanos y descubrí por qué más de 500 empresas eligen NTDS para
                    sus uniformes.
                </p>
                <Button
                    variant="lightWhite"
                    size="md"
                    className="tracking-wide inline-flex items-center space-x-3"
                    onClick={() => openWhatsApp()}
                >
                    <span>SOLICITAR COTIZACIÓN</span>
                    <CheckCircle className="w-5 h-5" />
                </Button>
            </motion.div>
        </Section>
    );
};

export default Testimonios;