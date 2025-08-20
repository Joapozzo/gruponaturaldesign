import { motion } from 'framer-motion';
import { CheckCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
            subtitle="Más de 500 empresas confían en nosotros para vestir a sus equipos con calidad y profesionalismo"
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
                                    className="flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                >
                                    <div className="filter grayscale hover:grayscale-0 transition-all duration-300">
                                        {cliente.logo}
                                    </div>
                                </motion.div>
                            )
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Slider de Testimonios - Horizontal */}
            {/* <div className="relative max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="overflow-hidden"
                >
                    <motion.div
                        className="flex"
                        animate={{
                            x: `-${currentTestimonioIndex * 100}%`,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                        }}
                    >
                        {testimonios.map((testimonio, index) => (
                            <motion.div key={index} className="w-full flex-shrink-0 px-4">
                                <div className="bg-white p-8 lg:p-12 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg">

                                    <div className="flex items-center justify-center mb-6">
                                        {[...Array(testimonio.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 text-center italic">
                                        &ldquo;{testimonio.texto}&rdquo;
                                    </p>

                                    <div className="flex items-center justify-center">
                                        <CheckCircle
                                            className="text-gray-600 mr-3 flex-shrink-0"
                                            size={20}
                                        />
                                        <div className="text-center">
                                            <div className="font-bold text-gray-900 text-lg">
                                                {testimonio.nombre}
                                            </div>
                                            <div className="text-gray-500">{testimonio.cargo}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>


                <div className="flex items-center justify-center space-x-4 mt-8">
                    <button
                        onClick={prevTestimonio}
                        className="w-12 h-12 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </button>

                    <div className="flex space-x-2">
                        {testimonios.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonioIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonioIndex
                                        ? "bg-gray-800"
                                        : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextTestimonio}
                        className="w-12 h-12 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                    </button>
                </div>
            </div> */}

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
                    sus uniformes
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