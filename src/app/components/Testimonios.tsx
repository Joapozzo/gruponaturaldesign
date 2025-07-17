import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// Logos inventados con estilos
const logosClientes = [
    {
        nombre: "Coca-Cola",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-red-600 text-white px-6 py-2 font-bold text-xl">
                    Coca-Cola
                </div>
            </div>
        )
    },
    {
        nombre: "FIAT",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="border-4 border-blue-600 text-blue-600 px-8 py-3 font-bold text-2xl">
                    FIAT
                </div>
            </div>
        )
    },
    {
        nombre: "Grupo Tejamax",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-orange-500 text-white px-4 py-2  font-bold text-lg">
                    TEJAMAX
                </div>
            </div>
        )
    },
    {
        nombre: "TAMSE",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-green-600 text-white px-6 py-3 font-bold text-xl tracking-wider">
                    TAMSE
                </div>
            </div>
        )
    },
    {
        nombre: "FADeA",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="border-3 border-gray-800 text-gray-800 px-6 py-2 font-bold text-xl">
                    FADeA
                </div>
            </div>
        )
    },
    {
        nombre: "EXPERTO",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-purple-600 text-white px-5 py-2 font-bold text-lg">
                    EXPERTO
                </div>
            </div>
        )
    },
    {
        nombre: "PILAV",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-indigo-600 text-white px-6 py-3 font-bold text-xl">
                    PILAV
                </div>
            </div>
        )
    },
    {
        nombre: "UTHGRA",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-yellow-500 text-black px-5 py-2 font-bold text-lg">
                    UTHGRA
                </div>
            </div>
        )
    },
    {
        nombre: "CURF",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="border-4 border-teal-600 text-teal-600 px-6 py-2 font-bold text-xl">
                    CURF
                </div>
            </div>
        )
    },
    {
        nombre: "ABEST",
        logo: (
            <div className="flex items-center justify-center h-full">
                <div className="bg-red-500 text-white px-6 py-3 font-bold text-lg tracking-wide">
                    ABEST
                </div>
            </div>
        )
    }
];

// Testimonios
const testimonios = [
    {
        nombre: "Coca-Cola",
        texto: "Excelente calidad y atención personalizada en cada proyecto que desarrollamos juntos.",
        rating: 5,
        cargo: "Director de Recursos Humanos"
    },
    {
        nombre: "FIAT",
        texto: "Nos acompañaron en todo el proceso de diseño con profesionalismo excepcional.",
        rating: 5,
        cargo: "Gerente de Operaciones"
    },
    {
        nombre: "Grupo Tejamax",
        texto: "Profesionalismo y cumplimiento en tiempos que superó nuestras expectativas.",
        rating: 5,
        cargo: "Coordinador General"
    },
    {
        nombre: "TAMSE",
        texto: "La mejor relación calidad-precio del mercado, sin dudas volveremos a elegirlos.",
        rating: 5,
        cargo: "Jefe de Compras"
    },
    {
        nombre: "FADeA",
        texto: "Innovación y calidad en cada producto entregado, altamente recomendados.",
        rating: 5,
        cargo: "Supervisor de Planta"
    },
    {
        nombre: "EXPERTO",
        texto: "Servicio excepcional y productos duraderos que cumplen todos los estándares.",
        rating: 5,
        cargo: "Gerente de Calidad"
    }
];

const Testimonios = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll para el slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.ceil(logosClientes.length / 5));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonios" className="py-20 bg-[var(--gray-bg)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-[var(--black)] mb-6 font-display">
                        NUESTROS CLIENTES
                    </h2>
                    <p className="text-xl text-[var(--gray-medium)] max-w-3xl mx-auto">
                        Más de 500 empresas confían en nosotros para vestir a sus equipos con calidad y profesionalismo
                    </p>
                </motion.div>

                {/* Slider de Logos */}
                <div className="mb-20 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Gradientes en los bordes */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--gray-bg)] to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--gray-bg)] to-transparent z-10"></div>

                        {/* Slider infinito */}
                        <motion.div
                            className="flex space-x-8"
                            animate={{
                                x: `-${currentIndex * 20}%`,
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Duplicamos los logos para efecto infinito */}
                            {[...logosClientes, ...logosClientes].map((cliente, index) => (
                                <motion.div
                                    key={`${cliente.nombre}-${index}`}
                                    className="flex-shrink-0 w-48 h-24 bg-white shadow-sm hover:shadow-lg transition-all duration-500 group cursor-pointer"
                                    whileHover={{
                                        scale: 1.05,
                                        y: -5
                                    }}
                                >
                                    <div
                                        className="w-full h-full flex items-center justify-center filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                        title={cliente.nombre}
                                    >
                                        {cliente.logo}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                >
                    <div className="text-center bg-white p-8  shadow-sm">
                        <div className="text-4xl font-bold text-[var(--red)] mb-2">500+</div>
                        <div className="text-[var(--gray-medium)] font-medium">Clientes Satisfechos</div>
                    </div>
                    <div className="text-center bg-white p-8 shadow-sm">
                        <div className="text-4xl font-bold text-[var(--red)] mb-2">25+</div>
                        <div className="text-[var(--gray-medium)] font-medium">Años de Experiencia</div>
                    </div>
                    <div className="text-center bg-white p-8 shadow-sm">
                        <div className="text-4xl font-bold text-[var(--red)] mb-2">98%</div>
                        <div className="text-[var(--gray-medium)] font-medium">Satisfacción Cliente</div>
                    </div>
                </motion.div>

                {/* Testimonios Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonios.map((testimonio, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                {[...Array(testimonio.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>

                            {/* Testimonio */}
                            <p className="text-[var(--gray-medium)] italic leading-relaxed mb-6 group-hover:text-[var(--black)] transition-colors">
                                &ldquo;{testimonio.texto}&rdquo;
                            </p>

                            {/* Cliente info */}
                            <div className="flex items-center">
                                <CheckCircle className="text-[var(--red)] mr-3 flex-shrink-0" size={20} />
                                <div>
                                    <div className="font-bold text-[var(--black)]">{testimonio.nombre}</div>
                                    <div className="text-sm text-[var(--gray-medium)]">{testimonio.cargo}</div>
                                </div>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--red)] transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 bg-white p-12  shadow-sm"
                >
                    <h3 className="text-3xl font-bold text-[var(--black)] mb-4">
                        ¿Querés ser parte de nuestros clientes satisfechos?
                    </h3>
                    <p className="text-lg text-[var(--gray-medium)] mb-8 max-w-2xl mx-auto">
                        Contactanos y descubrí por qué más de 500 empresas eligen NTDS para sus uniformes
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[var(--red)] hover:bg-[var(--red-dark)] text-white px-8 py-4 font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-2"
                    >
                        <span>SOLICITAR COTIZACIÓN</span>
                        <CheckCircle className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonios;